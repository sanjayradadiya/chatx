import { ChatMessage, ChatSession, MessageType } from "@/config/types";
import supabaseClient from "./supabase/client";
import { v4 as uuidv4 } from 'uuid';

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

  // Send a text message (regular text or emoji)
  async sendUserMessage(
    sessionId: string, 
    userId: string, 
    text: string, 
    messageType: MessageType = 'text'
  ): Promise<ChatMessage | null> {
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .insert({ 
        session_id: sessionId,
        user_id: userId,
        text,
        message_type: messageType,
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

  // Send an image message
  async sendUserImageMessage(
    sessionId: string,
    userId: string,
    file: File,
    caption: string = ''
  ): Promise<ChatMessage | null> {
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabaseClient
        .storage
        .from('chat_images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return null;
      }

      // 2. Get the public URL
      const { data: { publicUrl } } = supabaseClient
        .storage
        .from('chat_images')
        .getPublicUrl(filePath);

      // 3. Create message record with image URL
      const { data, error } = await supabaseClient
        .from('chat_messages')
        .insert({ 
          session_id: sessionId,
          user_id: userId,
          text: caption,
          message_type: 'image',
          file_url: publicUrl,
          is_ai: false 
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating image message:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in sendUserImageMessage:", error);
      return null;
    }
  },

  async sendAIMessage(
    sessionId: string, 
    userId: string, 
    text: string,
    messageType: MessageType = 'text'
  ): Promise<ChatMessage | null> {
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .insert({ 
        session_id: sessionId,
        user_id: userId,
        text,
        message_type: messageType,
        is_ai: true 
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error sending AI message:", error);
      return null;
    }
    
    return data;
  },

  // Update chat session title
  async updateChatTitle(
    sessionId: string,
    title: string
  ): Promise<ChatSession | null> {
    const { data, error } = await supabaseClient
      .from('chat_sessions')
      .update({ title })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating chat title:", error);
      return null;
    }
    
    return data;
  },

  // Delete a chat session and its messages
  async deleteChatSession(sessionId: string): Promise<boolean> {
    try {
      // First delete all messages in the session
      const { error: messagesError } = await supabaseClient
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);
      
      if (messagesError) {
        console.error("Error deleting chat messages:", messagesError);
        return false;
      }
      
      // Then delete the session itself
      const { error: sessionError } = await supabaseClient
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (sessionError) {
        console.error("Error deleting chat session:", sessionError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteChatSession:", error);
      return false;
    }
  }
}; 