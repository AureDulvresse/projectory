import { AppShell } from "@/components/global/shell";
import { WorkspaceList } from "@/components/workspace/workspace-list";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserWorkspaces } from "@/lib/actions/workspace";

export default async function WorkspacesPage() {
  const { workspaces } = await getUserWorkspaces();

  return (
    <AppShell>
      <div className="grid gap-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-indigo-100/20 dark:border-indigo-900/20 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-indigo-500" />
                Espaces de travail
              </CardTitle>
              <CardDescription>
                Nombre total d'espaces de travail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{workspaces?.length || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-indigo-100/20 dark:border-indigo-900/20 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-violet-500" />
                Membres
              </CardTitle>
              <CardDescription>Nombre total de membres</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {workspaces?.reduce(
                  (acc, workspace) => acc + (workspace.members?.length || 0),
                  0
                ) || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-indigo-100/20 dark:border-indigo-900/20 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="mr-2 h-5 w-5 text-emerald-500" />
                Projets
              </CardTitle>
              <CardDescription>Nombre total de projets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {workspaces?.reduce(
                  (acc, workspace) => acc + (workspace._count?.projects || 0),
                  0
                ) || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des espaces de travail */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-md border border-indigo-100/20 dark:border-indigo-900/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Vos espaces de travail</h2>
            <Link href="/dashboard/workspaces/new">
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvel espace
              </Button>
            </Link>
          </div>
          <WorkspaceList />
        </div>

        {/* Espaces de travail récents */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-md border border-indigo-100/20 dark:border-indigo-900/20 p-8">
          <h2 className="text-xl font-semibold mb-6">
            Espaces de travail récents
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces?.slice(0, 3).map((workspace) => (
              <Link
                key={workspace.id}
                href={`/dashboard/workspaces/${workspace.id}`}
              >
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-indigo-100/20 dark:border-indigo-900/20 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{workspace.name}</span>
                      <ArrowRight className="h-5 w-5 text-indigo-500" />
                    </CardTitle>
                    <CardDescription>
                      {workspace.members?.length || 0} membres •{" "}
                      {workspace._count?.projects || 0} projets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-2">
                      {workspace.members?.slice(0, 5).map((member, i) => (
                        <div
                          key={member.user.id}
                          className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-400"
                        >
                          {member.user.name?.[0] || i + 1}
                        </div>
                      ))}
                      {workspace.members && workspace.members.length > 5 && (
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          +{workspace.members.length - 5}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
