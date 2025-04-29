"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { createUser } from "@/lib/actions/user";

const addUserSchema = z.object({
   name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
   email: z.string().email("Email invalide"),
   password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
   role: z.enum(["USER", "ADMIN"]),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

export function AddUserForm() {
   const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const form = useForm<AddUserFormValues>({
      resolver: zodResolver(addUserSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
         role: "USER",
      },
   });

   async function onSubmit(values: AddUserFormValues) {
      setIsLoading(true);

      try {
         await createUser(values);
         toast.success("Utilisateur ajouté avec succès");
         form.reset();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Nom complet</FormLabel>
                     <FormControl>
                        <Input placeholder="John Doe" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Mot de passe</FormLabel>
                     <FormControl>
                        <div className="relative">
                           <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                           />
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                           >
                              {showPassword ? (
                                 <EyeOff className="h-4 w-4" />
                              ) : (
                                 <Eye className="h-4 w-4" />
                              )}
                           </Button>
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="role"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Rôle</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un rôle" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="USER">Utilisateur</SelectItem>
                           <SelectItem value="ADMIN">Administrateur</SelectItem>
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? "Ajout en cours..." : "Ajouter l'utilisateur"}
            </Button>
         </form>
      </Form>
   );
} 