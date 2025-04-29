"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Project } from "@/types/project";
import { NewProjectModal } from "@/components/project/new-project-modal";


interface ProjectListProps {
  projects: Project[];
  workspaceId: string;
  showCreateButton?: boolean;
}

export const ProjectList = ({
  projects,
  workspaceId,
  showCreateButton = true,
}: ProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Aucun projet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Commencez par créer votre premier projet.
          </p>
          {showCreateButton && <NewProjectModal workspaceId={workspaceId} />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showCreateButton && (
        <div className="flex justify-end">
          <NewProjectModal workspaceId={workspaceId} />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: Project) => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      project.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {project.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {project._count?.tasks} tâches • {project._count?.documents}{" "}
                    documents
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}