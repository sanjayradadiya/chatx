import { BrowserRouter } from 'react-router-dom';
import RootNavigator from "./services/routing";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/auth-provider";
import { ChatProvider } from "./context/chat-context";
import { ThemeProvider } from "./context/theme-provider";

function App() {
  return (
    <ThemeProvider 
      defaultTheme="system" 
      defaultColorScheme="default" 
      storageKey="chatx-ui-theme"
    >
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <RootNavigator />
            <Toaster />
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
