"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

const resetPasswordSchema = z.object({
   password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
   confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
   message: "Les mots de passe ne correspondent pas",
   path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
   return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
         <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
               <h1 className="text-2xl font-semibold tracking-tight">
                  Réinitialisation du mot de passe
               </h1>
               <p className="text-sm text-muted-foreground">
                  Entrez votre nouveau mot de passe
               </p>
            </div>
            <ResetPasswordForm />
         </div>
      </div>
   );
} 