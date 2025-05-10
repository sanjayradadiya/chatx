import supabaseClient from "./supabase/client";
import { getDailyChatLimit, hasReachedDailyChatLimit } from "@/lib/subscription-utils";
import { subscriptionService } from "./subscription-service";
import { toast } from "sonner";

export interface DailyChatLimitResult {
  canCreate: boolean;
  currentCount: number;
  limit: number;
  planName?: string;
}

export const dailyChatLimitService = {
  /**
   * Get the current daily chat creation count for a user
   * @param userId The ID of the user
   * @returns The current count and date
   */
  async getDailyChatCount(userId: string): Promise<{ count: number; date: string }> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const { data, error } = await supabaseClient
      .from('daily_chat_creation')
      .select('count, date')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching daily chat count:", error);
      return { count: 0, date: today };
    }
    
    return data ? { count: data.count, date: data.date } : { count: 0, date: today };
  },
  
  /**
   * Increment the daily chat creation count for a user
   * @param userId The ID of the user
   * @returns The new count
   */
  async incrementDailyChatCount(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if a record exists for today
    const { data: existingRecord } = await supabaseClient
      .from('daily_chat_creation')
      .select('id, count')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();
    
    let newCount = 1;
    
    if (existingRecord) {
      // Update existing record
      newCount = existingRecord.count + 1;
      const { error } = await supabaseClient
        .from('daily_chat_creation')
        .update({ 
          count: newCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRecord.id);
      
      if (error) {
        console.error("Error updating daily chat count:", error);
        return existingRecord.count;
      }
    } else {
      // Create new record
      const { error } = await supabaseClient
        .from('daily_chat_creation')
        .insert({
          user_id: userId,
          count: 1,
          date: today
        });
      
      if (error) {
        console.error("Error creating daily chat count record:", error);
        return 0;
      }
    }
    
    return newCount;
  },
  
  /**
   * Validate if a user can create a new chat based on their subscription plan
   * @param userId The ID of the user
   * @returns Object containing validation result
   */
  async validateChatCreation(userId: string): Promise<DailyChatLimitResult> {
    try {
      // Get user subscription
      const subscription = await subscriptionService.getUserSubscription(userId);
      
      // Get current daily chat count
      const { count } = await this.getDailyChatCount(userId);
      
      // Check if user has reached their limit
      const hasReachedLimit = hasReachedDailyChatLimit(
        subscription?.planName,
        count
      );
      
      return {
        canCreate: !hasReachedLimit,
        currentCount: count,
        limit: getDailyChatLimit(subscription?.planName),
        planName: subscription?.planName
      };
    } catch (error) {
      toast.error("Error validating chat creation limit", {
        description: (error as Error).message,
        position: "top-center",
      });
      return { canCreate: false, currentCount: 0, limit: 0 };
    }
  }
}; 