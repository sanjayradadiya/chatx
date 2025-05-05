import { USER_STATUS } from "@/config/enum";
import { LoginFormInput, SignUpFormInput } from "@/config/types";
import { useAuthProvider } from "@/context/auth-provider";
import { authService } from "@/services/auth-service";
import { Provider } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner"


const useAuth = (reset: () => void) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser } = useAuthProvider();

  const navigate = useNavigate()

  const signInWithEmail = useCallback(async (loginData: LoginFormInput) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signInWithEmail(loginData);

      // Check if the user account has been marked as deleted
      if (data.user?.user_metadata?.status === USER_STATUS.DEACTIVE) {
        throw new Error('Your account has been deleted. Please contact support.');
      }

      if (error) {
        throw new Error(error.message);
      } else {
        setCurrentUser(data.user);
        navigate('/dashboard');
        setLoading(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting account";
      await authService.signOut();
      toast.error(errorMessage, {
        position: "top-center",
      });
      setLoading(false);
    }
  }, [navigate, setCurrentUser]);

  const signUpNewUser = useCallback(async (signUpData: SignUpFormInput) => {
    try {
      setLoading(true);
      const userExists = await authService.checkUserExists(signUpData.email);
      if (userExists) {
        throw new Error('User already exists.');
      }
      const { error } = await authService.signUpWithEmail(signUpData);

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
