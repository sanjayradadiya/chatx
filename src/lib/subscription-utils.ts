import { SUBSCRIPTION_PLAN } from "@/config/enum";

// Define the number of questions allowed per chat session for each plan
export const PLAN_QUESTION_LIMITS = {
  [SUBSCRIPTION_PLAN.FREE]: 1,
  [SUBSCRIPTION_PLAN.PRO_BASIC]: 3,
  [SUBSCRIPTION_PLAN.PRO_PLUS]: 5,
  [SUBSCRIPTION_PLAN.CUSTOM]: Infinity, // Custom plans have unlimited questions
};

// Helper function to determine if user has reached their question limit
export const hasReachedQuestionLimit = (
  planName: string | undefined,
  messageCount: number
): boolean => {
  if (!planName) return true; // If no plan, assume limit is reached
  
  const limit = PLAN_QUESTION_LIMITS[planName as SUBSCRIPTION_PLAN] || 
                PLAN_QUESTION_LIMITS[SUBSCRIPTION_PLAN.FREE]; // Default to FREE plan limits
                
  return messageCount >= limit;
};

// Get the question limit for a specific plan
export const getQuestionLimit = (planName: string | undefined): number => {
  if (!planName) return PLAN_QUESTION_LIMITS[SUBSCRIPTION_PLAN.FREE];
  
  return PLAN_QUESTION_LIMITS[planName as SUBSCRIPTION_PLAN] || 
         PLAN_QUESTION_LIMITS[SUBSCRIPTION_PLAN.FREE];
}; 