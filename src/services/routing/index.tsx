import HomePage from "@/pages/home/homePage";
import Login from "@/pages/login/login";
import { Route, Routes } from "react-router";

const RootNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
};

export default RootNavigator;
