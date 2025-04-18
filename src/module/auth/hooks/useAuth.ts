import { LoginFormInput, SignUpFormInput } from "@/config/types";
import { useAuthProvider } from "@/context/auth-provider";
import supabaseClient from "@/services/supabase/client";
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
    const { error } = await supabaseClient.auth.signInWithPassword(loginData);

    if (error) {
      toast(error.message, {
        position: "top-center"
      })
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const signUpNewUser = useCallback(async (signUpData: SignUpFormInput) => {
    const { error } = await supabaseClient.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
      options: {
        data: {
          'fullname': signUpData.fullname,
        }
      },
    })

    if (error) {
      toast(error.message, {
        position: 'top-center'
      });
    }

    toast("Check your email for verification link", {
      position: "top-center"
    })
  }, []);

  return {
    signInWithEmail,
    signUpNewUser,
  };
};

export default useAuth;
