import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome to ChatX</CardTitle>
        <CardDescription className="text-lg mt-2">
          Let's get you set up in just a few steps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        <div className="flex justify-center mb-6">
          <div className="h-40 w-40 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">
            Personalized Chat Experience
          </h3>
          <p className="text-muted-foreground">
            ChatX is a powerful AI chat application designed to help you get
            answers, solve problems, and explore new ideas.
          </p>
          <div className="grid gap-3 py-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium">Complete your profile</p>
                <p className="text-sm text-muted-foreground">
                  Personalize your account with your name and profile picture
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium">Choose a subscription plan</p>
                <p className="text-sm text-muted-foreground">
                  Select the right plan for your needs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium">Start chatting</p>
                <p className="text-sm text-muted-foreground">
                  Get started with your personalized chat experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 pt-4 border-t flex justify-end">
        <Button onClick={onNext} size="lg" className="cursor-pointer">
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};
