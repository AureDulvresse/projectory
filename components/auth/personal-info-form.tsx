"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  CheckCircle2,
  Building,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { personalInfoSchema } from "@/validators/auth";
import { RegisterFormData } from "@/types/register";
import { toast } from "sonner";

// Type pour les données du formulaire
type FormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  initialData?: Partial<RegisterFormData>;
  onNext: (data: Partial<RegisterFormData>) => void;
}

export const PersonalInfoForm = ({
  initialData = {},
  onNext,
}: PersonalInfoFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      password: "",
      confirmPassword: "",
      tenantName: initialData.tenantName || "",
      tenantSlug: initialData.tenantSlug || "",
    },
    mode: "onChange",
  });

  // Vérification de disponibilité de slug
  const checkSlugAvailability = debounce(async (slug: string) => {
    if (!slug || slug.length < 2) {
      setIsSlugAvailable(null);
      return;
    }

    setIsCheckingSlug(true);
    try {
      const response = await fetch(`/api/tenants/check-slug?slug=${slug}`);
      const data = await response.json();
      setIsSlugAvailable(data.available);
    } catch (error) {
      console.error("Erreur lors de la vérification du slug:", error);
      setIsSlugAvailable(null);
    } finally {
      setIsCheckingSlug(false);
    }
  }, 500);

  // Surveiller les changements de tenantName pour suggérer un slug
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "tenantName" && value.tenantName && !value.tenantSlug) {
        const suggestedSlug = value.tenantName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        form.setValue("tenantSlug", suggestedSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Vérifier la disponibilité du slug lorsqu'il change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "tenantSlug" && value.tenantSlug) {
        checkSlugAvailability(value.tenantSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, checkSlugAvailability]);

  const onSubmit = (values: FormData) => {
    if (isSlugAvailable === false) {
      toast.error("L'identifiant de l'organisation n'est pas disponible");
      return;
    }

    const { confirmPassword, ...submitData } = values;
    onNext(submitData);
  };

  const getInputStyles = (fieldName: keyof FormData) => {
    const hasError = !!form.formState.errors[fieldName];
    const isTouched = form.formState.touchedFields[fieldName];
    const isValid = isTouched && !hasError;

    return cn(
      "flex items-center bg-background border rounded-md focus-within:ring-1 focus-within:ring-primary",
      hasError
        ? "border-destructive"
        : isValid
          ? "border-green-500"
          : "border-input"
    );
  };

  const getIconStyles = (fieldName: keyof FormData) => {
    const hasError = !!form.formState.errors[fieldName];
    const isTouched = form.formState.touchedFields[fieldName];
    const isValid = isTouched && !hasError;

    return cn(
      "h-5 w-5 ml-3 mr-2",
      hasError
        ? "text-destructive"
        : isValid
          ? "text-green-500"
          : "text-muted-foreground"
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Nom complet</FormLabel>
              <FormControl>
                <div className={getInputStyles("name")}>
                  <UserRound className={getIconStyles("name")} />
                  <Input
                    {...field}
                    placeholder="John Doe"
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Email</FormLabel>
              <FormControl>
                <div className={getInputStyles("email")}>
                  <Mail className={getIconStyles("email")} />
                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Mot de passe</FormLabel>
              <FormControl>
                <div className={getInputStyles("password")}>
                  <Lock className={getIconStyles("password")} />
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-0 focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                Confirmer le mot de passe
              </FormLabel>
              <FormControl>
                <div className={getInputStyles("confirmPassword")}>
                  <Lock className={getIconStyles("confirmPassword")} />
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-0 focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="mr-2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tenantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                Nom de l'organisation
              </FormLabel>
              <FormControl>
                <div className={getInputStyles("tenantName")}>
                  <Building className={getIconStyles("tenantName")} />
                  <Input
                    {...field}
                    placeholder="Ma Société"
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tenantSlug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                Identifiant de l'organisation
              </FormLabel>
              <FormControl>
                <div className={getInputStyles("tenantSlug")}>
                  <Building className={getIconStyles("tenantSlug")} />
                  <Input
                    {...field}
                    placeholder="ma-societe"
                    className="border-0 focus-visible:ring-0"
                  />
                  {isCheckingSlug ? (
                    <div className="mr-2 animate-spin">
                      <Loader2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ) : isSlugAvailable === true ? (
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  ) : isSlugAvailable === false ? (
                    <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                  ) : null}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Suivant
        </Button>
      </form>
    </Form>
  );
};
