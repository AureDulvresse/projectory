"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
   Menu, LayoutDashboard, FolderKanban, CheckSquare, Users, Calendar,
   MessageSquare, Bell, Settings, Plus, Crown, SquareStack,
   BriefcaseBusiness, LogOut
} from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
   isCollapsed?: boolean;
   currentWorkspace?: { id: string; name: string };
   workspaces?: { id: string; name: string }[];
}


export function Sidebar({ className, isCollapsed = false, currentWorkspace, workspaces }: SidebarProps) {
   const pathname = usePathname()
   const { user, hasSubscription } = useUser()
   const [isMobileOpen, setIsMobileOpen] = useState(false)

   // Routes config centralisée
   const routes = [
      { label: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard", color: "indigo" },
      { label: "Projets", icon: FolderKanban, href: "/dashboard/projects", color: "violet" },
      { label: "Tâches", icon: CheckSquare, href: "/dashboard/tasks", color: "emerald" },
      { label: "Équipes", icon: Users, href: "/dashboard/teams", color: "rose" },
      { label: "Calendrier", icon: Calendar, href: "/dashboard/calendar", color: "amber" },
      { label: "Messages", icon: MessageSquare, href: "/dashboard/messages", color: "blue" },
      { label: "Notifications", icon: Bell, href: "/dashboard/notifications", color: "cyan" },
      { label: "Paramètres", icon: Settings, href: "/dashboard/settings", color: "slate" }
   ]

   const SidebarContent = () => (
      <div className={cn("flex flex-col h-full border-r border-slate-100/20 dark:border-slate-900/20", className)}>
         {/* Header */}
         <div className="p-4 border-b border-indigo-100/20 dark:border-indigo-900/20">
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-indigo-100 dark:border-indigo-900">
                     <AvatarImage src={user?.image || ""} alt={user?.name || "Utilisateur"} />
                     <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                        {user?.name?.[0] || "U"}
                     </AvatarFallback>
                  </Avatar>
                  {hasSubscription && hasSubscription() && (
                     <div className="absolute -top-1 -right-1">
                        <Crown className="h-4 w-4 text-yellow-500" />
                     </div>
                  )}
               </div>
               {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">{user?.name}</p>
                     <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
               )}
            </div>
         </div>

         {/* Workspace Switch */}
         <div className="p-2">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="outline"
                     className="w-full justify-start gap-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  >
                     <BriefcaseBusiness className="h-4 w-4" />
                     {currentWorkspace?.name || "Mon espace"}
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start">
                  {workspaces?.map((workspace) => (
                     <DropdownMenuItem key={workspace.id} asChild>
                        <Link
                           href={`/dashboard?workspace=${workspace.id}`}
                           className={cn(
                              "flex items-center gap-2",
                              workspace.id === currentWorkspace?.id && "font-semibold text-indigo-600 dark:text-indigo-400"
                           )}
                        >
                           <SquareStack className="h-4 w-4" />
                           {workspace.name}
                        </Link>
                     </DropdownMenuItem>
                  ))}

                  <DropdownMenuItem asChild>
                     <Link
                        href="/dashboard/workspaces"
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
                     >
                        <Plus className="h-4 w-4" />
                        Créer un espace
                     </Link>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>


         {/* Navigation */}
         <ScrollArea className="flex-1 py-4">
            <div className="space-y-1 px-2">
               {routes.map(({ label, icon: Icon, href, color }) => {
                  const isActive = pathname === href
                  const colorClasses = `text-${color}-500`
                  const bgClasses = `bg-${color}-500/10`
                  const hoverBg = `hover:bg-${color}-500/20`
                  const activeBg = isActive ? `bg-${color}-500/20` : ""

                  return (
                     <Link
                        key={href}
                        href={href}
                        className={cn(
                           "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                           hoverBg,
                           activeBg,
                           isCollapsed && "justify-center"
                        )}
                     >
                        <div className={cn("p-1.5 rounded-md", bgClasses)}>
                           <Icon className={cn("h-4 w-4", colorClasses)} />
                        </div>
                        {!isCollapsed && <span className="flex-1">{label}</span>}
                     </Link>
                  )
               })}
            </div>
         </ScrollArea>
      </div>
   )

   return (
      <>
         {/* Mobile Sidebar */}
         <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
               <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40 md:hidden">
                  <Menu className="h-5 w-5" />
               </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
               <SidebarContent />
            </SheetContent>
         </Sheet>

         {/* Desktop Sidebar - Now fixed */}
         <div
            className={cn(
               "hidden md:flex flex-col h-screen border-r border-indigo-100/20 dark:border-indigo-900/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md",
               "fixed top-0 left-0 z-30",  // Added fixed positioning
               isCollapsed ? "w-16" : "w-64"
            )}
         >
            <SidebarContent />
         </div>

         {/* Spacer div to push main content - add this to your layout */}
         <div className={cn("hidden md:block", isCollapsed ? "w-16" : "w-64")} />
      </>
   )
}