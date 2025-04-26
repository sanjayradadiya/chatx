import { LoginFormInput, SignUpFormInput } from "@/config/types";
import { useAuthProvider } from "@/context/auth-provider";
import { authService } from "@/services/auth-service";
import { Provider } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner"


const useAuth = (reset: () => void) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()
  const { session } = useAuthProvider()


  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const signInWithEmail = useCallback(async (loginData: LoginFormInput) => {
    setLoading(true);
    const { error } = await authService.signInWithEmail(loginData);

    if (error) {
      toast(error.message, {
        position: "top-center"
      })
      setLoading(false);
    } else {
      navigate('/dashboard');
      setLoading(false);
    }
  }, [navigate]);

  const signUpNewUser = useCallback(async (signUpData: SignUpFormInput) => {
    setLoading(true);
    const { error } = await authService.signUpWithEmail(signUpData);

    if (error) {
      toast(error.message, {
        position: 'top-center'
      });
      setLoading(false);
    } else {
      toast("Check your email for verification link", {
        position: "top-center"
      });
      reset();
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
