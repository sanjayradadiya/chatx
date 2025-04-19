import { ChatMessage, ChatSession, MessageType } from "@/config/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { chatService } from "@/services/supabase/chat-service";
import { useAuthProvider } from "./auth-provider";
import { GoogleGenAI } from "@google/genai";
import { APP_CONFIG } from "@/config/config";

interface ChatContextType {
  chatSessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  loading: boolean;
  isInitializing: boolean;
  isNewChatSession: boolean;
  fetchChatSessions: () => Promise<void>;
  createNewChat: () => Promise<ChatSession | null>;
  selectChatSession: (sessionId: string) => Promise<void>;
  sendMessage: (text: string, messageType?: MessageType) => Promise<void>;
  sendImageMessage: (file: File, caption?: string) => Promise<void>;
  updateChatTitle: (sessionId: string, title: string) => Promise<void>;
  deleteChatSession: (sessionId: string) => Promise<boolean>;
}

const ChatContext = createContext<ChatContextType>({
  chatSessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  isInitializing: true,
  isNewChatSession: false,
  fetchChatSessions: async () => {},
  createNewChat: async () => null,
  selectChatSession: async () => {},
  sendMessage: async () => {},
  sendImageMessage: async () => {},
  updateChatTitle: async () => {},
  deleteChatSession: async () => false,
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
  const { session } = useAuthProvider();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ai = new GoogleGenAI({ apiKey: APP_CONFIG.GEMINI_API_KEY });

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

    try {
      const newSession = await chatService.createChatSession(session.user.id);

      if (newSession) {
        setChatSessions((prev) => [newSession, ...prev]);
        setCurrentSession(newSession);
        setMessages([]);
        setIsNewChatSession(true);
      }

      return newSession;
    } catch (error) {
      console.error("Error creating new chat:", error);
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
      // Send user message
      const userMessage = await chatService.sendUserMessage(
        currentSession.id,
        session.user.id,
        text,
        messageType
      );

      if (userMessage) {
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);
        // Get AI response
        const randomResponse = await generateAiResponse(userMessage.text);

        // Send AI response
        const aiMessage = await chatService.sendAIMessage(
          currentSession.id,
          session.user.id,
          randomResponse
        );

        if (aiMessage) {
          setMessages((prev) => [...prev, aiMessage]);
        }

        setLoading(false);
      }
    },
    [currentSession, session]
  );

  const generateAiResponse = useCallback(
    async (userMessage: string): Promise<string> => {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage,
      });
      return response.text || "";
    },
    [ai]
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

            // Get AI response
          const randomResponse = await generateAiResponse(userMessage.text);

          // Send AI response
          const aiMessage = await chatService.sendAIMessage(
            currentSession.id,
            session.user.id,
            randomResponse
          );

          if (aiMessage) {
            setMessages((prev) => [...prev, aiMessage]);
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
            setCurrentSession({...currentSession, title});
          }
        }
      } catch (error) {
        console.error("Error updating chat title:", error);
      }
    },
    [currentSession, session]
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

  return (
    <ChatContext.Provider
      value={{
        chatSessions,
        currentSession,
        messages,
        loading,
        isNewChatSession,
        isInitializing,
        fetchChatSessions,
        createNewChat,
        selectChatSession,
        sendMessage,
        sendImageMessage,
        updateChatTitle,
        deleteChatSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
