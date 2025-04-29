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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  inviteToWorkspace,
  removeWorkspaceMember,
} from "@/lib/actions/workspace";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, UserPlus } from "lucide-react";

export function WorkspaceMembers({ workspaceId }: { workspaceId: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const { toast } = useToast();

  // Charger les membres de l'espace de travail
  useEffect(() => {
    const loadWorkspaceMembers = async () => {
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}`);
        if (!response.ok) {
          throw new Error("Impossible de charger les membres");
        }
        const data = await response.json();
        setWorkspace(data.workspace);
        setMembers(data.workspace.members);
      } catch (error) {
        toast({
          title: "Erreur",
          description:
            "Impossible de charger les membres de l'espace de travail",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaceMembers();
  }, [workspaceId, toast]);

  // Inviter un nouveau membre
  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInviteLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await inviteToWorkspace(workspaceId, formData);

      if (result.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Membre invité avec succès",
        });
        // Recharger les membres
        const response = await fetch(`/api/workspaces/${workspaceId}`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data.workspace.members);
        }
        // Réinitialiser le formulaire
        (event.target as HTMLFormElement).reset();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'invitation",
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  // Supprimer un membre
  const handleRemoveMember = async (memberId: string) => {
    try {
      const result = await removeWorkspaceMember(workspaceId, memberId);

      if (result.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Membre supprimé avec succès",
        });
        // Mettre à jour la liste des membres
        setMembers(members.filter((member) => member.userId !== memberId));
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du membre",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Inviter un nouveau membre</CardTitle>
          <CardDescription>
            Invitez un utilisateur à rejoindre cet espace de travail
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleInvite}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="colleague@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select name="role" defaultValue="MEMBER">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                    <SelectItem value="MEMBER">Membre</SelectItem>
                    <SelectItem value="VIEWER">Observateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              disabled={inviteLoading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {inviteLoading ? "Invitation en cours..." : "Inviter"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Membres actuels</CardTitle>
          <CardDescription>
            {members.length} / {workspace?.maxMembers} membres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.name
                        ? member.user.name.charAt(0).toUpperCase()
                        : member.user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.user.name || "Utilisateur"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{member.role}</Badge>
                  {member.userId !== workspace?.ownerId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.userId)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
