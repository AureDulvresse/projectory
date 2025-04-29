import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  createUserSchema,
  getTenantUsers,
} from "@/lib/actions/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Utilisation du server action
    const { success, user } = await createUser(result.data);

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("API - Erreur lors de l'ajout d'utilisateur:", error);

    // Gestion des erreurs spécifiques
    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (error.message === "Tenant non trouvé") {
      return NextResponse.json({ error: "Tenant non trouvé" }, { status: 404 });
    }

    if (error.message === "Un utilisateur avec cet email existe déjà") {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    if (error.message === "LIMIT_REACHED:FREE") {
      return NextResponse.json(
        {
          error: "Limite d'utilisateurs atteinte",
          upgradeRequired: true,
          currentPlan: "free",
        },
        { status: 403 }
      );
    }

    if (error.message === "Limite d'utilisateurs atteinte") {
      return NextResponse.json(
        { error: "Limite d'utilisateurs atteinte" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'ajout d'utilisateur" },
      { status: 500 }
    );
  }
}

// Route pour récupérer les utilisateurs d'un tenant
export async function GET() {
  try {
    // Utilisation du server action
    const { users } = await getTenantUsers();

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error(
      "API - Erreur lors de la récupération des utilisateurs:",
      error
    );

    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (error.message === "Tenant non trouvé") {
      return NextResponse.json({ error: "Tenant non trouvé" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la récupération des utilisateurs",
      },
      { status: 500 }
    );
  }
}
