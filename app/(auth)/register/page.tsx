"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import {
  Github,
  ArrowLeft,
  Zap,
  Users,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeSwitch } from "@/components/global/theme-switch";
import { PersonalInfoForm } from "@/components/auth/personal-info-form";
import { SubscriptionPlanForm } from "@/components/auth/subscription-plan-form";
import { PaymentForm } from "@/components/auth/payment-form";
import { register } from "@/lib/actions/auth";
import { RegisterFormData } from "@/types/register";
import { toast } from "sonner";

const RegisterPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({});

  const handleNext = (data: Partial<RegisterFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (data: Partial<RegisterFormData>) => {
    try {
      const finalData = { ...formData, ...data };

      // Validation des données requises
      if (!finalData.name || !finalData.email || !finalData.password ||
        !finalData.tenantName || !finalData.tenantSlug || !finalData.plan) {
        throw new Error("Tous les champs sont requis");
      }

      await register(finalData as RegisterFormData);

      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      router.push("/loading");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      );
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    try {
      toast.success("Connexion en cours", {
        description: `Redirection vers ${provider}...`,
      });

      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(`Erreur lors de la connexion avec ${provider}:`, error);
      toast.error("Connexion échouée", {
        description: `La connexion avec ${provider} a échoué.`,
      });
    }
  };

  // Animation variants pour les transitions entre étapes
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Calcul de la progression en pourcentage pour la barre de progression
  const progressPercentage = (step / 3) * 100;

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:p-8 relative flex items-center justify-center h-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
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

          <motion.div
            key={`form-step-${step}`}
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
              <CardDescription className="text-center">
                {step === 1 && "Remplissez vos informations personnelles"}
                {step === 2 && "Choisissez votre plan d'abonnement"}
                {step === 3 && "Finalisez votre paiement"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {/* Barre de progression améliorée */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`flex items-center ${s < 3 ? "flex-1" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${s < step
                          ? "bg-green-500 text-white"
                          : s === step
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {s < step ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 13L9 17L19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          s
                        )}
                      </div>
                      {s < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded-full transition-all ${s < step
                            ? "bg-green-500"
                            : s === step
                              ? "bg-primary"
                              : "bg-muted"
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span
                    className={step >= 1 ? "text-foreground font-medium" : ""}
                  >
                    Informations
                  </span>
                  <span
                    className={step >= 2 ? "text-foreground font-medium" : ""}
                  >
                    Abonnement
                  </span>
                  <span
                    className={step >= 3 ? "text-foreground font-medium" : ""}
                  >
                    Paiement
                  </span>
                </div>
              </div>

              {/* OAuth Providers - uniquement à l'étape 1 */}
              {step === 1 && (
                <>
                  <div className="grid gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthSignIn("google")}
                      className="w-full relative overflow-hidden group hover:border-blue-500 transition-colors"
                    >
                      <div className="absolute inset-0 w-3 bg-gradient-to-r from-blue-500 to-blue-300 transform -skew-x-[20deg] -translate-x-full group-hover:animate-slide-right"></div>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="relative z-10">
                        Continuer avec Google
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthSignIn("github")}
                      className="w-full relative overflow-hidden group hover:border-gray-800 dark:hover:border-gray-300 transition-colors"
                    >
                      <div className="absolute inset-0 w-3 bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-500 transform -skew-x-[20deg] -translate-x-full group-hover:animate-slide-right"></div>
                      <Github className="mr-2 h-4 w-4" />
                      <span className="relative z-10">
                        Continuer avec GitHub
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthSignIn("slack")}
                      className="w-full relative overflow-hidden group hover:border-purple-500 transition-colors"
                    >
                      <div className="absolute inset-0 w-3 bg-gradient-to-r from-purple-600 to-purple-400 transform -skew-x-[20deg] -translate-x-full group-hover:animate-slide-right"></div>
                      <svg
                        className="mr-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                      </svg>
                      <span className="relative z-10">
                        Continuer avec Slack
                      </span>
                    </Button>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Ou s'inscrire avec email
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Étape 1: Informations personnelles */}
              {step === 1 && (
                <PersonalInfoForm
                  initialData={formData}
                  onNext={handleNext}
                />
              )}

              {/* Étape 2: Plan d'abonnement */}
              {step === 2 && (
                <SubscriptionPlanForm
                  initialData={formData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {/* Étape 3: Paiement */}
              {step === 3 && (
                <PaymentForm
                  initialData={formData}
                  onSubmit={(data) => handleSubmit(data)}
                  onBack={handleBack}
                />
              )}
            </CardContent>
          </motion.div>

          {/* Footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col space-y-3"
          >
            <p className="text-center text-sm">
              <Link
                href="/login"
                className="font-medium hover:text-primary text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
              >
                Déjà un compte ? Se connecter
              </Link>
            </p>

            {/* Liens de support */}
            <div className="flex justify-center gap-6 text-xs text-muted-foreground">
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
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright footer */}
        <div className="absolute bottom-3 text-xs text-center w-full text-muted-foreground">
          © {new Date().getFullYear()} ProjecTory. Tous droits réservés.
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative hidden h-full flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-10 text-white lg:flex dark:border-r overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Logo et marque */}
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

        {/* Contenu héroïque */}
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

            {/* Points forts avec icônes */}
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

          {/* Témoignage */}
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

      {/* Theme switcher */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default RegisterPage;
