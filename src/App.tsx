import "./App.css";
import { BrowserRouter } from "react-router";
import RootNavigator from "./services/routing";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/auth-provider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RootNavigator />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
