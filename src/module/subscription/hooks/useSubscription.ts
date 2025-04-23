import { useCallback, useEffect, useState, useRef } from "react";
import { useAuthProvider } from "@/context/auth-provider";
import { subscriptionService } from "@/services/subscription-service";
import { loadStripe } from "@stripe/stripe-js";
import { APP_CONFIG } from "@/config/config";
import { toast } from "sonner";
import { useLocation } from "react-router";
import { SubscriptionData } from "@/config/types";

export const useSubscription = () => {
  const { currentUser } = useAuthProvider();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const [processed, setProcessed] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!currentUser) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        const subData = await subscriptionService.getUserSubscription(currentUser.id);
        setSubscription(subData);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [currentUser]);

  useEffect(() => {
    // Extract query parameters
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    const plan = params.get("plan");

    if (!sessionId || !plan || processed || processingRef.current || !currentUser) {
      return;
    }

    const processPayment = async () => {
      if (processingRef.current) return;
      
      processingRef.current = true;
      try {
        setLoading(true);
        
        // Update the subscription in the database
        await subscriptionService.updateUserSubscription(currentUser.id, plan);
        
        // Refetch the subscription
        const subData = await subscriptionService.getUserSubscription(currentUser.id);
        setSubscription(subData);
        
        toast.success(`Successfully subscribed to the ${plan.replace('_', ' ')} plan`, {
          position: "top-center",
        });
        setProcessed(true);
      } catch (error) {
        console.error("Error handling subscription success:", error);
        toast.error("Failed to update subscription", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [location.search, currentUser, processed]);

  /**
   * Handle subscription
   * @param planName The name of the plan to subscribe to
   */
  const handleSubscription = useCallback((planName: string) => {
    if (planName === 'FREE') {
      subscribeToFreePlan();
    } else {
      subscribeToPaidPlan(planName);
    }
  }, []);

  /**
   * Subscribe to the free plan
   */
  const subscribeToFreePlan = useCallback(async () => {
    if (!currentUser) {
      toast.error("You must be logged in to subscribe", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      await subscriptionService.updateUserSubscription(currentUser.id, "FREE");
      const subData = await subscriptionService.getUserSubscription(currentUser.id);
      setSubscription(subData);
      toast.success("Successfully subscribed to the Free plan", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error subscribing to free plan:", error);
      toast.error("Failed to subscribe to the Free plan", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  /**
   * Subscribe to a paid plan
   * @param planName The name of the plan to subscribe to
   */
  const subscribeToPaidPlan = useCallback(async (planName: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to subscribe", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      const stripe = await loadStripe(APP_CONFIG.STRIPE_PUBLIC_KEY as string);

      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      // Create a checkout session and redirect to Stripe
      const successUrl = `${window.location.origin}/subscription/success`;
      const cancelUrl = `${window.location.origin}/subscription`;

      const checkoutUrl = await subscriptionService.createCheckoutSession(
        currentUser.id,
        planName,
        successUrl,
        cancelUrl
      );

      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error subscribing to paid plan:", error);
      toast.error("Failed to initiate checkout", {
        position: "top-center",
      });
      setLoading(false);
    }
  }, [currentUser]);

  /**
   * Handle removing the plan
   */
  const handleRemovePlan = useCallback(async () => {
    if (!currentUser) {
      toast.error("You must be logged in to remove a plan", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      await subscriptionService.updateUserSubscription(currentUser.id, "FREE");
      const subData = await subscriptionService.getUserSubscription(currentUser.id);
      setSubscription(subData);
      toast.success("Successfully removed the plan", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error removing plan:", error);
      toast.error("Failed to remove the plan", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    subscription,
    loading,
    processed,
    handleSubscription,
    subscribeToFreePlan,
    subscribeToPaidPlan,
    handleRemovePlan,
  };
}; 