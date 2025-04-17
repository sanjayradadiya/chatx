import { ChatMessage, ChatSession } from "@/config/types";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { chatService } from "@/services/supabase/chat-service";
import { useAuthProvider } from "./auth-provider";

// Random AI responses for demonstration
const AI_RESPONSES = [
  "That's interesting. Tell me more about it.",
  "I understand your point. Have you considered an alternative approach?",
  "I'm here to help you. What specific information do you need?",
  "That's a great question. Let me think about it.",
  "Based on what you've told me, I would suggest considering the following options...",
  "I appreciate your patience. Could you provide more context?",
  "I'm processing your request. Give me a moment to find the best answer.",
  "Thank you for sharing that. It helps me understand your situation better.",
  "I'm not sure I fully understand. Could you elaborate?",
  "Let me see if I can help with that. Here's what I think...",
  "Interesting perspective! Let's explore it further.",
  "That's a valid concern. Let's break it down together.",
  "Thanks for bringing that up. It’s definitely worth discussing.",
  "I can see why you’d think that. Let’s dive deeper.",
  "Good point! I think we can build on that.",
  "Let me analyze that for a second...",
  "That’s a thoughtful observation. I appreciate you mentioning it.",
  "Let’s look at this from another angle.",
  "Here’s a possible way to approach the issue.",
  "I think we're getting somewhere. Let's continue.",
  "You're raising some important questions. Let’s unpack them.",
  "Let’s work through this together step by step.",
  "That’s a tricky one. Let me try to simplify it.",
  "Thanks for your input. It really helps refine the discussion.",
  "Let’s clarify a few things to make sure we’re aligned."
];

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
  sendMessage: (text: string) => Promise<void>;
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
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNewChatSession, setIsNewChatSession] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const { session } = useAuthProvider();
  
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
  
  const createNewChat = useCallback(async () => {
    if (!session?.user.id) return null;
    
    setIsNewChatSession(true);
    let newSession: ChatSession | null = null;
    try {
      newSession = await chatService.createChatSession(session.user.id);
      
      if (newSession) {
        setChatSessions(prev => [newSession!, ...prev]);
        setCurrentSession(newSession);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
      setIsNewChatSession(false);
    } finally {
      setIsNewChatSession(false);
    }
    
    return newSession;
  }, [session]);
  
  const selectChatSession = useCallback(async (sessionId: string) => {
    if (!session?.user.id) return;
    
    setIsNewChatSession(true);
    try {
      const selectedSession = chatSessions.find(s => s.id === sessionId) || null;
      setCurrentSession(selectedSession);
      
      if (selectedSession) {
        const chatMessages = await chatService.getChatMessages(sessionId);
        setMessages(chatMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error selecting chat session:", error);
      setIsNewChatSession(false);
    } finally {
      setIsNewChatSession(false);
    }
  }, [chatSessions, session]);
  
  const sendMessage = useCallback(async (text: string) => {
    if (!session?.user.id || !currentSession) return;
    
    // Send user message
    const userMessage = await chatService.sendUserMessage(
      currentSession.id,
      session.user.id,
      text
    );
    
    if (userMessage) {
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate AI thinking
      setLoading(true);
      
      // Wait a bit to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get random AI response
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      
      // Send AI response
      const aiMessage = await chatService.sendAIMessage(
        currentSession.id,
        session.user.id,
        randomResponse
      );
      
      if (aiMessage) {
        setMessages(prev => [...prev, aiMessage]);
      }
      
      setLoading(false);
    }
  }, [currentSession, session]);
  
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
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext); 