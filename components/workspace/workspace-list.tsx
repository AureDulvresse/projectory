"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Settings, FolderOpen } from "lucide-react";
import Link from "next/link";
import { getUserWorkspaces } from "@/lib/actions/workspace";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const result = await getUserWorkspaces();
        if (result.error) {
          toast({
            title: "Erreur",
            description: result.error,
            variant: "destructive",
          });
        } else {
          setWorkspaces(result.workspaces || []);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les espaces de travail",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();
  }, [toast]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((workspace) => (
        <Card
          key={workspace.id}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md transition-all duration-200"
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              {workspace.isPersonal ? (
                <FolderOpen className="mr-2 h-5 w-5 text-blue-500" />
              ) : (
                <Users className="mr-2 h-5 w-5 text-green-500" />
              )}
              {workspace.name}
            </CardTitle>
            <CardDescription>
              {workspace.description || "Aucune description"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              {workspace.members.length} / {workspace.maxMembers} membres
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {workspace.members.slice(0, 3).map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center bg-muted rounded-full px-2 py-1 text-xs"
                >
                  {member.user.name || member.user.email}
                </div>
              ))}
              {workspace.members.length > 3 && (
                <div className="flex items-center bg-muted rounded-full px-2 py-1 text-xs">
                  +{workspace.members.length - 3} autres
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/dashboard/workspaces/${workspace.id}/members`}>
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Gérer les membres
              </Button>
            </Link>
            <Link href={`/dashboard/workspaces/${workspace.id}/projects`}>
              <Button variant="outline" size="sm">
                Voir les projets
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}

      <Link href="/dashboard/workspaces/new">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md transition-all duration-200 border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <Button
              variant="ghost"
              size="lg"
              className="h-20 w-20 rounded-full"
            >
              <Plus className="h-8 w-8" />
            </Button>
            <p className="mt-4 text-lg font-medium">
              Créer un nouvel espace de travail
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Ajoutez un nouvel espace de travail pour collaborer sur vos
              projets
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
