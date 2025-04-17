import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useChatContext } from "@/context/chat-context";
import { Bot } from "lucide-react";
import { TypingIndicator } from "./components/typing-indicator";

const ChatWindow = () => {
  const { id } = useParams();
  const { messages, sendMessage, selectChatSession, loading } = useChatContext();
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      selectChatSession(id);
    }
  }, [id, selectChatSession]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-auto p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">How can I help you today?</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                  Send a message to start chatting with the AI assistant. Try asking a question or sharing something interesting!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  !msg.is_ai ? "justify-end" : "justify-start"
                }`}
              >
                {msg.is_ai && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-[75%] ${
                    !msg.is_ai
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.text}
                </div>
                {!msg.is_ai && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>Me</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-start gap-2 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-2">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message input */}
      <div className="border-t p-4">
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
