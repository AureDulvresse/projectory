"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface PendingInvite {
   id: string;
   workspace: {
      id: string;
      name: string;
   };
   role: string;
   createdAt: string;
}

interface PendingInvitesProps {
   invites: PendingInvite[];
}

export function PendingInvites({ invites }: PendingInvitesProps) {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState<string | null>(null);

   const handleInviteResponse = async (inviteId: string, accept: boolean) => {
      setIsLoading(inviteId);
      try {
         const response = await fetch(`/api/workspaces/invites/${inviteId}/respond`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ accept }),
         });

         if (!response.ok) {
            throw new Error("Une erreur est survenue");
         }

         toast.success(
            accept
               ? "Vous avez accepté l'invitation"
               : "Vous avez refusé l'invitation"
         );
         router.refresh();
      } catch (error) {
         toast.error("Une erreur est survenue");
      } finally {
         setIsLoading(null);
      }
   };

   if (invites.length === 0) {
      return null;
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Invitations en attente</CardTitle>
            <CardDescription>
               Vous avez {invites.length} invitation{invites.length > 1 ? "s" : ""} en attente
            </CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {invites.map((invite) => (
                  <div
                     key={invite.id}
                     className="flex items-center justify-between p-4 border rounded-lg"
                  >
                     <div>
                        <h4 className="font-medium">{invite.workspace.name}</h4>
                        <p className="text-sm text-muted-foreground">
                           Rôle : {invite.role}
                        </p>
                     </div>
                     <div className="flex gap-2">
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleInviteResponse(invite.id, false)}
                           disabled={isLoading === invite.id}
                        >
                           Refuser
                        </Button>
                        <Button
                           size="sm"
                           onClick={() => handleInviteResponse(invite.id, true)}
                           disabled={isLoading === invite.id}
                        >
                           Accepter
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
} 