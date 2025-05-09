import { ChatMessage, ChatSession, MessageType } from "@/config/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { chatService } from "@/services/chat-service";
import { useAuthProvider } from "./auth-provider";
import { aiService } from "@/services/ai-service";
import { hasReachedQuestionLimit, getQuestionLimit } from "@/lib/subscription-utils";
import { useSubscription } from "@/module/subscription/hooks/useSubscription";
import usePrintPDF from "../hooks/use-print-pdf";
import { SUBSCRIPTION_PLAN } from "@/config/enum";

interface ChatContextType {
  chatSessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  loading: boolean;
  isInitializing: boolean;
  isNewChatSession: boolean;
  streamingMessage: string | null;
  isStreaming: boolean;
  userQuestionCount: number;
  hasReachedLimit: boolean;
  questionLimit: number;
  fetchChatSessions: () => Promise<void>;
  createNewChat: () => Promise<ChatSession | null>;
  selectChatSession: (sessionId: string) => Promise<void>;
  sendMessage: (text: string, messageType?: MessageType) => Promise<void>;
  sendImageMessage: (file: File, caption?: string) => Promise<void>;
  updateChatTitle: (sessionId: string, title: string) => Promise<void>;
  deleteChatSession: (sessionId: string) => Promise<boolean>;
  incrementQuestionCount: (sessionId: string) => Promise<void>;
  stopResponseStreaming: () => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  handlePrint: () => void;
}

