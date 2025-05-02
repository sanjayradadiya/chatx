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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/module/profile/hooks/useProfile";
import { Camera, Loader2, CreditCard, Calendar, Clock, Info } from "lucide-react";
import { useSubscription } from "../subscription/hooks/useSubscription";
import { SubscriptionData } from "@/config/types";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

export default function Profile() {
  const { subscription, handleUpdatePlan } =
    useSubscription();
  const {
    getInitials,
    triggerFileInput,
    handleImageUpload,
    handleUpdateProfile,
    setFullName,
    isUploading,
    userProfile,
    fullName,
    isUpdating,
    fileInputRef,
    expirationDate,
    currentPlanDetails,
  } = useProfile(subscription as SubscriptionData);

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
                    alt={userProfile.full_name || "User"}
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
                  {userProfile.full_name || "User"}
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
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {subscription?.planName.replace("_", " ") || "Free"}
                    </p>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Info className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                      <div className="p-4 border-b">
                        <h4 className="text-sm font-medium">{currentPlanDetails.name} Plan Details</h4>
                        <p className="text-xs text-muted-foreground mt-1">{currentPlanDetails.description}</p>
                      </div>
                      <div className="p-4">
                        <h5 className="text-xs font-medium mb-2">Features:</h5>
                        <ul className="text-xs space-y-1.5">
                          {currentPlanDetails.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-4 w-4 flex items-center justify-center mt-0.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                              </div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {currentPlanDetails.price > 0 && (
                        <div className="p-4 border-t bg-muted/50">
                          <p className="text-xs">
                            <span className="font-medium">Price:</span> ${currentPlanDetails.price}/month
                          </p>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {subscription && subscription.createdAt
                        ? new Date(subscription.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 flex items-center justify-center">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        subscription && subscription.active
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {subscription && subscription.active
                        ? "Active"
                        : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {expirationDate || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {
                <div className="md:col-span-2 pt-4 border-t">
                  <Button onClick={handleUpdatePlan} className="cursor-pointer">
                    Manage Subscription
                  </Button>
                </div>
              }
            </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
