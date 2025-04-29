import { ProjectList } from "@/components/dashboard/project-list"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { getCurrentUser, getUserWorkspaces } from "@/actions/workspace"
import { getWorkspaceProjects } from "@/actions/project"
import { redirect } from "next/navigation"
import { NewProjectModal } from "@/components/dashboard/new-project-modal"

export default async function ProjectsPage() {
  const user = await getCurrentUser()
  const { workspaces } = await getUserWorkspaces()

  if (!workspaces || workspaces.length === 0) {
    redirect("/dashboard/workspaces/new")
  }

  const currentWorkspace = workspaces[0]
  const { projects } = await getWorkspaceProjects(currentWorkspace.id)

  return (
    <DashboardShell currentWorkspace={currentWorkspace}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Projets</h2>
            <p className="text-muted-foreground">
              Gérez vos projets et suivez leur progression
            </p>
          </div>
          <NewProjectModal workspaceId={currentWorkspace.id} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Statut: {project.status}</span>
                  <span>{project._count.tasks} tâches</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
} 