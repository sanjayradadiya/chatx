import { useAuthProvider } from "@/context/auth-provider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth-service";

const ProtectedRoute = () => {
  const { session, loading } = useAuthProvider();
  const [isOnboarding, setIsOnboarding] = useState<boolean | null>(null);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const location = useLocation();
  const isOnboardingPath = location.pathname === "/onboarding";

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
  if (loading || onboardingLoading) 
    return <LoadingScreen message="Checking authentication..." />;

  // Redirect to login if not authenticated
  if (!session) 
    return <Navigate to="/" replace />;

  // Handle onboarding logic based on path and onboarding status
  if (isOnboardingPath) {
    // If user is on onboarding page but has already completed onboarding, redirect to dashboard
    if (isOnboarding) 
      return <Navigate to="/dashboard" replace />;
    
    // Otherwise, show onboarding flow
    return <Outlet />;
  } else {
    // For protected routes, redirect to onboarding if it's not completed
    if (!isOnboarding) 
      return <Navigate to="/onboarding" replace />;
    
    // User is authenticated and has completed onboarding
    return <Outlet />;
  }
};

export default ProtectedRoute;
