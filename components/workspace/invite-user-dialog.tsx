"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface InviteUserDialogProps {
   workspaceId: string;
   maxMembers: number;
   currentMembersCount: number;
}

export function InviteUserDialog({
   workspaceId,
   maxMembers,
   currentMembersCount,
}: InviteUserDialogProps) {
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [role, setRole] = useState("MEMBER");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const formData = new FormData();
         formData.append("email", email);
         formData.append("role", role);

         const response = await fetch(`/api/workspaces/${workspaceId}/invite`, {
            method: "POST",
            body: formData,
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || "Une erreur est survenue");
         }

         toast.success("Invitation envoyée avec succès");
         setOpen(false);
         setEmail("");
         router.refresh();
      } catch (error) {
         console.error("Erreur lors de l'invitation:", error);
         toast.error(
            error instanceof Error ? error.message : "Une erreur est survenue"
         );
      } finally {
         setIsLoading(false);
      }
   };

   const remainingSlots = maxMembers - currentMembersCount;

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="outline" size="sm">
               <UserPlus className="mr-2 h-4 w-4" />
               Inviter un utilisateur
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Inviter un utilisateur</DialogTitle>
               <DialogDescription>
                  Envoyez une invitation à un utilisateur pour rejoindre cet espace de
                  travail. {remainingSlots} place{remainingSlots !== 1 ? "s" : ""} disponible{remainingSlots !== 1 ? "s" : ""}.
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="email" className="text-right">
                        Email
                     </Label>
                     <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-span-3"
                        placeholder="utilisateur@example.com"
                        required
                     />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="role" className="text-right">
                        Rôle
                     </Label>
                     <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="col-span-3">
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
               <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                     Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                     {isLoading ? "Envoi en cours..." : "Envoyer l'invitation"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
} 