import { SUBSCRIPTION_PLANS } from "@/services/subscription-service";
import { useSubscription } from "@/module/subscription/hooks/useSubscription";
import { useAuthProvider } from "@/context/auth-provider";
import { SubscriptionCard } from "./components/subscription-card";

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
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {/* Free Plan */}
        <SubscriptionCard
          title={SUBSCRIPTION_PLANS.FREE.name}
          price={SUBSCRIPTION_PLANS.FREE.price}
          description={SUBSCRIPTION_PLANS.FREE.description}
          features={SUBSCRIPTION_PLANS.FREE.features}
          isCurrentPlan={subscription?.planName === "FREE"}
          loading={loading}
          onSubscribe={() => handleSubscription("FREE")}
        />

        {/* Pro Basic Plan */}
        <SubscriptionCard
          title={SUBSCRIPTION_PLANS.PRO_BASIC.name}
          price={SUBSCRIPTION_PLANS.PRO_BASIC.price}
          description={SUBSCRIPTION_PLANS.PRO_BASIC.description}
          features={SUBSCRIPTION_PLANS.PRO_BASIC.features}
          isPro
          isCurrentPlan={subscription?.planName === "PRO_BASIC"}
          loading={loading}
          onSubscribe={() => handleSubscription("PRO_BASIC")}
        />

        {/* Pro Plus Plan */}
        <SubscriptionCard
          title={SUBSCRIPTION_PLANS.PRO_PLUS.name}
          price={SUBSCRIPTION_PLANS.PRO_PLUS.price}
          description={SUBSCRIPTION_PLANS.PRO_PLUS.description}
          features={SUBSCRIPTION_PLANS.PRO_PLUS.features}
          isPro
          isCurrentPlan={subscription?.planName === "PRO_PLUS"}
          loading={loading}
          onSubscribe={() => handleSubscription("PRO_PLUS")}
        />
      </div>
    </div>
  );
};

export default Subscription;
