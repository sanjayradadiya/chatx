import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/module/subscription/hooks/useSubscription";
import { SubscriptionCard } from "@/module/subscription/components/subscription-card";
import { SUBSCRIPTION_PLANS } from "@/config/constant";
import { isLowerTierPlan } from "@/lib/subscription-utils";
import { SUBSCRIPTION_PLAN } from "@/config/enum";
import { toast } from "sonner";
import { useEffect } from "react";

interface SubscriptionStepProps {
  onNext: (plan: string) => void;
  onBack: () => void;
  selectedPlan: string;
}

export const SubscriptionStep = ({ onNext, onBack, selectedPlan }: SubscriptionStepProps) => {
  const { subscription, loading, handleSubscription } = useSubscription();

  // Check if returning from payment flow
  useEffect(() => {
    const isReturningFromPayment = sessionStorage.getItem("onboarding_flow") === "true";
    const storedPlan = sessionStorage.getItem("selected_plan");
    
    if (isReturningFromPayment && storedPlan && subscription?.planName === storedPlan) {
      // If successful payment and back at onboarding, clear session storage and continue
      sessionStorage.removeItem("onboarding_flow");
      sessionStorage.removeItem("selected_plan");
      
      toast.success(`Successfully subscribed to the ${storedPlan.replace('_', ' ')} plan`, {
        position: "top-center",
      });
      
      // Continue with onboarding
      onNext(storedPlan);
    }
  }, [subscription, onNext]);

  const handleSelectPlan = async (planType: string) => {
    // If plan requires payment, redirect to subscription page
    if (planType !== "FREE") {
      // Store the current plan in session storage to return to onboarding after payment
      sessionStorage.setItem("onboarding_flow", "true");
      sessionStorage.setItem("selected_plan", planType);
      
      // Redirect to subscription handling
      await handleSubscription(planType as SUBSCRIPTION_PLAN);
    } else {
      // For free plan, just continue with onboarding
      onNext(planType);
    }
  };

  // Check if user has already selected a plan from payment flow
  const currentSelectedPlan = selectedPlan || (subscription?.planName as string) || "FREE";

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
                isCurrentPlan={false}
                loading={loading}
                onSubscribe={() => handleSelectPlan(plan.type)}
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