import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router";
import { useChatContext } from "@/context/chat-context";
import { Bot, Smile, X, Paperclip, Send } from "lucide-react";
import { TypingIndicator } from "./components/typing-indicator";
import { MessageType, ChatMessage } from "@/config/types";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/module/chatWindow/components/markdown-renderer";
import { aiService } from "@/services/ai-service";
import { useAuthProvider } from "@/context/auth-provider";
import { useForm } from "react-hook-form";

interface ChatFormValues {
  message: string;
}

const ChatWindow = () => {
  const { id } = useParams();
  const { 
    messages, 
    sendMessage, 
    sendImageMessage, 
    selectChatSession, 
    loading, 
    isNewChatSession, 
    updateChatTitle,
    streamingMessage,
    isStreaming 
  } = useChatContext();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstMessageSentRef = useRef<boolean>(false);
  const { currentUser } = useAuthProvider();
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset,
    formState: { isSubmitting }
  } = useForm<ChatFormValues>({
    defaultValues: {
      message: ""
    }
  });
  
  const messageValue = watch("message");
  
  useEffect(() => {
    if (id) {
      selectChatSession(id);
      // Reset the first message sent flag when changing chats
      firstMessageSentRef.current = false;
    }
  }, [id, selectChatSession]);

  // Scroll to bottom when messages change or streaming happens
  useEffect(() => {
      if (scrollAreaRef.current) {
       scrollAreaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
       });
      }
  }, [messages, id, streamingMessage]); // Added streaming dependencies

  // Function to generate a chat title based on the first user message
  const generateChatTitle = async (userMessage: string) => {
    if (!id || !isNewChatSession || firstMessageSentRef.current) return;
    
    try {
      // Generate the title using the AI service
      const title = await aiService.generateChatTitle(userMessage);
      
      // Update the chat title
      if (title && id) {
        await updateChatTitle(id, title);
      }
      
      // Mark that we've already generated a title for this chat
      firstMessageSentRef.current = true;
    } catch (error) {
      console.error("Error generating chat title:", error);
      // If title generation fails, we'll keep the default title
    }
  };

  const onSubmit = async (data: ChatFormValues) => {
    if (isSending || loading || isSubmitting) return;
    
    // Check if there's content to send (file or non-empty message)
    if (!selectedFile && !data.message.trim()) return;
    
    try {
      setIsSending(true);
      
      if (selectedFile) {
        await sendImageMessage(selectedFile, data.message);
        setSelectedFile(null);
        setImagePreview(null);
        
        // If this is a first message in a new chat, generate title
        if (isNewChatSession && !firstMessageSentRef.current && id) {
         await generateChatTitle(data.message || "Image shared");
        }
      } else if (data.message.trim()) {
        // Check if the message is only emojis
        const emojiRegex = /^(\p{Emoji}|\s)+$/u;
        const messageType: MessageType = emojiRegex.test(data.message) ? 'emoji' : 'text';
        
        // If this is a first message in a new chat, generate title
        if (isNewChatSession && !firstMessageSentRef.current && id) {
         await generateChatTitle(data.message);
        }

        await sendMessage(data.message, messageType);
      }
      
      // Reset the form
      reset({ message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setValue("message", (messageValue || "") + emojiData.emoji, { shouldValidate: true });
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
        toast.error('Please select an image file', {
          position: "top-center",
        });
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
  const renderMessage = (msg: ChatMessage) => {
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

  const userProfile = useMemo(() => {
    return {
      avatarUrl: currentUser?.user_metadata.avatar_url,
      full_name: currentUser?.user_metadata.full_name,
      email: currentUser?.email,
    };
  }, [currentUser]);

  return (
    <div className="flex flex-col h-full" ref={scrollAreaRef} >
      {/* Chat messages */}
      <div className="flex-1 overflow-auto p-4" >
        <div className="flex flex-col gap-4">
          {messages.length === 0 && !isStreaming ? (
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
            <>
              {/* Display all existing messages */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    !msg.is_ai ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.is_ai && (
                    <Avatar className="h-9 w-9">
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
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={userProfile.avatarUrl}
                        alt={userProfile.full_name || "User"}
                      />
                      <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {/* Display streaming message */}
              {isStreaming && streamingMessage !== null && (
                <div className="flex items-start gap-2 justify-start">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback><Bot/></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 text-sm max-w-[75%] bg-muted">
                    <MarkdownRenderer>{streamingMessage}</MarkdownRenderer>
                  </div>
                </div>
              )}
            </>
          )}
          
          {loading && !isStreaming && (
            <div className="flex items-start gap-2 justify-start">
              <Avatar className="h-9 w-9">
                <AvatarFallback><Bot/></AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-3 py-2 text-sm bg-muted">
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
        <form className="flex items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
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
            disabled={loading || isSending || isSubmitting || !!selectedFile}
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
                disabled={loading || isSending || isSubmitting}
                aria-label="Add emoji"
                title="Add emoji"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 not-first:" align="start" onFocusOutside={() => setIsEmojiPickerOpen(false)}>
              <EmojiPicker open={isEmojiPickerOpen} lazyLoadEmojis={true} onEmojiClick={handleEmojiClick} />
            </PopoverContent>
          </Popover>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              disabled={loading || isSending || isSubmitting}
              className="pr-10"
              aria-label="Message input"
              {...register("message")}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || isSending || isSubmitting || (!messageValue?.trim() && !selectedFile)}
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
