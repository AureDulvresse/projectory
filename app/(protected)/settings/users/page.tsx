"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { UsersList } from "@/components/tenant/users-list";
import { AddUserForm } from "@/components/tenant/add-user-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTenantUsers } from "@/lib/actions/user";
import { toast } from "sonner";

export default function UsersPage() {
   const [users, setUsers] = useState<User[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function loadUsers() {
         try {
            const { users } = await getTenantUsers();
            setUsers(users);
         } catch (error) {
            toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
         } finally {
            setIsLoading(false);
         }
      }

      loadUsers();
   }, []);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         </div>
      );
   }

   return (
      <div className="container mx-auto py-10">
         <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
               <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
            </div>

            <Tabs defaultValue="list" className="w-full">
               <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">Liste des utilisateurs</TabsTrigger>
                  <TabsTrigger value="add">Ajouter un utilisateur</TabsTrigger>
               </TabsList>

               <TabsContent value="list">
                  <Card>
                     <CardHeader>
                        <CardTitle>Liste des utilisateurs</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <UsersList users={users} />
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="add">
                  <Card>
                     <CardHeader>
                        <CardTitle>Ajouter un utilisateur</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <AddUserForm />
                     </CardContent>
                  </Card>
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
} 