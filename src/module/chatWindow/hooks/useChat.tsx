import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { useChatContext } from "@/context/chat-context";
import { MessageType, ChatMessage } from "@/config/types";
import { toast } from "sonner";
import { aiService } from "@/services/ai-service";
import { useForm } from "react-hook-form";
import { useAuthProvider } from "@/context/auth-provider";
import { MarkdownRenderer } from "@/module/chatWindow/components/markdown-renderer";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatFormValues {
  message: string;
}

export const useChat = () => {
  const { id } = useParams();
  const { 
    messages, 
    sendMessage, 
    sendImageMessage, 
    selectChatSession, 
    loading,  
    updateChatTitle,
    streamingMessage,
    isStreaming,
    currentSession,
    userQuestionCount,
    hasReachedLimit,
    questionLimit,
    incrementQuestionCount,
    stopResponseStreaming,
    contentRef
  } = useChatContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuthProvider();
  const { state: sidebarState } = useSidebar();
  const isMobile = useIsMobile()
  
  const { 
    register, 
    handleSubmit,
    watch, 
    reset,
    formState: { isSubmitting }
  } = useForm<ChatFormValues>({
    defaultValues: {
      message: ""
    }
  });
  
  const messageValue = watch("message");
  
  const isSidebarExpanded = useMemo(() => {
    return !isMobile && sidebarState === "expanded";
  }, [sidebarState, isMobile]);

  const userProfile = useMemo(() => {
    return {
      avatarUrl: currentUser?.user_metadata.avatar_url,
      full_name: currentUser?.user_metadata.full_name,
      email: currentUser?.email,
    };
  }, [currentUser]);

  useEffect(() => {
    if (id && (id !== currentSession?.id)) {
      selectChatSession(id);
    }
  }, [id, selectChatSession, currentSession]);

  // Function to generate a chat title based on the first user message
  const generateChatTitle = useCallback(async (userMessage: string) => {
    if (!id) return;
    
    try {
      // Generate the title using the AI service
      const title = await aiService.generateChatTitle(userMessage);
      
      // Update the chat title
      if (title && id) {
        await updateChatTitle(id, title);
      }
    } catch (error) {
      console.error("Error generating chat title:", error);
      // If title generation fails, we'll keep the default title
    }
  }, [id, updateChatTitle]);

  const onSubmit = useCallback(async (data: ChatFormValues) => {
    if (isSending || loading || isSubmitting) return;
    
    // Check if there's content to send (file or non-empty message)
    if (!selectedFile && !data.message.trim()) return;
    
    // Reset the form
    reset({ message: "" });
    
    try {
      setIsSending(true);
      
      if (selectedFile) {
        await sendImageMessage(selectedFile, data.message);
        setSelectedFile(null);
        setImagePreview(null);
        
        // If this is a first message in a new chat, generate title
        if (id && currentSession?.is_default_title) {
         await generateChatTitle(data.message || "Image shared");
        }

        // Increment the question count after successfully sending an image message
        if (currentSession?.id) {
          incrementQuestionCount(currentSession.id);
        }
      } else if (data.message.trim()) {
        // Check if the message is only emojis
        const emojiRegex = /^(\p{Emoji}|\s)+$/u;
        const messageType: MessageType = emojiRegex.test(data.message) ? 'emoji' : 'text';
        await sendMessage(data.message, messageType);
        
        // Increment the question count after successfully sending a text message
        if (currentSession?.id) {
          incrementQuestionCount(currentSession.id);
        }
        // If this is a first message in a new chat, generate title
        if (id && currentSession?.is_default_title) {
         await generateChatTitle(data.message);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [isSending, loading, isSubmitting, selectedFile, reset, sendImageMessage, sendMessage, incrementQuestionCount, id, currentSession, generateChatTitle]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Function to render messages based on their type
  const renderMessage = useCallback((msg: ChatMessage) => {
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
      return <MarkdownRenderer>{msg.text}</MarkdownRenderer>;
    }
  }, []);

  return {
    messages,
    sendMessage,
    loading,
    isStreaming,
    streamingMessage,
    selectedFile,
    imagePreview,
    isSending,
    isSubmitting,
    messageValue,
    scrollAreaRef,
    fileInputRef,
    userProfile,
    userQuestionCount,
    hasReachedLimit,
    questionLimit,
    isSidebarExpanded,
    renderMessage,
    handleSubmit,
    onSubmit,
    register,
    handleFileChange,
    handleFileButtonClick,
    clearSelectedFile,
    stopResponseStreaming,
    contentRef
  };
}; 