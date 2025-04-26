import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router";
import { authService } from "@/services/auth-service";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  logout: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  logout: () => {},
  currentUser: null,
  setCurrentUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Handle initial session loading
    authService.getCurrentSession().then((currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    // Listen for auth changes
    const subscription = authService.subscribeToAuthChanges((currentSession) => {
      setSession(currentSession);
    });

    authService.getCurrentUser().then((currentUser) => {
      setCurrentUser(currentUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    const { error } = await authService.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setSession(null); 
      navigate("/"); // redirect to login page after logout
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, loading, logout , currentUser, setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);
