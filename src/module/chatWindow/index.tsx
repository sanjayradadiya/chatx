import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useChatContext } from "@/context/chat-context";
import { Bot, Smile, X, Paperclip, Send } from "lucide-react";
import { TypingIndicator } from "./components/typing-indicator";
import { MessageType } from "@/config/types";
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/module/chatWindow/components/markdown-renderer";

const ChatWindow = () => {
  const { id } = useParams();
  const { messages, sendMessage, sendImageMessage, selectChatSession, loading } = useChatContext();
  const [input, setInput] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      selectChatSession(id);
    }
  }, [id, selectChatSession]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    scrollToBottom();
  }, [messages, loading, scrollAreaRef]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFile) {
      await sendImageMessage(selectedFile, input);
      setSelectedFile(null);
      setImagePreview(null);
    } else if (input.trim()) {
      // Check if the message is only emojis
      const emojiRegex = /^(\p{Emoji}|\s)+$/u;
      const messageType: MessageType = emojiRegex.test(input) ? 'emoji' : 'text';
      
      await sendMessage(input, messageType);
    }
    
    setInput("");
  };

  const handleEmojiClick = (emojiData: any) => {
    setInput(prev => prev + emojiData.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to render messages based on their type
  const renderMessage = (msg: any) => {
    if (msg.message_type === 'image' && msg.file_url) {
      return (
        <div className="flex flex-col gap-2">
          <img 
            src={msg.file_url} 
            alt="User uploaded" 
            className="max-w-full max-h-60 object-contain rounded-md"
          />
          {msg.text && <p>{msg.text}</p>}
        </div>
      );
    } else if (msg.message_type === 'emoji') {
      return <p className="text-2xl">{msg.text}</p>;
    } else {
      return <MarkdownRenderer>{msg.text}</MarkdownRenderer> 
    }
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
                    
                    <AvatarFallback><Bot/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-[75%] ${
                    !msg.is_ai
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {renderMessage(msg)}
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
        {imagePreview && (
          <div className="mb-3 relative">
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-24 rounded-md object-cover border border-input"
              />
              <button 
                onClick={clearSelectedFile}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1 rounded-full"
                aria-label="Remove image"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            id="image-upload"
            aria-label="Upload image"
          />
          
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={handleFileButtonClick}
            disabled={loading || !!selectedFile}
            aria-label="Upload image"
            title="Upload image"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={loading}
                aria-label="Add emoji"
                title="Add emoji"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 " align="start" onFocusOutside={() => setIsEmojiPickerOpen(false)}>
              <EmojiPicker open={isEmojiPickerOpen} lazyLoadEmojis={true} onEmojiClick={handleEmojiClick} />
            </PopoverContent>
          </Popover>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="pr-10"
              aria-label="Message input"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || (!input.trim() && !selectedFile)}
            size="icon"
            aria-label="Send message"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
