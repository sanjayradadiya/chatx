import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Plus } from "lucide-react";
import { useChatContext } from "@/context/chat-context";
import { useNavigate } from "react-router";

export function WelcomeScreen() {
  const { createNewChat, hasEmptySessions } = useChatContext();
  const navigate = useNavigate();

  const handleNewChat = async () => {
    const newSession = await createNewChat();
    if (newSession) {
      navigate(`/chat/${newSession.id}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl flex items-center justify-center gap-2">
            <Bot className="h-8 w-8" />
            Welcome to ChatX
          </CardTitle>
          <CardDescription className="text-lg">
            Your personal AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                How it works
              </h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    ChatX is a simple AI chat application that uses a collection of pre-defined responses.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Send any message to start a conversation</li>
                    <li>The AI will respond with a relevant message based on your question.</li>
                    <li>Create multiple chat sessions to organize your conversations</li>
                    <li>All messages are stored in your personal history</li>
                  </ul>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-2">Example AI Message</p>
                      <p className="text-sm text-muted-foreground">
                        That's an interesting question. Could you provide more context so I can help you better?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleNewChat} className="w-full gap-2" disabled={hasEmptySessions}>
            <Plus className="h-4 w-4" />
            Start a New Chat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 