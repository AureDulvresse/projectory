import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { resetPasswordSchema, validatePasswordResetToken } from "@/lib/actions/password";
import { resetPassword } from "@/lib/actions/password";

export function ResetPasswordForm() {
   const [isLoading, setIsLoading] = useState(false);
   const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
   const searchParams = useSearchParams();
   const router = useRouter();
   const token = searchParams.get("token");

   const form = useForm<z.infer<typeof resetPasswordSchema>>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
         token: token || "",
         password: "",
      },
   });

   useEffect(() => {
      const validateToken = async () => {
         if (!token) {
            setIsValidToken(false);
            return;
         }

         try {
            const { valid, message } = await validatePasswordResetToken(token);
            setIsValidToken(valid);
            if (!valid) {
               toast.error(message);
            }
         } catch (error) {
            setIsValidToken(false);
            toast.error("Erreur lors de la validation du token");
         }
      };

      validateToken();
   }, [token]);

   const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
      if (!token) {
         toast.error("Token manquant");
         return;
      }

      setIsLoading(true);
      try {
         await resetPassword({ ...values, token });
         toast.success("Votre mot de passe a été réinitialisé avec succès");
         router.push("/auth/login");
      } catch (error) {
         toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
         setIsLoading(false);
      }
   };

   if (isValidToken === null) {
      return (
         <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
         </div>
      );
   }

   if (!isValidToken) {
      return (
         <div className="text-center">
            <p className="text-destructive">
               Le lien de réinitialisation est invalide ou a expiré.
            </p>
            <Button
               variant="link"
               onClick={() => router.push("/auth/forgot-password")}
               className="mt-4"
            >
               Demander un nouveau lien
            </Button>
         </div>
      );
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Nouveau mot de passe</FormLabel>
                     <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Réinitialiser le mot de passe
            </Button>
         </form>
      </Form>
   );
} 