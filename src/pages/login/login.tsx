import LoginForm from "@/module/auth/login-from";
import { useAuthProvider } from "@/context/auth-provider";
import { Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";

const Login = () => {
  const { session, isOnboardingComplete, loading } = useAuthProvider();
  
  // Get the intended destination from location state, or default routes
  const from = isOnboardingComplete ? "/dashboard" : "/onboarding";
      
  // If authenticated, redirect to appropriate page based on onboarding status
  if (session && !loading) {
    return <Navigate to={from} replace />;
  }
  
  return (
    <div className="flex flex-col min-h-svh bg-muted">
      <Header isAuthPage={false} />
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
