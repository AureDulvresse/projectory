import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "@/lib/actions/user";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Utilisation du server action
    await deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(
      "API - Erreur lors de la suppression de l'utilisateur:",
      error
    );

    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (error.message === "Tenant non trouvé") {
      return NextResponse.json({ error: "Tenant non trouvé" }, { status: 404 });
    }

    if (error.message === "Utilisateur non trouvé") {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (
      error.message === "Vous n'êtes pas autorisé à supprimer cet utilisateur"
    ) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cet utilisateur" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la suppression de l'utilisateur",
      },
      { status: 500 }
    );
  }
}
