import { useState, useRef, useMemo, useEffect } from "react";
import { useParams } from "react-router";
import { useChatContext } from "@/context/chat-context";
import { MessageType, ChatMessage } from "@/config/types";
import { toast } from "sonner";
import { aiService } from "@/services/ai-service";
import { useForm } from "react-hook-form";
import { useAuthProvider } from "@/context/auth-provider";
import { MarkdownRenderer } from "@/module/chatWindow/components/markdown-renderer";

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
    userSubscription,
    userQuestionCount,
    hasReachedLimit,
    questionLimit,
    incrementQuestionCount
  } = useChatContext();

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
    if (id && currentSession && (id !== currentSession?.id)) {
      selectChatSession(id);
      // Reset the first message sent flag when changing chats
      firstMessageSentRef.current = false;
    }
  }, [id, selectChatSession, currentSession]);

  // Function to generate a chat title based on the first user message
  const generateChatTitle = async (userMessage: string) => {
    if (!id || firstMessageSentRef.current) return;
    
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
    
    // Reset the form
    reset({ message: "" });
    
    try {
      setIsSending(true);
      
      if (selectedFile) {
        await sendImageMessage(selectedFile, data.message);
        setSelectedFile(null);
        setImagePreview(null);
        
        // If this is a first message in a new chat, generate title
        if (!firstMessageSentRef.current && id && currentSession?.is_default_title) {
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
        if (!firstMessageSentRef.current && id && currentSession?.is_default_title) {
         await generateChatTitle(data.message);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
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
      return <MarkdownRenderer>{msg.text}</MarkdownRenderer>;
    }
  };

  const userProfile = useMemo(() => {
    return {
      avatarUrl: currentUser?.user_metadata.avatar_url,
      full_name: currentUser?.user_metadata.full_name,
      email: currentUser?.email,
    };
  }, [currentUser]);

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
    userSubscription,
    userQuestionCount,
    hasReachedLimit,
    questionLimit,
    renderMessage,
    handleSubmit,
    onSubmit,
    register,
    handleFileChange,
    handleFileButtonClick,
    clearSelectedFile
  };
}; 