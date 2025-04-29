import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const pendingInvites = await db.workspaceMember.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        workspace: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pendingInvites);
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
