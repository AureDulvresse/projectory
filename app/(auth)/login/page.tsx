"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeSwitch } from "@/components/global/theme-switch";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Users,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  // Formvariants était manquant pour l'animation
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left panel - Branding section avec un design plus moderne */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative hidden h-full flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-10 text-white lg:flex dark:border-r overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Logo et marque améliorés */}
        <div className="relative z-20 flex items-center text-2xl font-bold mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-3 h-8 w-8 text-white"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className="tracking-tight">ProjecTory</span>
        </div>

        {/* Contenu héroïque amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="relative z-20 flex flex-col justify-between h-full"
        >
          <div className="max-w-lg">
            <h1 className="text-3xl font-extrabold tracking-tight mb-4 leading-tight">
              Gérez vos projets avec{" "}
              <span className="text-cyan-300">facilité</span> et{" "}
              <span className="text-cyan-300">efficacité</span>
            </h1>
            <p className="text-white/90 mb-8 text-base font-light leading-relaxed">
              Centralisez vos tâches, collaborez en temps réel et augmentez la
              productivité de votre équipe avec notre plateforme intuitive.
            </p>

            {/* Points forts avec icônes plus grandes et espacement amélioré */}
            <div className="grid gap-4 mb-10">
              <div className="flex items-center gap-4 group">
                <div className="rounded-full bg-white/20 p-2.5 group-hover:bg-white/30 transition-all">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-white">
                  Interface intuitive et performances optimisées
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="rounded-full bg-white/20 p-2.5 group-hover:bg-white/30 transition-all">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-white">
                  Collaboration en temps réel simplifiée
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="rounded-full bg-white/20 p-2.5 group-hover:bg-white/30 transition-all">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-white">
                  Sécurité renforcée et confidentialité garanties
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="rounded-full bg-white/20 p-2.5 group-hover:bg-white/30 transition-all">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-white">
                  Solutions adaptatives pour tous types de projets
                </span>
              </div>
            </div>
          </div>

          {/* Témoignage amélioré avec style moderne */}
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm max-w-lg">
            <div className="flex gap-4 items-start">
              <div>
                <p className="text-sm italic font-light mb-3 leading-relaxed">
                  "ProjecTory a complètement transformé notre gestion de
                  projets. L'interface intuitive et les fonctionnalités avancées
                  nous ont permis d'améliorer notre productivité de 40% en
                  seulement deux mois."
                </p>
                <div>
                  <p className="text-sm font-medium">Sofia Davis</p>
                  <p className="text-xs text-white/70">
                    Directrice Marketing, TechNova
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Panneau droit - Formulaire de connexion amélioré */}
      <div className="lg:p-8 relative flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[500px] p-5"
        >
          <div className="flex flex-col text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm transition-colors hover:text-primary text-muted-foreground mb-3 mx-auto"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Formulaire de création de compte */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl border shadow-sm p-6"
          >
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold text-center">
                Créer un compte
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <LoginForm />
            </CardContent>
          </motion.div>

          {/* Liens de support améliorés */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-6 text-xs text-muted-foreground"
          >
            <Link
              href="/support"
              className="hover:underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Centre d'aide
            </Link>
            <Link
              href="/faq"
              className="hover:underline underline-offset-4 hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="hover:underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </motion.div>

          {/* Pied de page avec copyright amélioré */}
          <div className="text-xs text-center w-full text-muted-foreground">
            © {new Date().getFullYear()} ProjecTory. Tous droits réservés.
          </div>
        </motion.div>

        {/* Sélecteur de thème repositionné */}
        <div className="absolute top-5 right-5 z-50">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}