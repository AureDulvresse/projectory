import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
   title: "Mot de passe oublié",
   description: "Réinitialisez votre mot de passe",
};

export default function ForgotPasswordPage() {
   return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
         <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
               <CardDescription>
                  Entrez votre adresse email pour recevoir un lien de réinitialisation
               </CardDescription>
            </CardHeader>
            <CardContent>
               <ForgotPasswordForm />
            </CardContent>
         </Card>
      </div>
   );
} 