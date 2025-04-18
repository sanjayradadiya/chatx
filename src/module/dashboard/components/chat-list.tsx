import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useChatContext } from "@/context/chat-context";
import { MessagesSquare, Plus } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

export function ChatList() {
  const { chatSessions, fetchChatSessions, createNewChat, isNewChatSession } = useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatSessions();
  }, [fetchChatSessions]);

  const handleNewChat = async () => {
    const newSession = await createNewChat();
    if (newSession) {
      navigate(`/chat/${newSession.id}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Chats</h2>
        <div className="space-y-1">
          <Button 
            variant="outline"
            className="w-full justify-start cursor-pointer"
            onClick={handleNewChat}
            disabled={isNewChatSession}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto py-2">
        <div className="space-y-1 px-3">
          {chatSessions.length === 0 && !isNewChatSession ? (
            <p className="text-sm text-muted-foreground px-4 py-2">
              No chat history yet. Start a new chat!
            </p>
          ) : (
            chatSessions.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                asChild
                className="w-full justify-start"
              >
                <Link to={`/chat/${chat.id}`}>
                  <MessagesSquare className="mr-2 h-4 w-4" />
                  {chat.title}
                </Link>
              </Button>
            ))
          )}
          {isNewChatSession && (
            <div className="flex justify-center py-4">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <div className="h-2 w-2 bg-primary rounded-full" />
                <div className="h-2 w-2 bg-primary rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 