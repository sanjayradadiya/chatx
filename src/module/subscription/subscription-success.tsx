import { useSubscription } from "@/module/subscription/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router";

const SubscriptionSuccess = () => {
  const { loading, processed } = useSubscription();
  const navigate = useNavigate();


  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <div className="flex flex-col items-center justify-center text-center">
        {loading && !processed ? (
          <>
            <Loader2Icon className="h-16 w-16 text-primary animate-spin mb-6" />
            <h1 className="text-3xl font-bold mb-4">Processing your subscription</h1>
            <p className="text-muted-foreground mb-8">
              Please wait while we finalize your subscription...
            </p>
          </>
        ) : (
          <>
            <CheckCircle2Icon className="h-16 w-16 text-primary mb-6" />
            <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your subscription. Your account has been successfully upgraded.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/subscription")}>
                View Subscription
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
