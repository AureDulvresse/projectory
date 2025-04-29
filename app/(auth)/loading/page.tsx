"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const steps = [
   "Création de votre compte...",
   "Initialisation de votre espace de travail...",
   "Configuration des paramètres par défaut...",
   "Préparation des fonctionnalités...",
   "Finalisation de la configuration...",
];

export default function LoadingPage() {
   const router = useRouter();

   useEffect(() => {
      const timer = setTimeout(() => {
         router.push("/dashboard");
      }, 8000); // Redirection après 8 secondes

      return () => clearTimeout(timer);
   }, [router]);

   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
               <h1 className="text-2xl font-bold tracking-tight">
                  Construction de votre espace de travail
               </h1>
               <p className="mt-2 text-sm text-muted-foreground">
                  Veuillez patienter pendant que nous préparons tout pour vous
               </p>
            </div>

            <div className="space-y-4">
               {steps.map((step, index) => (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 1.5 }}
                     className="flex items-center space-x-2"
                  >
                     <Loader2 className="h-4 w-4 animate-spin text-primary" />
                     <span className="text-sm">{step}</span>
                  </motion.div>
               ))}
            </div>

            <div className="mt-8">
               <motion.div
                  className="h-2 w-full rounded-full bg-muted"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8, ease: "linear" }}
               >
                  <div className="h-full w-full rounded-full bg-primary" />
               </motion.div>
            </div>
         </div>
      </div>
   );
} 