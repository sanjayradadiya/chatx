import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useChatContext } from "@/context/chat-context";
import { MessagesSquare, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ChatList() {
  const { chatSessions, fetchChatSessions, createNewChat, isNewChatSession, deleteChatSession, hasEmptySessions } =
    useChatContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchChatSessions();
  }, [fetchChatSessions]);

  const handleNewChat = async () => {
    const newSession = await createNewChat();
    if (newSession) {
      navigate(`/chat/${newSession.id}`);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    
    try {
      const success = await deleteChatSession(chatToDelete);
      if (success) {
        if (chatToDelete === id) {
          navigate('/dashboard');
        }
        toast.success("Chat deleted successfully", {
          position: "top-center",
        });
      } else {
        toast.error("Failed to delete chat", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("An error occurred while deleting the chat", {
        position: "top-center",
      });
    } finally {
      setChatToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Chats
        </h2>
        <div className="space-y-1">
          <Button
            variant="outline"
            className="w-full justify-start cursor-pointer"
            onClick={handleNewChat}
            disabled={isNewChatSession || hasEmptySessions}
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
              <div 
                key={chat.id} 
                className="relative group flex items-center"
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <Button
                  variant={chat.id === id ? "secondary" : "ghost"}
                  asChild
                  className="w-full justify-start"
                >
                  <Link to={`/chat/${chat.id}`}>
                    <MessagesSquare className="mr-1 h-4 w-4" />
                    {chat.title.length > 20 ? `${chat.title.substring(0, 18)}...` : chat.title}
                  </Link>
                </Button>
                
                {hoveredChatId === chat.id && (
                  <div 
                    className="absolute right-0.5 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <AlertDialog open={chatToDelete === chat.id} onOpenChange={(open) => !open && setChatToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          aria-label="Delete chat"
                          onClick={() => setChatToDelete(chat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete chat</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this chat? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteChat} className="bg-red-300 text-destructive-foreground hover:bg-red-300/90 cursor-pointer">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}