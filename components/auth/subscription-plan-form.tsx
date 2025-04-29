"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionPlanSchema } from "@/validators/auth";
import { z } from "zod";
import { RegisterFormData } from "@/types/register";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface SubscriptionPlanFormProps {
  initialData?: Partial<RegisterFormData>;
  onNext: (data: Partial<RegisterFormData>) => void;
  onBack: () => void;
}

const plans = [
  {
    id: "free",
    name: "Gratuit",
    description: "Pour les particuliers et les petites équipes",
    price: "0€",
    features: [
      "Jusqu'à 5 membres par espace de travail",
      "Jusqu'à 2 espaces de travail",
      "Fonctionnalités de base",
      "Support par email",
    ],
    badge: "Populaire",
    badgeVariant: "secondary" as const,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les professionnels et les équipes",
    price: "9.99€/mois",
    features: [
      "Membres illimités",
      "Espaces de travail illimités",
      "Fonctionnalités avancées",
      "Support prioritaire",
      "Intégrations avec d'autres outils",
    ],
    badge: "Recommandé",
    badgeVariant: "default" as const,
  },
  {
    id: "enterprise",
    name: "Entreprise",
    description: "Pour les grandes organisations",
    price: "29.99€/mois",
    features: [
      "Tout ce qui est inclus dans Pro",
      "SSO et gestion des utilisateurs",
      "API personnalisée",
      "Support dédié",
      "Conformité et sécurité avancées",
    ],
    badge: "Premium",
    badgeVariant: "destructive" as const,
  },
];

type FormData = z.infer<typeof subscriptionPlanSchema>;

export const SubscriptionPlanForm = ({
  initialData = {},
  onNext,
  onBack,
}: SubscriptionPlanFormProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    initialData.plan || plans[0].id
  );
  const [activeIndex, setActiveIndex] = useState<number>(
    plans.findIndex((plan) => plan.id === selectedPlan) || 0
  );
  const carouselRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      plan: "free",
    },
    mode: "onChange", // Validation en temps réel
  });

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
    switch (value) {
      case "pro":
        form.setValue("plan", "pro");

      case "enterprise":
        form.setValue("plan", "enterprise");

      default:
        form.setValue("plan", "free");
    }

    const newIndex = plans.findIndex((plan) => plan.id === value);
    setActiveIndex(newIndex);
  };

  const onSubmit = (values: FormData) => {
    onNext(values);
  };

  const scrollToCard = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const newIndex =
      direction === "left"
        ? Math.max(0, activeIndex - 1)
        : Math.min(plans.length - 1, activeIndex + 1);

    handlePlanChange(plans[newIndex].id);
  };

  // Ensure carousel scrolls to the right position when activeIndex changes
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = activeIndex * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Plan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="hidden"
                  placeholder="John Doe"
                  className="border-0 focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tabs for Desktop */}
        <div className="hidden md:flex justify-center max-w-3xl mx-auto mb-8">
          <div className="bg-muted rounded-lg p-1 flex w-full">
            {plans.map((plan, index) => (
              <div key={`tab-${plan.id}`} className="relative flex-1">
                <Button
                  type="button"
                  variant={selectedPlan === plan.id ? "default" : "ghost"}
                  className={cn(
                    "w-full rounded-md relative py-3 h-auto",
                    selectedPlan === plan.id && "shadow-sm"
                  )}
                  onClick={() => handlePlanChange(plan.id)}
                >
                  <span>{plan.name}</span>
                </Button>
                {plan.badge && (
                  <Badge
                    variant={plan.badgeVariant}
                    className="absolute -top-2 right-2 text-xs"
                  >
                    {plan.badge}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation for Mobile */}
        <div className="relative md:hidden">
          <div className="flex justify-between items-center px-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-8 w-8"
              onClick={() => scrollToCard("left")}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex justify-center items-center space-x-1">
              {plans.map((plan, idx) => (
                <div
                  key={`indicator-${plan.id}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all cursor-pointer",
                    selectedPlan === plan.id
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted hover:bg-muted-foreground"
                  )}
                  onClick={() => handlePlanChange(plan.id)}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-8 w-8"
              onClick={() => scrollToCard("right")}
              disabled={activeIndex === plans.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center mb-3">
            <div className="relative">
              <h3 className="text-lg font-medium">{plans[activeIndex].name}</h3>
              {plans[activeIndex].badge && (
                <Badge
                  variant={plans[activeIndex].badgeVariant}
                  className="absolute -top-3 -right-12 text-xs"
                >
                  {plans[activeIndex].badge}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Plan Card Display */}
        <div ref={carouselRef} className="overflow-hidden">
          <RadioGroup
            value={initialData.plan}
            onValueChange={handlePlanChange}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPlan}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto"
              >
                <Card className="border shadow-md">
                  <CardHeader className="relative pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {plans[activeIndex].name}
                        </CardTitle>
                        <CardDescription className="text-lg mt-1">
                          {plans[activeIndex].description}
                        </CardDescription>
                      </div>
                      <div className="hidden md:block">
                        {plans[activeIndex].badge && (
                          <Badge
                            variant={plans[activeIndex].badgeVariant}
                            className="text-sm font-medium"
                          >
                            {plans[activeIndex].badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {plans[activeIndex].price}
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Ce qui est inclus :</h4>
                      <ul className="space-y-3">
                        {plans[activeIndex].features.map((feature, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Check className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    <RadioGroupItem
                      value={plans[activeIndex].id}
                      id={plans[activeIndex].id}
                      className="sr-only"
                    />
                    <Button
                      type="button"
                      className="w-full"
                      variant="outline"
                      onClick={() => handlePlanChange(plans[activeIndex].id)}
                    >
                      Sélectionner {plans[activeIndex].name}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-6 max-w-3xl mx-auto">
          <Button type="button" variant="outline" onClick={onBack}>
            Retour
          </Button>
          <Button type="submit" className="min-w-[200px]">
            {selectedPlan === "free"
              ? "Terminer l'inscription"
              : "Continuer vers le paiement"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
