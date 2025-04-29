"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const projectSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom du projet doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  workspaceId: z.string(),
  teamId: z.string().optional(),
});

export const createProject = async (data: {
  name: string;
  description?: string;
  workspaceId: string;
  teamId?: string;
}) => {
  try {
    // Validation des données
    const validatedData = projectSchema.parse(data);

    // Vérification que l'utilisateur a accès à l'espace de travail
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: validatedData.workspaceId,
        status: "ACCEPTED",
      },
    });

    if (!workspaceMember) {
      throw new Error("Vous n'avez pas accès à cet espace de travail");
    }

    // Création du projet
    const project = await db.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        workspaceId: validatedData.workspaceId,
        teamId: validatedData.teamId,
        userId: workspaceMember.userId,
        status: "ACTIVE",
      },
    });

    // Création d'une activité pour la création du projet
    await db.activity.create({
      data: {
        type: "PROJECT_CREATED",
        description: `Projet "${validatedData.name}" créé`,
        userId: workspaceMember.userId,
        projectId: project.id,
      },
    });

    // Revalidation du cache pour la page du tableau de bord
    revalidatePath("/dashboard");

    return project;
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const updateProject = async (
  projectId: string,
  data: {
    name?: string;
    description?: string;
    status?: "ACTIVE" | "ARCHIVED" | "COMPLETED";
  }
) => {
  try {
    const project = await db.project.update({
      where: { id: projectId },
      data,
    });

    // Création d'une activité pour la mise à jour du projet
    await db.activity.create({
      data: {
        type: "PROJECT_UPDATED",
        description: `Projet "${project.name}" mis à jour`,
        userId: project.userId,
        projectId: project.id,
      },
    });

    revalidatePath("/dashboard");
    return project;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const project = await db.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/dashboard");
    return project;
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    throw error;
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: true,
        team: true,
        tasks: true,
        documents: true,
      },
    });

    return project;
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    throw error;
  }
};

export const getProjectsByWorkspace = async (workspaceId: string) => {
  try {
    const projects = await db.project.findMany({
      where: { workspaceId },
      include: {
        team: true,
        tasks: {
          where: { status: "TODO" },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return projects;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    throw error;
  }
};
