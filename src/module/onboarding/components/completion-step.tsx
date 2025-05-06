import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, AlertTriangle, Loader2 } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/config/constant";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useProfile } from "@/module/profile/hooks/useProfile";
import { useSubscription } from "@/module/subscription/hooks/useSubscription";
import { SUBSCRIPTION_PLAN } from "@/config/enum";
import { SubscriptionData } from "@/config/types";
import { useTheme } from "@/context/theme-provider";

interface CompletionStepProps {
  onComplete: () => void;
  onBack: () => void;
  profileData: {
    fullName: string;
    avatarUrl: string;
  };
  subscriptionPlan: string;
}

export const CompletionStep = ({
  onComplete,
  onBack,
  profileData,
  subscriptionPlan,
}: CompletionStepProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get current subscription
  const { subscription } = useSubscription();
  
  // Use profile hook with proper type handling
  const { userProfile, getInitials } = useProfile(subscription || {} as SubscriptionData);
   // Get theme context
   const { theme, colorScheme } = useTheme();

  const planType = subscriptionPlan || subscription?.planName || SUBSCRIPTION_PLAN.FREE;
  const planDetails = SUBSCRIPTION_PLANS.find((plan) => plan.type === planType) || SUBSCRIPTION_PLANS[0];

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setShowError(true);
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Complete onboarding
      await onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Onboarding Setup</CardTitle>
        <CardDescription>
          Review your information and complete your setup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/40 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Your Profile</h3>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/30">
              <AvatarImage 
                src={profileData.avatarUrl || userProfile.avatarUrl} 
                alt={profileData.fullName || userProfile.full_name} 
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{profileData.fullName || userProfile.full_name}</p>
              <p className="text-sm text-muted-foreground">
                Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </p>
              <p className="text-sm text-muted-foreground">
                Color Scheme: {colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/40 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Your Subscription</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">{planDetails.name}</p>
              <p className="text-sm text-muted-foreground">
                {planDetails.price > 0
                  ? `$${planDetails.price}/month`
                  : "Free"}
              </p>
            </div>
            {planDetails.isPro && (
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Pro
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Features:</p>
            <ul className="text-sm space-y-1">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-start gap-2">
            <div className="pt-0.5">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (e.target.checked) setShowError(false);
                }}
                aria-label="Accept terms and conditions"
                title="Accept terms and conditions"
              />
            </div>
            <div>
              <Label htmlFor="terms" className="font-medium">
                I accept the Terms and Conditions
              </Label>
              <p className="text-sm text-muted-foreground">
                By checking this box, you agree to our{" "}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-primary underline">
                      Terms and Conditions
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="max-h-[60vh] overflow-y-auto">
                          <p className="mb-4">
                            By using ChatX, you agree to the following terms and conditions:
                          </p>
                          <h3 className="text-base font-semibold mb-2">1. User Accounts</h3>
                          <p className="mb-4">
                            You are responsible for maintaining the confidentiality of your account information and password. You agree to notify us immediately of any unauthorized use of your account.
                          </p>
                          <h3 className="text-base font-semibold mb-2">2. Acceptable Use</h3>
                          <p className="mb-4">
                            You agree not to use the service for any illegal purposes or to conduct any illegal activity. You shall not use automated systems or software to extract data from the service.
                          </p>
                          <h3 className="text-base font-semibold mb-2">3. Subscriptions</h3>
                          <p className="mb-4">
                            Subscription fees are charged in advance on a monthly basis. You can cancel your subscription at any time, but refunds are not provided for partial month usage.
                          </p>
                          <h3 className="text-base font-semibold mb-2">4. Privacy</h3>
                          <p className="mb-4">
                            Your privacy is important to us. We collect and process personal information in accordance with our Privacy Policy.
                          </p>
                          <h3 className="text-base font-semibold mb-2">5. Termination</h3>
                          <p className="mb-4">
                            We reserve the right to terminate or suspend your account and refuse any and all current or future use of the service, for any reason at any time.
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      <AlertDialogAction onClick={() => setTermsAccepted(true)}>
                        Accept Terms
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </p>
              {showError && !termsAccepted && (
                <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>You must accept the terms and conditions to continue</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={onBack} type="button" disabled={isSubmitting} className="cursor-pointer">
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          type="button" 
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}; 