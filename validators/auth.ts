import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const personalInfoSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Format d'email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    tenantName: z.string().min(2, "Le nom de l'organisation est requis"),
    tenantSlug: z
      .string()
      .min(2, "L'identifiant de l'organisation est requis")
      .regex(
        /^[a-z0-9-]+$/,
        "L'identifiant ne peut contenir que des lettres minuscules, chiffres et tirets"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const subscriptionPlanSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"])
});

export const paymentSchema = z.object({
  paymentMethod: z.any().optional(),
});

export const cardPaymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Numéro de carte invalide"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Date d'expiration invalide (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "Code de sécurité invalide"),
  nameOnCard: z.string().min(2, "Nom invalide"),
});

export const bankTransferSchema = z.object({
  accountName: z.string().min(2, "Nom du titulaire invalide"),
  iban: z.string().min(15, "IBAN invalide"),
  bic: z.string().min(8, "BIC/SWIFT invalide"),
});