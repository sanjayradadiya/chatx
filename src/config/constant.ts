import { SubscriptionPlan } from "./types";

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  FREE: {
    name: "Free",
    price: 0,
    description: "Basic plan for casual use",
    features: ["5 chats per day", "Basic AI responses", "Standard support"],
  },
  PRO_BASIC: {
    name: "Pro Basic",
    price: 9.99,
    description: "Great for regular users",
    features: ["Unlimited chats", "Priority support", "Advanced AI responses"],
    priceId: "price_test_pro_basic",
  },
  PRO_PLUS: {
    name: "Pro Plus",
    price: 19.99,
    description: "Premium experience for power users",
    features: [
      "Unlimited chats",
      "Premium support",
      "Advanced AI responses",
      "Custom chat templates",
      "Data export",
    ],
    priceId: "price_test_pro_plus",
  },
};