import { useEffect, useState } from "react";
import { WelcomeStep } from "./components/welcome-step";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth-service";
import { ProfileStep } from "./components/profile-step";
import { SubscriptionStep } from "./components/subscription-step";
import { CompletionStep } from "./components/completion-step";
import { useAuthProvider } from "@/context/auth-provider";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useOnboardingLoader } from "@/context/onboarding-loader-context";

// Onboarding steps
enum OnboardingStep {
  WELCOME = 0,
  PROFILE = 1,
  SUBSCRIPTION = 2,
  COMPLETION = 3
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.WELCOME);
  const [profileData, setProfileData] = useState({
    fullName: '',
    avatarUrl: '',
  });
  const navigate = useNavigate();
  const { refreshUserData } = useAuthProvider();
  const { isLoading } = useOnboardingLoader();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const onboardingStep = params.get("on_boarding_step");
    if (onboardingStep) {
      setCurrentStep(parseInt(onboardingStep));
    }
  }, []);

  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleProfileUpdate = (data: typeof profileData) => {
    setProfileData(data);
    handleNextStep();
  };

  const handleSubscriptionSelect = () => {
    handleNextStep();
  };

  const handleCompleteOnboarding = async () => {
    try {
      // Update profile data
      await authService.updateUserProfile({
        full_name: profileData.fullName,
        avatar_url: profileData.avatarUrl,
      });

      // Mark onboarding as completed
      await authService.completeOnboarding();
      
      // Refresh the user data in the auth context
      await refreshUserData();

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.WELCOME:
        return <WelcomeStep onNext={handleNextStep} />;
      case OnboardingStep.PROFILE:
        return (
          <ProfileStep 
            onNext={handleProfileUpdate} 
            onBack={handlePreviousStep}
            initialData={profileData}
          />
        );
      case OnboardingStep.SUBSCRIPTION:
        return (
          <SubscriptionStep 
            onNext={handleSubscriptionSelect} 
            onBack={handlePreviousStep}
          />
        );
      case OnboardingStep.COMPLETION:
        return (
          <CompletionStep 
            onComplete={handleCompleteOnboarding} 
            onBack={handlePreviousStep}
            profileData={profileData}
          />
        );
      default:
        return <WelcomeStep onNext={handleNextStep} />;
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen message="Checking authentication..." />}
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-4xl p-6 mx-auto">
          {renderStep()}
        </div>
      </div>
    </>
  );
};

export default OnboardingFlow; 