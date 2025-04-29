import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { handleSubscriptionChange } from "@/lib/actions/subscription";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature || !webhookSecret) {
      return new NextResponse("Missing signature or webhook secret", {
        status: 400,
      });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const subscriptionId = session.subscription;
        const userId = session.metadata.userId;

        if (subscriptionId && userId) {
          await handleSubscriptionChange(userId, subscriptionId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const userId = subscription.metadata.userId;

        if (userId) {
          await handleSubscriptionChange(userId, subscription.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const userId = subscription.metadata.userId;

        if (userId) {
          await handleSubscriptionChange(userId, subscription.id);
        }
        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook error: " + (error as Error).message, {
      status: 400,
    });
  }
}
