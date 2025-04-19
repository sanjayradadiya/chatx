import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useChatContext } from "@/context/chat-context";
import { Bot, Smile, X, Paperclip, Send } from "lucide-react";
import { TypingIndicator } from "./components/typing-indicator";
import { MessageType, ChatMessage } from "@/config/types";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/module/chatWindow/components/markdown-renderer";
import { GoogleGenAI } from "@google/genai";
import { APP_CONFIG } from "@/config/config";

const ChatWindow = () => {
  const { id } = useParams();
  const { messages, sendMessage, sendImageMessage, selectChatSession, loading, isNewChatSession, updateChatTitle } = useChatContext();
  const [input, setInput] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstMessageSentRef = useRef<boolean>(false);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    if (id) {
      selectChatSession(id);
      // Reset the first message sent flag when changing chats
      firstMessageSentRef.current = false;
    }
  }, [id, selectChatSession]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current && shouldScrollRef.current) {
        const scrollArea = scrollAreaRef.current;
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    };

    // Immediate scroll
    scrollToBottom();
    
    // Add a small delay to ensure content is fully rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    // Add a mutation observer to detect height changes
    if (scrollAreaRef.current) {
      const observer = new MutationObserver(scrollToBottom);
      
      observer.observe(scrollAreaRef.current, { 
        childList: true, 
        subtree: true,
        characterData: true,
        attributes: true
      });
      
      return () => {
        observer.disconnect();
        clearTimeout(timeoutId);
      };
    }
    
    return () => clearTimeout(timeoutId);
  }, [messages, loading, id]); // Added 'id' dependency to handle chat switching

  // Function to generate a chat title based on the first user message
  const generateChatTitle = async (userMessage: string) => {
    if (!id || !isNewChatSession || firstMessageSentRef.current) return;
    
    try {
      // Initialize the Gemini API
      const genAI = new GoogleGenAI({ apiKey: APP_CONFIG.GEMINI_API_KEY });
      
      // Create a prompt to generate a short title
      const prompt = `Generate a very short, concise title (3-5 words max) for a chat that starts with this message: "${userMessage}". 
      The title should capture the essence of what the conversation might be about. 
      Return ONLY the title text without quotes or any other text.`;
      
      // Generate the title using the model
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });
      
      const title = response.text || "";
      
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure we should scroll to bottom after sending a message
    shouldScrollRef.current = true;
    
    if (selectedFile) {
      await sendImageMessage(selectedFile, input);
      setSelectedFile(null);
      setImagePreview(null);
      
      // If this is a first message in a new chat, generate title
      if (isNewChatSession && !firstMessageSentRef.current && id) {
       await generateChatTitle(input || "Image shared");
      }
    } else if (input.trim()) {
      // Check if the message is only emojis
      const emojiRegex = /^(\p{Emoji}|\s)+$/u;
      const messageType: MessageType = emojiRegex.test(input) ? 'emoji' : 'text';
      
      // If this is a first message in a new chat, generate title
      if (isNewChatSession && !firstMessageSentRef.current && id) {
       await generateChatTitle(input);
      }

      await sendMessage(input, messageType);
    }
    
    setInput("");
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
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

  // Handle scroll events to determine whether to auto-scroll
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      // If we're within 100px of the bottom, enable auto-scrolling
      shouldScrollRef.current = scrollHeight - scrollTop - clientHeight < 100;
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

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div 
        className="flex-1 overflow-auto p-4" 
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
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
            <PopoverContent className="w-full p-0 not-first:" align="start" onFocusOutside={() => setIsEmojiPickerOpen(false)}>
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
