import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_CONFIG } from "@/config/config";
import { cn } from "@/lib/utils";
import supabaseClient from "@/services/supabase/client";
import React, { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${APP_CONFIG.CDN_URL}/reset-password`,
      });

      if (error) {
        toast.error(error.message, {
          position: "top-center",
        });
      } else {
        setSubmitted(true);
        toast.success("Check your email for the password reset link!", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6")}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-1">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Check Your Email</h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    We've sent a password reset link to <strong>{email}</strong>
                    . Please check your inbox and follow the instructions.
                  </p>
                </div>
                <div className="text-center text-sm">
                  Back to{" "}
                  <Link to="/" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email address below and we'll send you a link to
                  reset your password.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center text-sm">
                Back to{" "}
                <Link to="/" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
