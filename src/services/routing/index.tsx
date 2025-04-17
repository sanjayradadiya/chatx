import { WelcomeScreen } from "@/module/dashboard/components/welcome-screen";
import Login from "@/pages/login/login";
import SignUpPage from "@/pages/signup/signup-page";
import { Route, Routes } from "react-router";
import ProtectedRoute from "./protected-route";
import ChatWindow from "@/module/chatWindow";
import { AppLayout } from "@/module/layout/app-layout";
import NotFound from "@/pages/not-found/not-found";
import AccountPage from "@/pages/account/account-page";
import TermsAndConditions from "@/module/auth/TermsAndConditions";
import ResetPassword from "@/pages/reser-password/reser-password";
import ForgotPassword from "@/pages/forgot-password/forgot-password";

const RootNavigator = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<WelcomeScreen />} />
          <Route path="/chat/:id" element={<ChatWindow />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RootNavigator;
