"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { deleteUser } from "@/lib/actions/user";

interface UsersListProps {
   users: User[];
}

export function UsersList({ users }: UsersListProps) {
   const router = useRouter();
   const [isDeleting, setIsDeleting] = useState<string | null>(null);

   const handleDelete = async (userId: string) => {
      try {
         setIsDeleting(userId);
         await deleteUser(userId);
         toast.success("Utilisateur supprimé avec succès");
         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
         setIsDeleting(null);
      }
   };

   return (
      <div className="rounded-md border">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {users.map((user) => (
                  <TableRow key={user.id}>
                     <TableCell>{user.name}</TableCell>
                     <TableCell>{user.email}</TableCell>
                     <TableCell>{user.role}</TableCell>
                     <TableCell className="text-right">
                        <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => handleDelete(user.id)}
                           disabled={isDeleting === user.id}
                        >
                           {isDeleting === user.id ? "Suppression..." : "Supprimer"}
                        </Button>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
} 