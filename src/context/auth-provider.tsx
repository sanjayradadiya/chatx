import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Session } from "@supabase/supabase-js";
import supabaseClient from "@/services/supabase/client";
import { useNavigate } from "react-router";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setSession(null);
      navigate("/"); // redirect to login page after logout
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);
