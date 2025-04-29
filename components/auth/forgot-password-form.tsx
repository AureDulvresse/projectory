"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/password";

const forgotPasswordSchema = z.object({
   email: z.string().email("Email invalide"),
});

export function ForgotPasswordForm() {
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm<z.infer<typeof forgotPasswordSchema>>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: {
         email: "",
      },
   });

   const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
      setIsLoading(true);
      try {
         await requestPasswordReset({ email: values.email });

         toast({
            title: "Email envoyé",
            description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
         });
      } catch (error) {
         toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'envoi de l'email.",
            variant: "destructive",
         });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input
                           type="email"
                           placeholder="exemple@email.com"
                           {...field}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Envoyer le lien
            </Button>

            <div className="text-center text-sm">
               <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
               >
                  Retour à la connexion
               </Link>
            </div>
         </form>
      </Form>
   );
} 