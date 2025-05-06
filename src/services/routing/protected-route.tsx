import { useAuthProvider } from "@/context/auth-provider";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth-service";

const ProtectedRoute = () => {
  const { session, loading } = useAuthProvider();
  const [isOnboarding, setIsOnboarding] = useState<boolean | null>(null);
  const [onboardingLoading, setOnboardingLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (session) {
        const onboardingCompleted = await authService.checkOnboardingStatus();
        setIsOnboarding(onboardingCompleted);
      }
      setOnboardingLoading(false);
    };

    checkOnboarding();
  }, [session]);

  // Show loading screen while authentication or onboarding check is in progress
  if (loading || onboardingLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (session && isOnboarding) {
    return <Outlet />;
  } else if (session && isOnboarding === false) {
    // Otherwise, show onboarding flow
    return <Navigate to="/onboarding" replace />;
  } else if (!session && isOnboarding === null) {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