const ChatContext = createContext<ChatContextType>({
  chatSessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  isInitializing: true,
  isNewChatSession: false,
  streamingMessage: null,
  isStreaming: false,
  userQuestionCount: 0,
  hasReachedLimit: true,
  questionLimit: 0,
  fetchChatSessions: async () => {},
  createNewChat: async () => null,
  selectChatSession: async () => {},
  sendMessage: async () => {},
  sendImageMessage: async () => {},
  updateChatTitle: async () => {},
  deleteChatSession: async () => false,
  incrementQuestionCount: async () => {},
  stopResponseStreaming: () => {},
  contentRef: { current: null },
  handlePrint: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNewChatSession, setIsNewChatSession] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [userQuestionCount, setUserQuestionCount] = useState<number>(0);
  const { session } = useAuthProvider();
  const { subscription } = useSubscription();
  const abortControllerRef = useRef<AbortController | null>(null);
  const { contentRef, handlePrint } = usePrintPDF();

  // Calculate if user has reached their question limit
  const hasReachedLimit = useMemo(() => {
    return subscription 
      ? hasReachedQuestionLimit(subscription.planName || SUBSCRIPTION_PLAN.FREE, userQuestionCount)
      : true;
  },[subscription, userQuestionCount]);
    
  // Get the question limit for the user's plan
  const questionLimit = useMemo(() => {
    return subscription 
      ? getQuestionLimit(subscription.planName)
      : getQuestionLimit(undefined);
  },[subscription]);

  // Automatically load sessions when authenticated
  useEffect(() => {
    if (session?.user.id) {
      const initializeChats = async () => {
        try {
          const sessions = await chatService.getChatSessions(session.user.id);
          setChatSessions(sessions);
        } catch (error) {
          console.error("Failed to initialize chat sessions:", error);
        } finally {
          setIsInitializing(false);
        }
      };

      initializeChats();
    } else {
      setIsInitializing(false);
    }
  }, [session?.user.id]);

  const fetchChatSessions = useCallback(async () => {
    if (!session?.user.id) return;

    setLoading(true);
    try {
      const sessions = await chatService.getChatSessions(session.user.id);
      setChatSessions(sessions);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const createNewChat = useCallback(async (): Promise<ChatSession | null> => {
    if (!session?.user.id) return null;

    setLoading(true);
    setIsNewChatSession(true); // Set to true only during creation

    try {
      const newSession = await chatService.createChatSession(session.user.id);

      if (newSession) {
        setChatSessions((prev) => [newSession, ...prev]);
        setCurrentSession(newSession);
        setUserQuestionCount(newSession.questions_count || 0);
        setMessages([]);
        setIsNewChatSession(false);
      }

      return newSession;
    } catch (error) {
      console.error("Error creating new chat:", error);
      setIsNewChatSession(false); // Reset if there's an error
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const selectChatSession = useCallback(
    async (sessionId: string) => {
      if (!session?.user.id || !chatSessions.length) return;

      setLoading(true);

      try {
        // Find session in the current list
        const selectedSession = chatSessions.find((s) => s.id === sessionId);

        if (selectedSession) {
          setCurrentSession(selectedSession);
          setUserQuestionCount(selectedSession.questions_count || 0);
          // Fetch messages for this session
          const sessionMessages = await chatService.getChatMessages(sessionId);
          setMessages(sessionMessages);
        } else {
          console.error("Session not found:", sessionId);
        }
      } catch (error) {
        console.error("Error selecting chat session:", error);
      } finally {
        setLoading(false);
      }
    },
    [chatSessions, session]
  );

  const sendMessage = useCallback(
    async (text: string, messageType: MessageType = "text") => {
      if (!session?.user.id || !currentSession) return;
      setIsNewChatSession(false); // when message send first time
      setLoading(true);
      
      // Send user message
      const userMessage = await chatService.sendUserMessage(
        currentSession.id,
        session.user.id,
        text,
        messageType
      );

      if (userMessage) {
        setMessages((prev) => [...prev, userMessage]);
        setIsStreaming(true);
        setLoading(false);
        setStreamingMessage("");
        
        try {
          // Create a new AbortController for this streaming request
          abortControllerRef.current = new AbortController();
          
          // Generate a streaming response using AI service
          const stream = await aiService.generateContentStream(text, undefined, abortControllerRef.current.signal);
          let fullResponse = "";

          // Process each chunk as it arrives
          for await (const chunk of stream) {
            // Check if the request has been aborted
            if (abortControllerRef.current?.signal.aborted) {
              break;
            }
            
            if (chunk && chunk.text) {
              const chunkText = chunk.text;
              fullResponse += chunkText;
              setStreamingMessage(fullResponse);
            }
          }

          // Save the complete response to database
          const aiMessage = await chatService.sendAIMessage(
            currentSession.id,
            session.user.id,
            fullResponse
          );

          if (aiMessage) {
            setMessages((prev) => [...prev, aiMessage]);
          }
          
        } catch (error) {
          console.error("Error generating AI response:", error);
        } finally {
          setIsStreaming(false);
          setStreamingMessage("");
          abortControllerRef.current = null;
        }
      }
    },
    [currentSession, session]
  );

  const sendImageMessage = useCallback(
    async (file: File, caption: string = "") => {
      if (!session?.user.id || !currentSession) return;

      setLoading(true);

      try {
        // Send user image message
        const userMessage = await chatService.sendUserImageMessage(
          currentSession.id,
          session.user.id,
          file,
          caption
        );

        if (userMessage) {
          setMessages((prev) => [...prev, userMessage]);          
          setIsStreaming(true);
          setStreamingMessage("");
          
          try {
            // Create a new AbortController for this streaming request
            abortControllerRef.current = new AbortController();
            
            // Generate a streaming response using AI service
            const prompt = userMessage.text || "Describe this image";
            const stream = await aiService.generateContentStream(prompt, undefined, abortControllerRef.current.signal);
            let fullResponse = "";

            // Process each chunk as it arrives
            for await (const chunk of stream) {
              // Check if the request has been aborted
              if (abortControllerRef.current?.signal.aborted) {
                break;
              }
              
              if (chunk && chunk.text) {
                const chunkText = chunk.text;
                fullResponse += chunkText;
                setStreamingMessage(fullResponse);
              }
            }

            // Save the complete response to database
            const aiMessage = await chatService.sendAIMessage(
              currentSession.id,
              session.user.id,
              fullResponse
            );

            if (aiMessage) {
              setMessages((prev) => [...prev, aiMessage]);
            }
            
          } catch (error) {
            console.error("Error generating AI response:", error);
          } finally {
            setIsStreaming(false);
            setStreamingMessage("");
          }
        }
      } catch (error) {
        console.error("Error sending image message:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentSession, session]
  );

  const updateChatTitle = useCallback(
    async (sessionId: string, title: string) => {
      if (!session?.user.id) return;

      try {
        const updatedSession = await chatService.updateChatTitle(sessionId, title);
        
        if (updatedSession) {
          // Update the chat sessions list
          setChatSessions(prev => 
            prev.map(session => 
              session.id === sessionId ? {...session, title} : session
            )
          );
          
          // Update current session if it's the one being modified
          if (currentSession?.id === sessionId) {
            setCurrentSession(updatedSession);
            fetchChatSessions();
          }
        }
      } catch (error) {
        console.error("Error updating chat title:", error);
      }
    },
    [currentSession, session, fetchChatSessions]
  );

  const deleteChatSession = useCallback(
    async (sessionId: string): Promise<boolean> => {
      if (!session?.user.id) return false;

      try {
        const success = await chatService.deleteChatSession(sessionId);
        
        if (success) {
          // Remove the session from the local state
          setChatSessions(prev => prev.filter(session => session.id !== sessionId));
          
          // If the deleted session was the current one, clear current session
          if (currentSession?.id === sessionId) {
            setCurrentSession(null);
            setMessages([]);
          }
          
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting chat session:", error);
        return false;
      }
    },
    [currentSession, session]
  );

  const incrementQuestionCount = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    // Update the question count in the current session
    const updatedCount = await chatService.incrementQuestionCount(sessionId);

    setCurrentSession((prev: ChatSession | null) => {
      if (!prev) return null;
      return {
        ...prev,
        questions_count: updatedCount,
      };
    });
    setUserQuestionCount(updatedCount);
    fetchChatSessions();
  }, [fetchChatSessions]);

  const stopResponseStreaming = useCallback(() => {
    if (abortControllerRef.current && isStreaming) {
      abortControllerRef.current.abort();
    }
  }, [isStreaming]);

  return (
    <ChatContext.Provider
      value={{
        chatSessions,
        currentSession,
        messages,
        loading,
        isInitializing,
        isNewChatSession,
        streamingMessage,
        isStreaming,
        userQuestionCount,
        hasReachedLimit,
        questionLimit,
        fetchChatSessions,
        createNewChat,
        selectChatSession,
        sendMessage,
        sendImageMessage,
        updateChatTitle,
        deleteChatSession,
        incrementQuestionCount,
        stopResponseStreaming,
        contentRef,
        handlePrint,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
