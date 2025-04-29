import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export interface Team {
  id: string;
  name: string;
  members?: TeamMember[];
  _count?: {
    projects: number;
  };
}

export interface TeamMember {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export async function getUserTeams() {
  const user = await getCurrentUser();
  if (!user) return { teams: [] };

  const teams = await db.team.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });

  return { teams };
}

export async function getTeamById(id: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const team = await db.team.findUnique({
    where: {
      id,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  return team;
}

export async function createTeam(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;
    const user = await getCurrentUser();
    if (!user) return { error: "Utilisateur non connecté" };

    const team = await db.team.create({
      data: {
        name,
        description,
        email,
        creatorId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, team };
  } catch (error) {
    console.error(error);
    return { error: "Une erreur est survenue lors de la création de l'équipe" };
  }
}
