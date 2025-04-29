import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getUserWorkspaces } from "@/lib/actions/workspace";
import { getWorkspaceTasks } from "@/lib/actions/task";
import { redirect } from "next/navigation";
import { NewTaskModal } from "@/components/task/new-task-modal";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getCurrentUser } from "@/lib/session";
import { AppShell } from "@/components/global/shell";

export default async function TasksPage() {
  const user = await getCurrentUser();
  const { data: workspaces } = await getUserWorkspaces();

  if (!workspaces || workspaces.length === 0) {
    redirect("/dashboard/workspaces/new");
  }

  const currentWorkspace = workspaces[0];
  const { tasks } = await getWorkspaceTasks(currentWorkspace.id);

  return (
    <AppShell currentWorkspace={currentWorkspace}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tâches</h2>
            <p className="text-muted-foreground">
              Gérez vos tâches et suivez leur progression
            </p>
          </div>
          <NewTaskModal workspaceId={currentWorkspace.id} />
        </div>

        <div className="grid gap-4">
          {tasks?.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-md transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{task.title}</CardTitle>
                  <Badge
                    variant={task.status === "DONE" ? "secondary" : "default"}
                  >
                    {task.status}
                  </Badge>
                </div>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Priorité: {task.priority}</span>
                  {task.dueDate && (
                    <span>
                      Échéance:{" "}
                      {format(new Date(task.dueDate), "PPP", { locale: fr })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
