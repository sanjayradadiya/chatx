import LoginForm from "@/module/auth/login-from";
import { useAuthProvider } from "@/context/auth-provider";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { session, isOnboardingComplete, loading } = useAuthProvider();
  
  // Get the intended destination from location state, or default routes
  const from = isOnboardingComplete ? "/dashboard" : "/onboarding";
      
  // If authenticated, redirect to appropriate page based on onboarding status
  if (session && !loading) {
    return <Navigate to={from} replace />;
  }
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
