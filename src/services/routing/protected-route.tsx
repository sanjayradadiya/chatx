import { useAuthProvider } from "@/context/auth-provider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";

const ProtectedRoute = () => {
  const { session, loading, isOnboardingComplete } = useAuthProvider();
  const location = useLocation();

  // Show loading screen while authentication is in progress
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // If not authenticated, redirect to login with the current location
  if (!session) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // For authenticated users
  const isDashboardRoute = location.pathname === "/dashboard";
  const isOnboardingRoute = location.pathname === "/onboarding";

  // Case 1: User is on dashboard but hasn't completed onboarding
  if (isDashboardRoute && isOnboardingComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }

  // Case 2: User is on onboarding but has completed onboarding
  if (isOnboardingRoute && isOnboardingComplete === true) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access to the requested route
  return <Outlet />;
};

export default ProtectedRoute;
