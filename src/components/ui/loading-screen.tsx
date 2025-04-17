import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Please wait while we prepare your experience" }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="space-y-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <h2 className="text-lg font-medium text-foreground">Loading...</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
} 