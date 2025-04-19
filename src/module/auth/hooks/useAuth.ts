import { LoginFormInput, SignUpFormInput } from "@/config/types";
import { useAuthProvider } from "@/context/auth-provider";
import { authService } from "@/services/auth-service";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner"


const useAuth = () => {
  const navigate = useNavigate()
  const { session } = useAuthProvider()

  // 👇 If already logged in, redirect to home
  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const signInWithEmail = useCallback(async (loginData: LoginFormInput) => {
    const { error } = await authService.signInWithEmail(loginData);

    if (error) {
      toast(error.message, {
        position: "top-center"
      })
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const signUpNewUser = useCallback(async (signUpData: SignUpFormInput) => {
    const { error } = await authService.signUpWithEmail(signUpData);

    if (error) {
      toast(error.message, {
        position: 'top-center'
      });
    } else {
      toast("Check your email for verification link", {
        position: "top-center"
      });
    }
  }, []);

  return {
    signInWithEmail,
    signUpNewUser,
  };
};

export default useAuth;
