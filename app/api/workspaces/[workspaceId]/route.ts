import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authConfig } from "@/lib/auth/auth.config";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: params.workspaceId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!workspace) {
      return new NextResponse("Espace de travail non trouvé", { status: 404 });
    }

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("[WORKSPACE_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
