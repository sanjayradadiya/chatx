import { Button } from "@/components/ui/button";
import { useAuthProvider } from "@/context/auth-provider";

const Home = () => {
  const { session, logout } = useAuthProvider();
  return (
    <>
      <div>Welcome to {session?.user.email}</div>
      <div>home </div>
      <Button onClick={logout}>Logout</Button>
    </>
  );
};

export default Home;
