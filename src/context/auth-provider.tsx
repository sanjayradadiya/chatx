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
  isOnboardingComplete: boolean | null;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  logout: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  isOnboardingComplete: null,
  refreshUserData: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  const navigate = useNavigate();

  const refreshUserData = async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setIsOnboardingComplete(user.user_metadata?.is_onboarding === true);
    }
  };

  useEffect(() => {
    // Handle initial session loading
    const initAuth = async () => {
      try {
        const currentSession = await authService.getCurrentSession();
        setSession(currentSession);
        
        if (currentSession) {
          await refreshUserData();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const subscription = authService.subscribeToAuthChanges(async (currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        await refreshUserData();
      } else {
        setCurrentUser(null);
        setIsOnboardingComplete(null);
      }
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
      setCurrentUser(null);
      setIsOnboardingComplete(null);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        loading, 
        logout, 
        currentUser, 
        setCurrentUser, 
        isOnboardingComplete,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);
