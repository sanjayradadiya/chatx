import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import { useProfile } from "@/module/profile/hooks/useProfile";
import { useEffect } from "react";
import { SubscriptionData } from "@/config/types";
import { colorSamples, colorSchemes } from "@/lib/themes";

interface ProfileStepProps {
  onNext: (data: ProfileData) => void;
  onBack: () => void;
  initialData: ProfileData;
}

interface ProfileData {
  fullName: string;
  avatarUrl: string;
}

export const ProfileStep = ({ onNext, onBack, initialData }: ProfileStepProps) => {
  // Use the existing profile hook with an empty subscription (not needed for onboarding)
  const { 
    userProfile, 
    isUploading, 
    fileInputRef, 
    getInitials, 
    triggerFileInput, 
    handleImageUpload,
    fullName,
    setFullName
  } = useProfile({} as SubscriptionData);

  // Get theme context
  const { theme, setTheme, setColorScheme } = useTheme();
  
  // Initialize with initialData when component mounts
  useEffect(() => {
    if (initialData.fullName && !fullName) {
      setFullName(initialData.fullName);
    }
  }, [initialData, fullName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      fullName,
      avatarUrl: userProfile.avatarUrl || '',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Setup</CardTitle>
        <CardDescription>
          Complete your profile and customize your experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group mb-4">
              <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-primary">
                <AvatarImage src={userProfile.avatarUrl || ''} alt={fullName || "User"} />
                <AvatarFallback className="text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full p-1 h-8 w-8 cursor-pointer"
                onClick={triggerFileInput}
                disabled={isUploading}
                aria-label="Update profile image"
                title="Update profile image"
                type="button"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
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
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Click the edit button to upload a profile picture"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label>Theme Preference</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  type="button"
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  type="button"
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  type="button"
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>

            <div>
              <Label>Color Theme</Label>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {colorSchemes.map((color) => (
                  <Button 
                    key={color}
                    variant="outline" 
                    type="button"
                    onClick={() => setColorScheme(color)} 
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <div className={`h-4 w-4 rounded-full ${colorSamples[color]}`}></div>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={onBack} type="button" className="cursor-pointer">
          Back
        </Button>
        <Button onClick={handleSubmit} type="submit" className="cursor-pointer">
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}; 