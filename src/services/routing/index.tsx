import HomePage from "@/pages/home/homePage";
import Login from "@/pages/login/login";
import SignUpPage from "@/pages/signup/signup-page";
import { Route, Routes } from "react-router";
import ProtectedRoute from "./protected-route";

const RootNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={"page not found"} />
    </Routes>
  );
};

export default RootNavigator;
