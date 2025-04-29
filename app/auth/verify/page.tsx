"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
   const [isLoading, setIsLoading] = useState(true);
   const searchParams = useSearchParams();
   const token = searchParams.get("token");

   useEffect(() => {
      const verifyEmail = async () => {
         try {
            const response = await fetch(`/api/auth/verify?token=${token}`);

            if (!response.ok) {
               const error = await response.text();
               toast({
                  title: "Erreur",
                  description: error,
                  variant: "destructive",
               });
               return;
            }

            toast({
               title: "Email vérifié",
               description: "Votre email a été vérifié avec succès.",
            });
         } catch (error) {
            toast({
               title: "Erreur",
               description: "Une erreur est survenue lors de la vérification.",
               variant: "destructive",
            });
         } finally {
            setIsLoading(false);
         }
      };

      if (token) {
         verifyEmail();
      } else {
         setIsLoading(false);
         toast({
            title: "Erreur",
            description: "Token manquant",
            variant: "destructive",
         });
      }
   }, [token]);

   return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
         <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
               <h1 className="text-2xl font-semibold tracking-tight">
                  Vérification de l'email
               </h1>
               {isLoading ? (
                  <div className="flex items-center justify-center">
                     <Loader2 className="h-6 w-6 animate-spin" />
                     <p className="ml-2">Vérification en cours...</p>
                  </div>
               ) : (
                  <p className="text-sm text-muted-foreground">
                     Vous pouvez maintenant vous connecter.
                  </p>
               )}
            </div>
         </div>
      </div>
   );
} 