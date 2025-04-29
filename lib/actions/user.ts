"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { z } from "zod";
import {
  TenantSettings,
  UserWithTenant,
  CreateUserResponse,
} from "@/types/tenant";

// Schémas de validation unifiés
export const createUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

// Fonction réutilisable pour vérifier l'autorisation et obtenir le tenant
export async function getCurrentUserWithTenant() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Non autorisé");
  }

  const currentUser = (await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      tenants: true,
      subscription: true,
    },
  })) as UserWithTenant | null;

  if (!currentUser || !currentUser.primaryTenantId) {
    throw new Error("Tenant non trouvé");
  }

  const tenant = await db.tenant.findUnique({
    where: { id: currentUser.primaryTenantId },
    include: {
      users: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant non trouvé");
  }

  return { currentUser, tenant };
}

// Action principale pour créer un utilisateur
export async function createUser(
  data: CreateUserData
): Promise<CreateUserResponse> {
  try {
    // Validation des données
    const validatedData = createUserSchema.parse(data);

    // Récupération du contexte utilisateur/tenant
    const { currentUser, tenant } = await getCurrentUserWithTenant();

    // Vérifier si l'email existe déjà
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Vérifier les limites du plan
    const settings = tenant.settings as unknown as TenantSettings;
    if (!settings || typeof settings.maxUsers !== "number") {
      throw new Error("Configuration du tenant invalide");
    }
    const maxUsers = settings.maxUsers;
    if (tenant.users.length >= maxUsers) {
      // Si le plan est gratuit, proposer une mise à niveau
      if (currentUser.subscription?.plan === "free") {
        throw new Error("LIMIT_REACHED:FREE");
      }
      throw new Error("Limite d'utilisateurs atteinte");
    }

    // Créer l'utilisateur
    const hashedPassword = await hash(validatedData.password, 10);
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        primaryTenantId: tenant.id,
        tenants: {
          connect: { id: tenant.id },
        },
      },
    });

    // Ajouter l'utilisateur à l'espace de travail par défaut
    const defaultWorkspace = await db.workspace.findFirst({
      where: {
        tenantId: tenant.id,
        isPersonal: false,
      },
    });

    if (defaultWorkspace) {
      await db.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: defaultWorkspace.id,
          role: validatedData.role === "ADMIN" ? "ADMIN" : "MEMBER",
        },
      });
    }

    revalidatePath("/settings/users");
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    // Récupération du contexte utilisateur/tenant
    const { currentUser, tenant } = await getCurrentUserWithTenant();

    // Vérifier si l'utilisateur à supprimer appartient au même tenant
    const userToDelete = await db.user.findUnique({
      where: { id: userId },
      include: {
        tenants: true,
      },
    });

    if (!userToDelete) {
      throw new Error("Utilisateur non trouvé");
    }

    const userBelongsToTenant = userToDelete.tenants.some(
      (t) => t.id === currentUser.primaryTenantId
    );

    if (!userBelongsToTenant) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cet utilisateur");
    }

    // Supprimer l'utilisateur
    await db.user.delete({
      where: { id: userId },
    });

    revalidatePath("/settings/users");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw error;
  }
}

export async function getTenantUsers() {
  try {
    // Récupération du contexte utilisateur/tenant
    const { currentUser } = await getCurrentUserWithTenant();

    // Récupérer les utilisateurs du tenant
    const users = await db.user.findMany({
      where: {
        tenants: {
          some: {
            id: currentUser.primaryTenantId || undefined,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return { users };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
}
