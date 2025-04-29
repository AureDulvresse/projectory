"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createWorkspaceSchema, inviteSchema } from "@/validators/workspace";
import { getCurrentUser } from "@/lib/session";

// Créer un nouvel espace de travail
export const createWorkspace = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!user) {
      return { sucess: false, message: "Utilisateur non trouvé." };
    }

    const result = createWorkspaceSchema.safeParse({ name, description });
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }
    const maxMembers = user.subscription?.plan === "free" ? 5 : 999999;

    const workspace = await db.workspace.create({
      data: {
        name,
        description,
        ownerId: user.id,
        maxMembers,
        isPersonal: false,
      },
    });

    await db.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "ADMIN",
      },
    });

    revalidatePath("/dashboard/workspaces");
    return { success: true, data: workspace };
  } catch (error) {
    console.error("Erreur lors de la création de l'espace de travail:", error);
    return {
      error:
        "Une erreur est survenue lors de la création de l'espace de travail",
    };
  }
};

export const inviteToWorkspace = async (
  workspaceId: string,
  formData: FormData
) => {
  try {
    const user = await getCurrentUser();

    const email = formData.get("email") as string;
    const role = formData.get("role") as "ADMIN" | "MEMBER" | "VIEWER";

    if (!user) {
      return { sucess: false, message: "Utilisateur non trouvé." };
    }

    const result = inviteSchema.safeParse({ email, role });
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: user.id,
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
};

export const getWorkspaceProjects = async (workspaceId: string) => {
  try {
    const projects = await db.project.findMany({
      where: { workspaceId },
    });

    return { projects };
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return {
      error: "Une erreur est survenue lors de la récupération des projets",
    };
  }
};

export const getUserWorkspaces = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { sucess: false, message: "Utilisateur non trouvé." };
    }

    const workspaces = await db.workspace.findMany({
      where: {
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

    return { success: true, data: workspaces };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des espaces de travail:",
      error
    );
    return {
      error:
        "Une erreur est survenue lors de la récupération des espaces de travail",
    };
  }
};

// Supprimer un membre d'un espace de travail
export async function removeWorkspaceMember(
  workspaceId: string,
  memberId: string
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { sucess: false, message: "Utilisateur non trouvé." };
    }

    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: user.id,
        role: "ADMIN",
      },
    });

    if (!workspaceMember) {
      return { error: "Vous n'avez pas les droits pour supprimer des membres" };
    }

    // Vérifier si le membre à supprimer est le propriétaire
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { ownerId: true },
    });

    if (workspace?.ownerId === memberId) {
      return {
        error:
          "Vous ne pouvez pas supprimer le propriétaire de l'espace de travail",
      };
    }

    // Supprimer le membre
    await db.workspaceMember.deleteMany({
      where: {
        workspaceId,
        userId: memberId,
      },
    });

    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du membre:", error);
    return {
      error: "Une erreur est survenue lors de la suppression du membre",
    };
  }
}
