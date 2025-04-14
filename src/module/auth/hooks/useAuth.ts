import { LoginFormInput } from "@/config/types";
import supaBaseClient from "@/services/supabase/client";
import { useCallback } from "react";

const useAuth = () => {
  const signInWithEmail = useCallback(async (loginData: LoginFormInput) => {
    const { data, error } = await supaBaseClient.auth.signInWithPassword(loginData);
    console.log("data ==>", data, error);
  }, []);

  return {
    state: {},
    action: {
      signInWithEmail,
    },
  };
};

export default useAuth;
