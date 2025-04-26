import { useAuthProvider } from "@/context/auth-provider";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";

const ProtectedRoute = () => {
  const { session, loading } = useAuthProvider();

  // Show loading screen while authentication is in progress
  if (loading) return <LoadingScreen message="Checking your authentication..." />;

  // Redirect to login if not authenticated
  return session ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
