import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { inviteId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { accept } = await req.json();
    const { inviteId } = params;

    // Vérifier si l'invitation existe et appartient à l'utilisateur
    const invite = await db.workspaceMember.findFirst({
      where: {
        id: inviteId,
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        workspace: true,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invitation non trouvée" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de l'invitation
    await db.workspaceMember.update({
      where: {
        id: inviteId,
      },
      data: {
        status: accept ? "ACCEPTED" : "DECLINED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la réponse à l'invitation:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
