import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface OnboardingLoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const OnboardingLoaderContext = createContext<OnboardingLoaderContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useOnboardingLoader = () => useContext(OnboardingLoaderContext);

export function OnboardingLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();

  // Check for query parameters on onboarding page and set loading state
  useEffect(() => {
    if (location.pathname === "/onboarding" && location.search) {
      // We have query params on the onboarding page, show loader
      setIsLoading(true);
    }
  }, [location.pathname, location.search]);


  return (
    <OnboardingLoaderContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </OnboardingLoaderContext.Provider>
  );
} 