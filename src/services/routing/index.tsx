import { WelcomeScreen } from "@/module/dashboard/components/welcome-screen";
import Login from "@/pages/login/login";
import SignUpPage from "@/pages/signup/signup-page";
import { Route, Routes } from "react-router";
import ProtectedRoute from "./protected-route";
import ChatWindow from "@/module/chatWindow";
import { AppLayout } from "@/module/layout/app-layout";
import NotFound from "@/pages/not-found/not-found";
import TermsAndConditions from "@/module/auth/TermsAndConditions";
import ResetPassword from "@/pages/reser-password/reser-password";
import ForgotPassword from "@/pages/forgot-password/forgot-password";
import ProfilePage from "@/pages/profile/profile-page";
import SubscriptionPage from "@/pages/subscription/subscription-page";
import SubscriptionSuccessPage from "@/pages/subscription/subscription-success-page";
import OnboardingFlow from "@/module/onboarding";

const RootNavigator = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      {/* All Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding Route */}
        <Route path="/onboarding" element={<OnboardingFlow />} />

        {/* App Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<WelcomeScreen />} />
          <Route path="/chat/:id" element={<ChatWindow />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route
            path="/subscription/success"
            element={<SubscriptionSuccessPage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RootNavigator;
