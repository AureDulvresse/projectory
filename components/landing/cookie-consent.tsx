"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieConsent() {
   const [showConsent, setShowConsent] = useState(false)

   useEffect(() => {
      // Vérifier si l'utilisateur a déjà accepté les cookies
      const hasConsented = localStorage.getItem("cookieConsent")
      if (!hasConsented) {
         // Attendre un peu avant d'afficher la bannière
         const timer = setTimeout(() => {
            setShowConsent(true)
         }, 2000)
         return () => clearTimeout(timer)
      }
   }, [])

   const acceptCookies = () => {
      localStorage.setItem("cookieConsent", "true")
      setShowConsent(false)
   }

   return (
      <AnimatePresence>
         {showConsent && (
            <motion.div
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 100, opacity: 0 }}
               transition={{ type: "spring", damping: 20, stiffness: 300 }}
               className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-indigo-100/20 dark:border-indigo-900/20 shadow-lg"
            >
               <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground max-w-2xl">
                     <p>
                        Nous utilisons des cookies pour améliorer votre expérience sur notre site.
                        En continuant à naviguer, vous acceptez notre{" "}
                        <a
                           href="/privacy"
                           className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300"
                        >
                           politique de confidentialité
                        </a>
                        .
                     </p>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowConsent(false)}
                        className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300"
                     >
                        <X className="h-4 w-4 mr-1" />
                        Fermer
                     </Button>
                     <Button
                        size="sm"
                        onClick={acceptCookies}
                        className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 animate-gradient"
                     >
                        Accepter
                     </Button>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   )
} 