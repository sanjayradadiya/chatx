import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  isPro?: boolean;
  isCurrentPlan?: boolean;
  loading?: boolean;
  onSubscribe: () => void;
  isDisplayButton?: boolean;
}

export function SubscriptionCard({
  title,
  price,
  description,
  features,
  isPro = false,
  isCurrentPlan = false,
  loading = false,
  onSubscribe,
  isDisplayButton = false,
}: SubscriptionCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm bg-card border-card-foreground/20 transition-all duration-200 justify-between",
        isPro && "shadow-lg relative overflow-hidden",
        isPro &&
          "before:absolute before:inset-0 before:inset-x-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent"
      )}
    >
      {isPro && (
        <div className="absolute top-4 -right-12 rotate-45 bg-primary text-primary-foreground px-10 py-1 text-xs font-bold">
          PREMIUM
        </div>
      )}

      <CardHeader className="p-6 pb-0">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{title}</div>
          {isCurrentPlan && (
            <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
              Current Plan
            </div>
          )}
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
          {price > 0 && (
            <span className="text-sm text-muted-foreground ml-1">/month</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </CardHeader>

      <CardContent className="p-6">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className={`p-6 pt-0 ${isDisplayButton ? "" : "pb-16"}`}>
        {isDisplayButton && (
          <Button
            variant={isPro ? "default" : "outline"}
            className="w-full cursor-pointer"
            onClick={onSubscribe}
            disabled={loading || isCurrentPlan}
          >
            {isCurrentPlan
              ? "Current Plan"
              : price === 0
              ? "Get Free Plan"
              : "Get Subscription"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
