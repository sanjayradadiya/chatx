import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/module/subscription/hooks/useSubscription";
import { SubscriptionCard } from "@/module/subscription/components/subscription-card";
import { SUBSCRIPTION_PLANS } from "@/config/constant";
import { isLowerTierPlan } from "@/lib/subscription-utils";
import { SUBSCRIPTION_PLAN } from "@/config/enum";
import { useCallback, useEffect, useMemo } from "react";
import { useOnboardingLoader } from "@/context/onboarding-loader-context";

interface SubscriptionStepProps {
  onNext: (plan: string) => void;
  onBack: () => void;
}

export const SubscriptionStep = ({ onNext, onBack }: SubscriptionStepProps) => {
  const { subscription, loading, handleSubscription } = useSubscription();
  const { setIsLoading } = useOnboardingLoader();

  // Ensure the onboarding loader is turned off when landing on this page
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleSelectPlan = useCallback(async (planType: string, isOnboarding: boolean) => {
    // If plan requires payment, redirect to subscription page and show loader
    if (planType !== "FREE") {
      // Redirect to subscription handling
      await handleSubscription(planType as SUBSCRIPTION_PLAN, isOnboarding);
    } else {
      // For free plan, just continue with onboarding
      onNext(planType);
    }
  }, [handleSubscription, onNext]);

  // Check if user has already selected a plan from payment flow
  const currentSelectedPlan = useMemo(() => {
    if (subscription?.planName) {
      return subscription.planName;
    }

    return "FREE";
  }, [subscription?.planName]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Choose a Subscription Plan</CardTitle>
        <CardDescription>
          Select the plan that best fits your needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isLowerTier = isLowerTierPlan(
              plan.type as SUBSCRIPTION_PLAN,
              subscription?.planName as SUBSCRIPTION_PLAN | undefined
            );

            return (
              <SubscriptionCard
                key={plan.name}
                title={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                isCurrentPlan={plan.type === currentSelectedPlan}
                isOnboarding={true}
                loading={loading}
                onSubscribe={() => handleSelectPlan(plan.type, true)}
                buttonText={"Choose plane "}
                isDisplayButton={plan.isDisplayButton}
                isPro={plan.isPro}
                disabled={isLowerTier}
              />
            );
          })}
        </div>

        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-2 text-sm text-muted-foreground">Processing your subscription...</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={onBack} type="button" className="cursor-pointer">
          Back
        </Button>
        <Button
          onClick={() => onNext(currentSelectedPlan)}
          type="button"
          disabled={loading}
          className="cursor-pointer"
        >
          Continue with {SUBSCRIPTION_PLANS.find(p => p.type === currentSelectedPlan)?.name || "Free"} Plan
        </Button>
      </CardFooter>
    </Card>
  );
}; 