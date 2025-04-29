import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, getUserWorkspaces } from "@/actions/workspace"
import { getUserTeams } from "@/actions/team"
import { redirect } from "next/navigation"
import { NewTeamModal } from "@/components/dashboard/new-team-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function TeamsPage() {
  const user = await getCurrentUser()
  const { workspaces } = await getUserWorkspaces()

  if (!workspaces || workspaces.length === 0) {
    redirect("/dashboard/workspaces/new")
  }

  const currentWorkspace = workspaces[0]
  const { teams } = await getUserTeams()

  return (
    <DashboardShell currentWorkspace={currentWorkspace}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Équipes</h2>
            <p className="text-muted-foreground">
              Gérez vos équipes et leurs membres
            </p>
          </div>
          <NewTeamModal workspaceId={currentWorkspace.id} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams?.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>{team.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex -space-x-2">
                    {team.members?.slice(0, 5).map((member) => (
                      <Avatar key={member.id} className="border-2 border-background">
                        <AvatarImage src={member.user.image || ""} />
                        <AvatarFallback>
                          {member.user.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members && team.members.length > 5 && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {team._count?.projects || 0} projets
                    </span>
                    <Badge variant="outline">
                      {team.members?.length || 0} membres
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
} 