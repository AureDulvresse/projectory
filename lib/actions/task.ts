import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date;
}

export async function getWorkspaceTasks(workspaceId: string) {
  const user = await getCurrentUser();
  if (!user) return { tasks: [] };

  const tasks = await db.task.findMany({
    where: {
      project: {
        workspaceId,
      },
    },
    include: {
      project: true,
    },
  });

  return { tasks };
}

export async function createTask(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH";
    const dueDate = formData.get("dueDate") as string;
    const projectId = formData.get("projectId") as string;
    const user = await getCurrentUser();
    if (!user) return { error: "Utilisateur non connecté" };

    const task = await db.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: user.id,
        projectId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, task };
  } catch (error) {
    console.error(error);
    return { error: "Une erreur est survenue lors de la création de la tâche" };
  }
}
