import supabaseClient from "./supabase/client";
import { APP_CONFIG } from "@/config/config";
import { SUBSCRIPTION_PLANS } from "@/config/constant";
import { SubscriptionData } from "@/config/types";
import Stripe from "stripe";

const stripe = new Stripe(APP_CONFIG.STRIPE_SECRET_KEY as string);

export const subscriptionService = {
  /**
   * Get the current user's subscription
   * @param userId The ID of the user
   * @returns The user's subscription data
   */
  async getUserSubscription(userId: string): Promise<SubscriptionData | null> {
    const { data, error } = await supabaseClient
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      planName: data.plan_name,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * Update a user's subscription
   * @param userId The ID of the user
   * @param planName The name of the plan to subscribe to
   * @returns The result of the operation
   */
  async updateUserSubscription(userId: string, planName: string) {
    // Check if the user already has a subscription record
    const { data } = await supabaseClient
      .from("user_subscriptions")
      .select("id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    // Either update existing record or create a new one
    if (data?.id) {
      return await supabaseClient
        .from("user_subscriptions")
        .update({ 
          plan_name: planName, 
          active: true,
        })
        .eq("id", data.id);
    } else {
      return await supabaseClient
        .from("user_subscriptions")
        .insert({
          user_id: userId,
          plan_name: planName,
          active: true
        });
    }
  },

  /**
   * Create a Stripe checkout session
   * @param userId The ID of the user
   * @param planName The name of the plan
   * @param successUrl The URL to redirect to after successful payment
   * @param cancelUrl The URL to redirect to if payment is cancelled
   * @returns The checkout session URL
   */
  async createCheckoutSession(
    userId: string,
    planName: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.name === planName);
    
    if (!plan || !plan.priceId) {
      throw new Error("Invalid plan or plan does not have a price ID");
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&plan=${planName}`,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planName,
      },
    });

    return session.url || "";
  },
}; 