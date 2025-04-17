import { ChatMessage, ChatSession } from "@/config/types";
import supabaseClient from "./client";

export const chatService = {
  // Chat Sessions
  async createChatSession(userId: string): Promise<ChatSession | null> {
    const title = `Chat ${new Date().toLocaleString()}`;
    const { data, error } = await supabaseClient
      .from('chat_sessions')
      .insert({ title, user_id: userId })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating chat session:", error);
      return null;
    }
    
    return data;
  },

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    const { data, error } = await supabaseClient
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching chat sessions:", error);
      return [];
    }
    
    return data || [];
  },

  // Chat Messages
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
    
    return data || [];
  },

  async sendUserMessage(sessionId: string, userId: string, text: string): Promise<ChatMessage | null> {
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .insert({ 
        session_id: sessionId,
        user_id: userId,
        text,
        is_ai: false 
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error sending user message:", error);
      return null;
    }
    
    return data;
  },

  async sendAIMessage(sessionId: string, userId: string, text: string): Promise<ChatMessage | null> {
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .insert({ 
        session_id: sessionId,
        user_id: userId,
        text,
        is_ai: true 
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error sending AI message:", error);
      return null;
    }
    
    return data;
  }
}; 