"use server";

import { db } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sendPasswordResetEmail } from "@/lib/email";

const PASSWORD_RESET_EXPIRY_HOURS = 1;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export const requestPasswordResetSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    ),
});

export async function requestPasswordReset(
  data: z.infer<typeof requestPasswordResetSchema>
) {
  try {
    const { email } = data;

    // Vérifier si l'utilisateur existe
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return { success: true };
    }

    // Vérifier si un token actif existe déjà
    const existingToken = await db.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingToken) {
      return { success: true };
    }

    // Créer un nouveau token
    const token = uuidv4();
    const expiresAt = addHours(new Date(), PASSWORD_RESET_EXPIRY_HOURS);

    await db.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Envoyer l'email de réinitialisation
    await sendPasswordResetEmail(user.email!, token);

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    throw new Error(
      "Une erreur est survenue lors de la demande de réinitialisation"
    );
  }
}

export async function resetPassword(data: z.infer<typeof resetPasswordSchema>) {
  try {
    const { token, password } = data;

    // Vérifier le token
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new Error("Token invalide ou expiré");
    }

    if (resetToken.used) {
      throw new Error("Ce token a déjà été utilisé");
    }

    if (resetToken.expiresAt < new Date()) {
      throw new Error("Token expiré");
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await hash(password, 10);
    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: {
          password: hashedPassword,
          passwordChangedAt: new Date(),
          failedLoginAttempts: 0,
        },
      }),
      db.passwordResetToken.update({
        where: { id: resetToken.id },
        data: {
          used: true,
          usedAt: new Date(),
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    throw error;
  }
}

export async function validatePasswordResetToken(token: string) {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { valid: false, message: "Token invalide" };
    }

    if (resetToken.used) {
      return { valid: false, message: "Token déjà utilisé" };
    }

    if (resetToken.expiresAt < new Date()) {
      return { valid: false, message: "Token expiré" };
    }

    return { valid: true };
  } catch (error) {
    console.error("Erreur lors de la validation du token:", error);
    return { valid: false, message: "Erreur lors de la validation" };
  }
}
