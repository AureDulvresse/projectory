"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

const priceIds = {
  free: "price_free",
  pro: "price_pro",
  enterprise: "price_enterprise",
};

export async function createCheckoutSession(priceId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Non authentifié");
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Si l'utilisateur a déjà un abonnement actif
    if (user.subscription?.status === "active") {
      throw new Error("Vous avez déjà un abonnement actif");
    }

    // Créer une session de paiement Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: user.email!,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return stripeSession.url;
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session de paiement:",
      error
    );
    throw error;
  }
}

export async function handleSubscriptionChange(
  userId: string,
  subscriptionId: string
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await db.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      update: {
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement:", error);
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Non authentifié");
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new Error("Aucun abonnement trouvé");
    }

    // Annuler l'abonnement dans Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Mettre à jour le statut dans la base de données
    await db.subscription.update({
      where: { userId: session.user.id },
      data: { status: "canceled" },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'annulation de l'abonnement:", error);
    throw error;
  }
}
