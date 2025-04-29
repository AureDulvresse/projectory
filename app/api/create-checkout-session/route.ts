import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour effectuer cette action" },
        { status: 401 }
      );
    }

    const { plan } = await req.json();

    // Définir le prix en fonction du plan
    const priceId =
      plan === "pro"
        ? process.env.STRIPE_PRO_PRICE_ID
        : process.env.STRIPE_ENTERPRISE_PRICE_ID;

    if (!priceId) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    // Créer la session de paiement
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email!,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscribe?plan=${plan}`,
      metadata: {
        userId: session.user.id,
        plan,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session de paiement:",
      error
    );
    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la création de la session de paiement",
      },
      { status: 500 }
    );
  }
}
