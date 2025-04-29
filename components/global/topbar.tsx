"use client";

import react, { useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Bell,
  Plus,
  LogOut,
  ChevronDown,
  Search,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewProjectModal } from "@/components/project/new-project-modal";
import { SearchModal } from "@/components/global/search-modal";
import { NewTaskModal } from "@/components/task/new-task-modal";
import { NewTeamModal } from "@/components/team/new-team-modal";
import { logout } from "@/lib/actions/auth";
import { useUser } from "@/contexts/user-context";

interface TopbarProps {
  workspaceId?: string;
}

export const Topbar = ({ workspaceId }: TopbarProps) => {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Générer le breadcrumb à partir du pathname
  const generateBreadcrumb = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return { href, label };
    });
  };

  const breadcrumbItems = generateBreadcrumb();

  return (
    <div className="border-b border-slate-100/20 dark:border-slate-900/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Link
                href={item.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground transition-colors",
                  index === breadcrumbItems.length - 1 &&
                  "text-foreground font-medium"
                )}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden md:flex"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Quick Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {workspaceId && (
                <>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <NewProjectModal
                      workspaceId={workspaceId}
                      trigger={
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Nouveau projet
                        </div>
                      }
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <NewTaskModal
                      workspaceId={workspaceId}
                      trigger={
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Nouvelle tâche
                        </div>
                      }
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <NewTeamModal
                      workspaceId={workspaceId}
                      trigger={
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Nouvelle équipe
                        </div>
                      }
                    />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </div>
  );
}
