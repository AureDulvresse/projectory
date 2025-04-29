"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

// Schéma de validation pour l'invitation
const inviteSchema = z.object({
  email: z.string().email("Email invalide"),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});

// Inviter un utilisateur à un espace de travail
export async function inviteToWorkspace(
  workspaceId: string,
  formData: FormData
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Non authentifié" };
    }

    const email = formData.get("email") as string;
    const role = formData.get("role") as "ADMIN" | "MEMBER" | "VIEWER";

    // Valider les données
    const result = inviteSchema.safeParse({ email, role });
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    // Vérifier si l'utilisateur a les droits d'administration
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!workspaceMember) {
      return { error: "Vous n'avez pas les droits pour inviter des membres" };
    }

    // Vérifier si l'espace de travail existe
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) {
      return { error: "Espace de travail non trouvé" };
    }

    // Vérifier la limite de membres
    if (workspace.members.length >= workspace.maxMembers) {
      return { error: "Limite de membres atteinte pour ce plan" };
    }

    // Vérifier si l'utilisateur invité existe
    const invitedUser = await db.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return { error: "Utilisateur non trouvé" };
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: invitedUser.id,
      },
    });

    if (existingMember) {
      return {
        error: "L'utilisateur est déjà membre de cet espace de travail",
      };
    }

    // Ajouter le membre à l'espace de travail
    const newMember = await db.workspaceMember.create({
      data: {
        userId: invitedUser.id,
        workspaceId,
        role: role || "MEMBER",
      },
    });

    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    return { success: true, member: newMember };
  } catch (error) {
    console.error("Erreur lors de l'invitation:", error);
    return { error: "Une erreur est survenue lors de l'invitation" };
  }
}

// Obtenir les invitations en attente pour un utilisateur
export async function getPendingInvitations() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Non authentifié" };
    }

    const invitations = await db.workspaceMember.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return { invitations };
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations:", error);
    return {
      error: "Une erreur est survenue lors de la récupération des invitations",
    };
  }
}

// Accepter une invitation
export async function acceptInvitation(invitationId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Non authentifié" };
    }

    const invitation = await db.workspaceMember.findUnique({
      where: { id: invitationId },
      include: { workspace: true },
    });

    if (!invitation) {
      return { error: "Invitation non trouvée" };
    }

    if (invitation.userId !== session.user.id) {
      return { error: "Vous n'êtes pas autorisé à accepter cette invitation" };
    }

    // Mettre à jour le statut de l'invitation
    await db.workspaceMember.update({
      where: { id: invitationId },
      data: { status: "ACCEPTED" },
    });

    revalidatePath("/dashboard/workspaces");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'acceptation de l'invitation:", error);
    return {
      error: "Une erreur est survenue lors de l'acceptation de l'invitation",
    };
  }
}

// Refuser une invitation
export async function declineInvitation(invitationId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Non authentifié" };
    }

    const invitation = await db.workspaceMember.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return { error: "Invitation non trouvée" };
    }

    if (invitation.userId !== session.user.id) {
      return { error: "Vous n'êtes pas autorisé à refuser cette invitation" };
    }

    // Supprimer l'invitation
    await db.workspaceMember.delete({
      where: { id: invitationId },
    });

    revalidatePath("/dashboard/workspaces");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du refus de l'invitation:", error);
    return { error: "Une erreur est survenue lors du refus de l'invitation" };
  }
}
