import { SubscriptionPlan } from "./types";

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: "Free",
    price: 0,
    description: "Basic plan for casual use",
    features: [
      "3 chats per day",
      "1 response per chat user",
      "Basic AI responses",
      "Standard support"
    ],
    isPro: false,
    isDisplayButton: false,
  },
  {
    name: "Pro Basic",
    price: 9.99,
    description: "Great for regular users",
    features: ["5 chats per day","3 response per chat user", "Advanced AI responses", "Standard support"],
    priceId: "price_test_pro_basic",
    isPro: true,
    isDisplayButton: true,
  },
  {
    name: "Pro Plus",
    price: 19.99,
    description: "Premium experience for power users",
    features: [
      "10 chats per day",
      "5 response per chat user",
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