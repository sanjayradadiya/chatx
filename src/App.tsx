import { BrowserRouter } from 'react-router-dom';
import RootNavigator from "./services/routing";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/auth-provider";
import { ChatProvider } from "./context/chat-context";
import { ThemeProvider } from "./context/theme-provider";
import { OnboardingLoaderProvider } from "./context/onboarding-loader-context";
import { Analytics } from '@vercel/analytics/react';


function App() {
  return (
    <ThemeProvider 
      defaultTheme="system" 
      defaultColorScheme="default" 
      storageKey="chatx-ui-theme"
    >
      <BrowserRouter>
        <AuthProvider>
          <OnboardingLoaderProvider>
            <ChatProvider>
              <RootNavigator />
              <Toaster />
            </ChatProvider>
          </OnboardingLoaderProvider>
        </AuthProvider>
      </BrowserRouter>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
