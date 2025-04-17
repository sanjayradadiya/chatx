import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthProvider } from "@/context/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import supabaseClient from "@/services/supabase/client";
import { toast } from "sonner";

export default function AccountPage() {
  const { session } = useAuthProvider();
  const user = session?.user;
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState<string>(
    user?.user_metadata?.fullname || ""
  );
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsUpdating(true);
      const { error } = await supabaseClient.auth.updateUser({
        data: {
          fullname: fullName,
        },
      });
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error updating profile";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (!user) return null;
  
  const getInitials = () => {
    const name = user.user_metadata?.fullname || "";
    return name.charAt(0) + (name.split(" ")[1]?.charAt(0) || "");
  };
  
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{user.user_metadata?.fullname || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email}
                  disabled
                  readOnly
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed.
                </p>
              </div>
              
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Information about your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Account Created</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">Last Sign In</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 