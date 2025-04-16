import { useAuthProvider } from "@/context/auth-provider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { session, loading } = useAuthProvider();

  if (loading) return <p>Loading...</p>;

  return session ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
