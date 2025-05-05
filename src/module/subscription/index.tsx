import { useSubscription } from "@/module/subscription/hooks/useSubscription";
import { useAuthProvider } from "@/context/auth-provider";
import { SubscriptionCard } from "./components/subscription-card";
import { SUBSCRIPTION_PLANS } from "@/config/constant";
import { isLowerTierPlan } from "@/lib/subscription-utils";
import { SUBSCRIPTION_PLAN } from "@/config/enum";

const Subscription = () => {
  const { currentUser } = useAuthProvider();
  const { subscription, loading, handleSubscription } = useSubscription();

  if (!currentUser) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">
            Please login to view subscription plans
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container w-full mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 justify-center">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentPlan = subscription?.planName === plan.type;
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
              isCurrentPlan={isCurrentPlan}
              loading={loading}
              onSubscribe={() => handleSubscription(plan.type)}
              buttonText={plan.buttonText}
              isDisplayButton={plan.isDisplayButton}
              isPro={plan.isPro}
              disabled={isLowerTier}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Subscription;
