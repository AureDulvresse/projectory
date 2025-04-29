"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { loginSchema } from "@/validators/auth";
import { RegisterFormData } from "@/types/register";
import { stripe } from "../stripe";

export const logout = async () => {
  await signOut();
};

export async function login(data: z.infer<typeof loginSchema>) {
  try {
    // Validation des données
    const validatedData = loginSchema.parse(data);

    // Vérifier si l'utilisateur existe
    const user = await db.user.findUnique({
      where: { email: validatedData.email },
      include: {
        tenants: true,
      },
    });

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Vérifier le mot de passe
    const isPasswordValid = await compare(
      validatedData.password,
      user.password!
    );
    if (!isPasswordValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Vérifier si l'utilisateur a un tenant
    if (!user.primaryTenantId) {
      throw new Error("Aucun tenant associé à cet utilisateur");
    }

    // Connexion avec NextAuth
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
}

export async function register(data: RegisterFormData) {
  try {
    const { email, name, password, tenantName, tenantSlug, plan } = data;
    // Vérifier si l'email existe déjà
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Vérifier si le domaine existe déjà
    const existingTenant = await db.tenant.findUnique({
      where: { domain: tenantSlug },
    });

    if (existingTenant) {
      throw new Error("Ce domaine est déjà utilisé");
    }

    // Créer un client Stripe si le plan n'est pas gratuit
    let stripeCustomerId = null;
    let stripeSubscriptionId = null;

    if (plan !== "free") {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          plan,
        },
      });

      stripeCustomerId = customer.id;

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: plan === "pro" ? "price_pro" : "price_enterprise",
          },
        ],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      stripeSubscriptionId = subscription.id;
    }

    // Créer le tenant
    const tenant = await db.tenant.create({
      data: {
        name: tenantName,
        domain: tenantSlug,
        slug: tenantSlug.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      },
    });

    // Créer l'utilisateur
    const hashedPassword = await hash(password, 10);
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "ADMIN",
        primaryTenantId: tenant.id,
        tenants: {
          connect: {
            id: tenant.id,
          },
        },
        subscription:
          plan !== "free"
            ? {
                create: {
                  status: "active",
                  plan,
                  stripeSubscriptionId,
                  stripeCustomerId,
                  stripePriceId:
                    data.plan === "pro" ? "price_pro" : "price_enterprise",
                  currentPeriodEnd: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ),
                },
              }
            : undefined,
      },
    });

    // Créer un espace de travail par défaut pour l'utilisateur
    const workspace = await db.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        description: "Espace de travail par défaut",
        ownerId: user.id,
        tenantId: tenant.id,
        maxMembers: plan === "free" ? 1 : plan === "pro" ? 10 : 999999,
        isPersonal: true,
      },
    });

    // Ajouter l'utilisateur comme administrateur de l'espace de travail
    await db.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "ADMIN",
      },
    });

    console.log("Done");

    revalidatePath("/");
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
        },
        subscription:
          plan !== "free"
            ? {
                id: stripeSubscriptionId,
                status: "active",
                plan,
              }
            : null,
      },
    };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return { error: "Erreur lors de l'inscription."};
  }
}
