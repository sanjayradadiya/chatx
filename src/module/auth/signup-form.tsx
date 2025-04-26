import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuth from "./hooks/useAuth"
import { SignUpFormInput } from "@/config/types"
import { useForm } from "react-hook-form"
import image from '../../assets/Image.jpeg';
import { Link } from "react-router"
import AuthOptions from "./components/auth-options"
import { Eye, EyeOff } from "lucide-react"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<SignUpFormInput>();
  const { signUpNewUser, signInWithAuthProvider, setShowPassword, showPassword, loading } = useAuth(reset);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(signUpNewUser)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Sign Up</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Chat User"
                  required
                  {...register("full_name")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    required 
                    {...register("password")} 
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full cursor-pointer" loading={loading} disabled={loading}>
                SignUp
              </Button>
              <AuthOptions signInWithAuthProvider={signInWithAuthProvider} />
              <div className="text-center text-sm">
                Already have an account? 
                <Link to="/" className="underline underline-offset-4 pl-1">
                  Login
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
