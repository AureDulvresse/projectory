import { AppShell } from "@/components/global/shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Plus,
  BarChart2,
  Users,
  Clock,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  Sparkles,
  Hammer,
  Search,
  Settings,
  LineChart,
  Zap,
  Bell
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { getCurrentUser } from "@/lib/session"
import { getUserWorkspaces, getWorkspaceProjects } from "@/lib/actions/workspace"
import { NewProjectModal } from "@/components/project/new-project-modal"
import { ProjectList } from "@/components/project/project-list"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const { data: workspaces } = await getUserWorkspaces()

  if (!workspaces || workspaces.length === 0) {
    redirect("/workspaces/new")
  }

  const currentWorkspace = workspaces[0]
  const { projects } = await getWorkspaceProjects(currentWorkspace.id)

  // Calcul des statistiques pour les projets
  const completedProjects = projects?.filter(p => p.status === "COMPLETED")?.length || 0
  const inProgressProjects = projects?.filter(p => p.status === "ACTIVE")?.length || 0
  const pendingProjects = projects?.filter(p => p.status === "ARCHIVED")?.length || 0
  const totalProjects = projects?.length || 0
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

  return (
    <AppShell currentWorkspace={currentWorkspace}>
      <div className="space-y-4">
        {/* Vue d'ensemble */}
        <Card className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 backdrop-blur-md border-indigo-100/30 dark:border-indigo-900/30">
          <CardHeader>
            <CardTitle>Vue d'ensemble de {currentWorkspace.name}</CardTitle>
            <CardDescription>
              Résumé de l'activité et performance de votre espace de travail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col justify-between p-6 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-sm border border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Projets actifs</p>
                    <h3 className="text-3xl font-bold mt-2">{totalProjects}</h3>
                  </div>
                  <div className="bg-indigo-100/80 dark:bg-indigo-900/50 p-3 rounded-lg">
                    <BarChart2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Progression</span>
                    <span>{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-1.5" />
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-sm border border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Membres</p>
                    <h3 className="text-3xl font-bold mt-2">{currentWorkspace._count?.members || 0}</h3>
                  </div>
                  <div className="bg-violet-100/80 dark:bg-violet-900/50 p-3 rounded-lg">
                    <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <div className="mt-4 flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="border-2 border-white dark:border-slate-900 h-8 w-8">
                      <AvatarFallback className="bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 text-xs">
                        {i}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {(currentWorkspace._count?.members || 0) > 4 && (
                    <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-medium text-violet-600 dark:text-violet-400">
                      +{((currentWorkspace._count?.members || 0) - 4)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-sm border border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Temps moyen</p>
                    <h3 className="text-3xl font-bold mt-2">4.2h</h3>
                  </div>
                  <div className="bg-emerald-100/80 dark:bg-emerald-900/50 p-3 rounded-lg">
                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>Optimisation de 15%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-sm border border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Productivité</p>
                    <h3 className="text-3xl font-bold mt-2">92%</h3>
                  </div>
                  <div className="bg-amber-100/80 dark:bg-amber-900/50 p-3 rounded-lg">
                    <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+5% cette semaine</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <div className="sticky top-0 z-10 backdrop-blur">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-indigo-100/20 dark:border-indigo-900/20 p-1 rounded-xl w-full">
              <TabsTrigger value="projects" className="data-[state=active]:bg-indigo-100/70 dark:data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300 rounded-lg">
                <BarChart2 className="h-4 w-4 mr-2 hidden sm:inline" />
                Projets
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-indigo-100/70 dark:data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300 rounded-lg">
                <CheckCircle className="h-4 w-4 mr-2 hidden sm:inline" />
                Tâches
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-indigo-100/70 dark:data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300 rounded-lg">
                <Calendar className="h-4 w-4 mr-2 hidden sm:inline" />
                Agenda
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-indigo-100/70 dark:data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300 rounded-lg">
                <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                Équipes
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-indigo-100/70 dark:data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300 rounded-lg">
                <LineChart className="h-4 w-4 mr-2 hidden sm:inline" />
                Activité
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu des onglets */}
          <TabsContent value="projects" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <Star className="h-5 w-5 mr-2 text-amber-500" />
                  Projets prioritaires
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Vos projets les plus importants</p>
              </div>
              <div className="flex items-center gap-2">
                <NewProjectModal workspaceId={currentWorkspace.id} />
                <Link href="/dashboard/projects">
                  <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300">
                    Tous les projets
                    <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Projet Prioritaire 1 */}
              <Card className="bg-white/90 dark:bg-slate-900/90 border-amber-200/30 dark:border-amber-900/30 hover:shadow-md hover:border-amber-300/50 dark:hover:border-amber-800/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Application Mobile</CardTitle>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 hover:bg-amber-200">Prioritaire</Badge>
                  </div>
                  <CardDescription>Développement de l'application mobile</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progression</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-1.5" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">15 Mai 2025</span>
                      </div>
                      <div className="flex -space-x-1">
                        {[1, 2, 3].map((i) => (
                          <Avatar key={i} className="border border-white dark:border-slate-900 h-5 w-5">
                            <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-[8px]">
                              {i}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    Voir les détails
                  </Button>
                </CardFooter>
              </Card>

              {/* Projet Prioritaire 2 */}
              <Card className="bg-white/90 dark:bg-slate-900/90 border-amber-200/30 dark:border-amber-900/30 hover:shadow-md hover:border-amber-300/50 dark:hover:border-amber-800/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Refonte UX</CardTitle>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 hover:bg-amber-200">Prioritaire</Badge>
                  </div>
                  <CardDescription>Mise à jour de l'interface utilisateur</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progression</span>
                        <span>42%</span>
                      </div>
                      <Progress value={42} className="h-1.5" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">10 Juin 2025</span>
                      </div>
                      <div className="flex -space-x-1">
                        {[1, 2].map((i) => (
                          <Avatar key={i} className="border border-white dark:border-slate-900 h-5 w-5">
                            <AvatarFallback className="bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 text-[8px]">
                              {i}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    Voir les détails
                  </Button>
                </CardFooter>
              </Card>

              {/* Nouveau Projet */}
              <Card className="bg-white/50 dark:bg-slate-900/50 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <div className="rounded-full bg-indigo-100/70 dark:bg-indigo-900/50 p-3 mb-3">
                    <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Nouveau projet</h3>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Créez un nouveau projet prioritaire
                  </p>
                  <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                    Créer un projet
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between mt-8">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                  Tous vos projets
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Liste complète de vos projets en cours</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  <Search className="h-3.5 w-3.5 mr-1" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  <Settings className="h-3.5 w-3.5 mr-1" />
                  Options
                </Button>
              </div>
            </div>

            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-indigo-100/20 dark:border-indigo-900/20 shadow-sm">
              <CardContent className="p-6">
                <ProjectList projects={projects || []} workspaceId={currentWorkspace.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-indigo-500" />
                  Tâches prioritaires
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de vos tâches</p>
              </div>
              <Link href="/dashboard/tasks">
                <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300">
                  Toutes les tâches
                  <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                      À faire aujourd'hui
                    </CardTitle>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">5 tâches</Badge>
                  </div>
                  <CardDescription>Tâches requérant votre attention immédiate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100/50 dark:border-amber-900/30 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-200">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full border-2 border-amber-500 mr-3 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium">Finaliser le design de la page d'accueil</p>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">Design</Badge>
                              <span className="text-xs text-muted-foreground ml-2">Aujourd'hui</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[8px] bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400">
                              {i}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30">
                      Voir toutes les tâches d'aujourd'hui
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
                      Tâches complétées
                    </CardTitle>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">12 tâches</Badge>
                  </div>
                  <CardDescription>Tâches terminées cette semaine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100/50 dark:border-emerald-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-200">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-emerald-500 mr-3 flex-shrink-0 flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium line-through text-muted-foreground">Implémenter l'authentification</p>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">Dev</Badge>
                              <span className="text-xs text-muted-foreground ml-2">Il y a {i} jour{i > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[8px] bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
                              {i}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                      Voir toutes les tâches complétées
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-indigo-500" />
                  Prochaines échéances
                </CardTitle>
                <CardDescription>Tâches à venir pour les 7 prochains jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Groupe de tâches par jour */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 pl-2 border-l-2 border-indigo-500">Demain - 25 Avril 2025</h4>
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-900/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200">
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full border-2 border-indigo-500 mr-3 flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium">Réunion d'équipe {i}</p>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">Réunion</Badge>
                                <span className="text-xs text-muted-foreground ml-2">10:0{i} - 11:0{i}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[8px] bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                                {i}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 pl-2 border-l-2 border-violet-500">26 Avril 2025</h4>
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-violet-50/50 dark:bg-violet-900/20 border border-violet-100/50 dark:border-violet-900/30 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all duration-200">
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full border-2 border-violet-500 mr-3 flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium">Revue de code sprint {i}</p>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300">Développement</Badge>
                                <span className="text-xs text-muted-foreground ml-2">14:00 - 15:30</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[8px] bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400">
                                {i + 1}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Voir le calendrier complet
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                  Calendrier
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Planification et événements à venir</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Aujourd'hui
                </Button>
                <Link href="/dashboard/calendar">
                  <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300">
                    Vue complète
                    <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-1">
                  {/* En-têtes des jours */}
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium py-2 text-muted-foreground">
                      {day}
                    </div>
                  ))}

                  {/* Jours du mois précédent */}
                  {[29, 30, 31].map((day) => (
                    <div key={`prev-${day}`} className="h-24 p-1 border border-dashed border-indigo-100/30 dark:border-indigo-900/30 rounded-md bg-indigo-50/30 dark:bg-indigo-900/10">
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  ))}

                  {/* Jours du mois actuel */}
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <div
                      key={`current-${day}`}
                      className={`h-24 p-1 border ${day === 24 ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-100/50 dark:bg-indigo-900/40' : 'border-indigo-100/30 dark:border-indigo-900/30'} ${day === 24 ? 'shadow-sm' : ''} rounded-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-xs ${day === 24 ? 'font-bold text-indigo-700 dark:text-indigo-300' : 'text-foreground'}`}>{day}</span>
                        {day === 24 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                        )}
                      </div>

                      {/* Événements pour le jour actuel */}
                      {day === 24 && (
                        <div className="mt-1 space-y-1">
                          <div className="text-[8px] p-1 rounded bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 truncate">
                            10:00 Réunion
                          </div>
                          <div className="text-[8px] p-1 rounded bg-violet-100 dark:bg-violet-900/70 text-violet-700 dark:text-violet-300 truncate">
                            14:00 Revue
                          </div>
                        </div>
                      )}

                      {/* Exemple d'événements pour d'autres jours */}
                      {[5, 12, 17, 25, 26].includes(day) && (
                        <div className="mt-1 space-y-1">
                          <div className="text-[8px] p-1 rounded bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 truncate">
                            09:30 Meeting
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Jours du mois suivant */}
                  {[1, 2, 3].map((day) => (
                    <div key={`next-${day}`} className="h-24 p-1 border border-dashed border-indigo-100/30 dark:border-indigo-900/30 rounded-md bg-indigo-50/30 dark:bg-indigo-900/10">
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                    Événements à venir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100/50 dark:border-indigo-900/30 hover:shadow-sm transition-all duration-200">
                        <div className="w-10 h-10 flex-shrink-0 rounded-md bg-amber-100 dark:bg-amber-900/50 flex flex-col items-center justify-center mr-3">
                          <span className="text-[8px] text-amber-700 dark:text-amber-300">Avr</span>
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{24 + i}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Présentation du projet {i}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground">13:00 - 14:30</span>
                            <span className="mx-1 text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">Salle de conférence {i}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Hammer className="h-4 w-4 mr-2 text-indigo-500" />
                    Réunions récurrentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100/50 dark:border-indigo-900/30 hover:shadow-sm transition-all duration-200">
                      <div className="w-10 h-10 flex-shrink-0 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex flex-col items-center justify-center mr-3">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Lun</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Daily standup</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">09:30 - 10:00</span>
                          <span className="mx-1 text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">Zoom</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100/50 dark:border-indigo-900/30 hover:shadow-sm transition-all duration-200">
                      <div className="w-10 h-10 flex-shrink-0 rounded-md bg-violet-100 dark:bg-violet-900/50 flex flex-col items-center justify-center mr-3">
                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">Mer</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Revue de sprint</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">14:00 - 15:30</span>
                          <span className="mx-1 text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">Salle 2</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100/50 dark:border-indigo-900/30 hover:shadow-sm transition-all duration-200">
                      <div className="w-10 h-10 flex-shrink-0 rounded-md bg-emerald-100 dark:bg-emerald-900/50 flex flex-col items-center justify-center mr-3">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Ven</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Démonstration client</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">16:00 - 17:00</span>
                          <span className="mx-1 text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">Google Meet</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-500" />
                  Vos équipes
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Gestion des équipes et des membres</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Nouvelle équipe
                </Button>
                <Link href="/dashboard/teams">
                  <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300">
                    Gérer les équipes
                    <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="h-6 w-6 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2">
                        <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      Équipe Développement
                    </CardTitle>
                    <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">5 membres</Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <span className="text-xs">3 projets actifs</span>
                      <span className="mx-1 text-xs">•</span>
                      <span className="text-xs">9 tâches en cours</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Avatar key={i} className="border-2 border-white dark:border-slate-900">
                          <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs">
                            {i}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>

                    <div>
                      <div className="text-xs mb-1 flex justify-between">
                        <span>Charge de travail</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    Détails
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                    Assigner une tâche
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="h-6 w-6 rounded-md bg-violet-100 dark:bg-violet-900 flex items-center justify-center mr-2">
                        <Users className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                      </div>
                      Équipe Design
                    </CardTitle>
                    <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">3 membres</Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <span className="text-xs">2 projets actifs</span>
                      <span className="mx-1 text-xs">•</span>
                      <span className="text-xs">5 tâches en cours</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <Avatar key={i} className="border-2 border-white dark:border-slate-900">
                          <AvatarFallback className="bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 text-xs">
                            {i}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>

                    <div>
                      <div className="text-xs mb-1 flex justify-between">
                        <span>Charge de travail</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30">
                    Détails
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                    Assigner une tâche
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="h-6 w-6 rounded-md bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
                        <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      Équipe Marketing
                    </CardTitle>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">4 membres</Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <span className="text-xs">1 projet actif</span>
                      <span className="mx-1 text-xs">•</span>
                      <span className="text-xs">7 tâches en cours</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Avatar key={i} className="border-2 border-white dark:border-slate-900">
                          <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs">
                            {i}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>

                    <div>
                      <div className="text-xs mb-1 flex justify-between">
                        <span>Charge de travail</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                    Détails
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                    Assigner une tâche
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Hammer className="h-4 w-4 mr-2 text-indigo-500" />
                  Collaborateurs récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100/50 dark:border-indigo-900/30 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                            {i}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Utilisateur {i}</p>
                          <p className="text-xs text-muted-foreground">Équipe {i % 3 === 0 ? 'Design' : i % 3 === 1 ? 'Développement' : 'Marketing'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`px-1.5 py-0 h-5 ${i % 3 === 0
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300'
                          : i % 3 === 1
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          }`}>
                          {i % 3 === 0 ? 'Design' : i % 3 === 1 ? 'Dev' : 'Marketing'}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-indigo-500" />
                  Activité récente
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Suivi et analyse des performances</p>
              </div>
              <Link href="/dashboard/activity">
                <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300">
                  Rapports détaillés
                  <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" />
                    Performance des projets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Graphique de performance des projets */}
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 text-indigo-300 dark:text-indigo-700 mx-auto" />
                      <p className="mt-2 text-sm text-muted-foreground">Graphique de performance des projets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-violet-500" />
                    Activité de l'équipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Graphique d'activité de l'équipe */}
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart2 className="h-16 w-16 text-violet-300 dark:text-violet-700 mx-auto" />
                      <p className="mt-2 text-sm text-muted-foreground">Graphique d'activité de l'équipe</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/90 dark:bg-slate-900/90 border-indigo-100/30 dark:border-indigo-900/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                  Activité récente
                </CardTitle>
                <CardDescription>Dernières actions effectuées dans l'espace de travail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 relative before:absolute before:h-full before:w-0.5 before:left-2.5 before:top-0 before:bg-indigo-100 dark:before:bg-indigo-900/50">
                  {[
                    {
                      icon: <Plus className="h-3 w-3" />,
                      iconBg: "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400",
                      title: "Nouveau projet créé",
                      desc: "Le projet 'Refonte UX' a été créé",
                      time: "Il y a 1 heure",
                      user: "User 1"
                    },
                    {
                      icon: <CheckCircle className="h-3 w-3" />,
                      iconBg: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400",
                      title: "Tâche terminée",
                      desc: "La tâche 'Design homepage' a été marquée comme terminée",
                      time: "Il y a 3 heures",
                      user: "User 2"
                    },
                    {
                      icon: <Users className="h-3 w-3" />,
                      iconBg: "bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400",
                      title: "Membre ajouté",
                      desc: "User 3 a été ajouté à l'équipe Design",
                      time: "Il y a 5 heures",
                      user: "User 4"
                    },
                    {
                      icon: <AlertCircle className="h-3 w-3" />,
                      iconBg: "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400",
                      title: "Deadline mise à jour",
                      desc: "L'échéance du projet 'Application Mobile' a été reportée",
                      time: "Il y a 1 jour",
                      user: "User 5"
                    },
                  ].map((item, i) => (
                    <div key={i} className="relative pl-10">
                      <div className={`absolute left-0 h-5 w-5 rounded-full flex items-center justify-center ${item.iconBg}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-5 w-5 mr-2">
                            <AvatarFallback className="text-[8px]">{item.user[5]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}