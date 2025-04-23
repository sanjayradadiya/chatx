import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthProvider } from "@/context/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import { useProfileImage } from "@/module/profile/hooks/useProfileImage";
import { Camera, Loader2 } from "lucide-react";
import { useSubscription } from "../subscription/hooks/useSubscription";

export default function Profile() {
  const { currentUser } = useAuthProvider();
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState<string>(
    currentUser?.user_metadata?.fullname || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProfileImage, isUploading, updateProfile } = useProfileImage();
  const { subscription, handleRemovePlan } = useSubscription();

  const expirationDate = useMemo(() => {
    if (subscription?.updatedAt) {
      return new Date(
        new Date(subscription.updatedAt).setMonth(
          new Date(subscription.updatedAt).getMonth() + 1
        )
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "N/A";
  }, [subscription?.updatedAt]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUpdating(true);
      const { error } = await updateProfile({ fullname: fullName });
      if (error) throw error;
      toast.success("Profile updated successfully", {
        position: "top-center",
      });
    } catch (error: unknown) {
      const errorMessage =
      error instanceof Error ? error.message : "Error updating profile";
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { error, url } = await uploadProfileImage(file);

    if (error) {
      toast.error(error, {
        position: "top-center",
      });
      return;
    }

    if (url) {
      toast.success("Profile image updated successfully", {
        position: "top-center",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    const name = currentUser?.user_metadata?.fullname || "";
    return name.charAt(0) + (name.split(" ")[1]?.charAt(0) || "");
  };

  const userProfile = useMemo(() => {
    return {
      avatarUrl: currentUser?.user_metadata?.avatar_url,
      fullname: currentUser?.user_metadata?.fullname,
      email: currentUser?.email,
      createdAt: currentUser?.created_at || "",
      lastSignInAt: currentUser?.last_sign_in_at || "",
    };
  }, [currentUser]);

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group">
                <Avatar className="h-20 w-20 ring-2 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-primary">
                  <AvatarImage
                    src={userProfile.avatarUrl}
                    alt={userProfile.fullname || "User"}
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full p-1 h-7 w-7 cursor-pointer"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  aria-label="Update profile image"
                  title="Update profile image"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera />
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  aria-label="Upload profile image"
                  title="Upload profile image"
                  id="profile-image-upload"
                />
                <Label htmlFor="profile-image-upload" className="sr-only">
                  Upload profile image
                </Label>
              </div>
              <div>
                <h3 className="font-medium">
                  {userProfile.fullname || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userProfile.email}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isUploading
                    ? "Uploading image..."
                    : "Click the edit button to update your profile image."}
                </p>
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
                <Input id="email" value={userProfile.email} disabled readOnly />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed.
                </p>
              </div>

              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Information about your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Profile Created</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(userProfile.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Last Sign In</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(
                      userProfile.lastSignInAt || userProfile.createdAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex-none space-y-4">
                <div className="text-sm font-medium">Subscription Plan</div>
                <p className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {subscription?.planName.replace("_", " ") || "Free"}
                </p>
                {subscription?.planName !== "FREE" && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Expires at: {expirationDate}
                    </p>
                    <Button variant="destructive" onClick={handleRemovePlan}>
                      Remove Plan
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
