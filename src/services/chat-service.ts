import { ChatMessage, ChatSession, MessageType } from "@/config/types";
import supabaseClient from "./supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { hasReachedQuestionLimit, getQuestionLimit } from "@/lib/subscription-utils";
import { subscriptionService } from "./subscription-service";
import { dailyChatLimitService } from "./daily-chat-limit-service";
import { toast } from "sonner";

export const chatService = {
  // Chat Sessions
  async createChatSession(userId: string): Promise<ChatSession | null> {
    // Check if user has reached their daily chat creation limit
    const { canCreate, currentCount, limit } = await dailyChatLimitService.validateChatCreation(userId);
    
    if (!canCreate) {
      toast.error(`Daily chat limit reached (${currentCount}/${limit})`, {
        description: "You've reached your daily limit for creating new chats. Please upgrade your plan or try again tomorrow.",
        duration: 4000,
        position: "top-center",
        className: "!text-red-500",
        descriptionClassName: "!text-red-400"
      });
      return null;
    }
    
    const title = `Chat ${new Date().toLocaleString()}`;
    const { data, error } = await supabaseClient
      .from('chat_sessions')
      .insert({ title, user_id: userId, is_default_title: true })
      .select()
      .single();
    
    if (error) {
      toast.error("Error creating chat session", {
        description: (error as Error).message,
        position: "top-center",
      });
      return null;
    }
    
    // Increment the daily chat creation count
    await dailyChatLimitService.incrementDailyChatCount(userId);
    
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

  // Increment question count for a session
  async incrementQuestionCount(sessionId: string): Promise<number> {
    try {
      // Get current count
      const { data: session, error: fetchError } = await supabaseClient
        .from('chat_sessions')
        .select('questions_count')
        .eq('id', sessionId)
        .single();
      
      if (fetchError) {
        toast.error("Error fetching current question count", {
          description: (fetchError as Error).message,
          position: "top-center",
        });
        return 0;
      }
      
      const currentCount = session?.questions_count || 0;
      const newCount = currentCount + 1;
      
      // Update the count
      const { error: updateError } = await supabaseClient
        .from('chat_sessions')
        .update({ questions_count: newCount })
        .eq('id', sessionId);
      
      if (updateError) {
        console.error("Error updating question count:", updateError);
        return currentCount;
      }
      
      return newCount;
    } catch (error) {
      console.error("Error in incrementQuestionCount:", error);
      return 0;
    }
  },

  // Validate if user can send more messages based on subscription
  async validateMessageLimit(sessionId: string, userId: string): Promise<{
    canSend: boolean;
    userQuestionCount: number;
    questionLimit: number;
    planName?: string;
  }> {
    try {
      // Get user subscription
      const subscription = await subscriptionService.getUserSubscription(userId);
      
      // Get current question count from the session
      const { data: session, error } = await supabaseClient
        .from('chat_sessions')
        .select('questions_count')
        .eq('id', sessionId)
        .single();
      
      if (error) {
        toast.error("Error fetching session question count", {
          description: (error as Error).message,
          position: "top-center",
        });
        return { canSend: false, userQuestionCount: 0, questionLimit: 0 };
      }
      
      const userQuestionCount = session?.questions_count || 0;
      const hasReachedLimit = hasReachedQuestionLimit(
        subscription?.planName,
        userQuestionCount
      );
      
      return {
        canSend: !hasReachedLimit,
        userQuestionCount,
        questionLimit: getQuestionLimit(subscription?.planName),
        planName: subscription?.planName
      };
    } catch (error) {
      toast.error("Error validating message limit", {
        description: (error as Error).message,
        position: "top-center",
      });
      return { canSend: false, userQuestionCount: 0, questionLimit: 0 };
    }
  },

  // Send a text message (regular text or emoji)
  async sendUserMessage(
    sessionId: string, 
    userId: string, 
    text: string, 
    messageType: MessageType = 'text'
  ): Promise<ChatMessage | null> {
    // Validate message limit
    const { canSend } = await this.validateMessageLimit(sessionId, userId);
    
    if (!canSend) {
      toast.error("You have reached your message limit. Please upgrade your plan to continue.", {
        position: "top-center",
      });
      return null;
    }
    
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
    // Validate message limit
    const { canSend } = await this.validateMessageLimit(sessionId, userId);
    
    if (!canSend) {
      toast.error("You have reached your message limit. Please upgrade your plan to continue.", {
        position: "top-center",
      });
      return null;
    }
    
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
      .update({ title, is_default_title: false })
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