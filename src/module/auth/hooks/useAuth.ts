import { LoginFormInput, SignUpFormInput } from "@/config/types";
import { useAuthProvider } from "@/context/auth-provider";
import { authService } from "@/services/auth-service";
import { Provider } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner"


const useAuth = (reset: () => void) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser, refreshUserData } = useAuthProvider();
  const navigate = useNavigate();
  const location = useLocation();

  const signInWithEmail = useCallback(async (loginData: LoginFormInput) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signInWithEmail(loginData);

      if (error) {
        throw new Error(error.message);
      } else {
        // Update user data in auth context
        setCurrentUser(data.user);
        await refreshUserData();
        
        // Check onboarding status and redirect accordingly
        const isOnboardingCompleted = data.user?.user_metadata?.is_onboarding === true;
        const redirectPath = isOnboardingCompleted ? '/dashboard' : '/onboarding';
        
        // Use replace to prevent back button issues
        navigate(redirectPath, { replace: true });
        setLoading(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error during login";
      await authService.signOut();
      toast.error(errorMessage, {
        position: "top-center",
      });
      setLoading(false);
    }
  }, [navigate, location, setCurrentUser, refreshUserData]);

  const signUpNewUser = useCallback(async (signUpData: SignUpFormInput) => {
    try {
      setLoading(true);
      const { error, userExists } = await authService.signUpWithEmail(signUpData);

      if (userExists) {
        throw new Error('User already exists.');
      }

      if (error) {
        throw new Error(error.message);
      } else {
        toast("Check your email for verification link", {
          position: "top-center"
        });
        reset();
        setLoading(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error signing up";
      await authService.signOut();
      toast.error(errorMessage, {
        position: "top-center",
      });
      setLoading(false);
    }
  }, [reset]);

  const signInWithAuthProvider = useCallback(async (authProvider: Provider) => {
    setLoading(true);
    const { data,  error } = await authService.signInWithAuthProvider(authProvider);
    
    if (error) {
      toast(error.message, {
        position: "top-center"
      })
      setLoading(false);
    } else {
      console.log("After sign in with auth provider ==>", data);
      navigate('/dashboard');
      setLoading(false);
    }
  }, [navigate]);

  return {
    signInWithEmail,
    signUpNewUser,
    signInWithAuthProvider,
    setShowPassword,
    showPassword,
    loading
  };
};

export default useAuth;
