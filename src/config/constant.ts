import { SubscriptionPlan } from "./types";
import { SUBSCRIPTION_PLAN } from "./enum";
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    type: SUBSCRIPTION_PLAN.FREE,
    name: "Free",
    price: 0,
    description: "Basic plan for casual use",
    features: [
      "3 chats per day",
      "1 response per chat",
      "Basic AI responses",
      "Standard support"
    ],
    isPro: false,
    isDisplayButton: false,
  },
  {
    type: SUBSCRIPTION_PLAN.PRO_BASIC,
    name: "Pro Basic",
    price: 9.99,
    description: "Great for regular users",
    features: ["5 chats per day", "3 response per chat", "Advanced AI responses", "Standard support"],
    priceId: "price_test_pro_basic",
    isPro: true,
    isDisplayButton: true,
  },
  {
    type: SUBSCRIPTION_PLAN.PRO_PLUS,
    name: "Pro Plus",
    price: 19.99,
    description: "Premium experience for power users",
    features: [
      "10 chats per day",
      "5 response per chat",
      "Premium support",
      "Advanced AI responses",
      "Custom chat templates",
      "Data export",
    ],
    priceId: "price_test_pro_plus",
    isPro: true,
    isDisplayButton: true,
  },
  {
    type: SUBSCRIPTION_PLAN.CUSTOM,
    name: "Custom Plan",
    price: 99.99,
    description: "Custom plan for your business",
    features: ["Unlimited chats", "Priority support", "Advanced AI responses",
      "Custom chat templates",
      "Data export",],
    priceId: "price_test_pro_enterprise",
    isPro: true,
    isDisplayButton: false,
  }
];