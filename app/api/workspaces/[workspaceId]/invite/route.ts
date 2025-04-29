import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

// Schéma de validation pour l'invitation
const inviteSchema = z.object({
  email: z.string().email("Email invalide"),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const formData = await req.formData();
    const email = formData.get("email") as string;
    const role = formData.get("role") as "ADMIN" | "MEMBER" | "VIEWER";

    // Valider les données
    const result = inviteSchema.safeParse({ email, role });
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { workspaceId } = params;

    // Vérifier si l'utilisateur a les droits d'administration
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!workspaceMember) {
      return NextResponse.json(
        { error: "Vous n'avez pas les droits pour inviter des membres" },
        { status: 403 }
      );
    }

    // Vérifier si l'espace de travail existe
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Espace de travail non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier la limite de membres
    if (workspace.members.length >= workspace.maxMembers) {
      return NextResponse.json(
        { error: "Limite de membres atteinte pour ce plan" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur invité existe
    const invitedUser = await db.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: invitedUser.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "L'utilisateur est déjà membre de cet espace de travail" },
        { status: 400 }
      );
    }

    // Ajouter le membre à l'espace de travail
    const newMember = await db.workspaceMember.create({
      data: {
        userId: invitedUser.id,
        workspaceId,
        role: role || "MEMBER",
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    console.error("Erreur lors de l'invitation:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'invitation" },
      { status: 500 }
    );
  }
}
