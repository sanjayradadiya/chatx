import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuth from "./hooks/useAuth"
import { LoginFormInput } from "@/config/types"
import { useForm } from "react-hook-form"
import image from '../../assets/Image.jpeg';
import { Link } from "react-router"
import AuthOptions from "./components/auth-options"

const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<LoginFormInput>();
  
  const { signInWithEmail, signInWithAuthProvider } = useAuth(reset);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(signInWithEmail)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your ChatX account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="max@gmail.com"
                  required
                  {...register("email")}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="Password" required {...register("password")} />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
              <AuthOptions signInWithAuthProvider={signInWithAuthProvider} />
              <div className="text-center text-sm">
                Don&apos;t have an account?
                <Link to="/signup" className="underline underline-offset-4 pl-1">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={image}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <Link to="/terms-and-conditions">Terms of Service</Link>{" "}
        and <Link to="/terms-and-conditions">Privacy Policy</Link>.
      </div>
    </div>
  )
}
export default LoginForm;