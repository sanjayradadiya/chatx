import { SUBSCRIPTION_PLAN } from "@/config/enum";

// Define the number of questions allowed per chat session for each plan
export const PLAN_QUESTION_LIMITS = {
  [SUBSCRIPTION_PLAN.FREE]: 1,
  [SUBSCRIPTION_PLAN.PRO_BASIC]: 3,
  [SUBSCRIPTION_PLAN.PRO_PLUS]: 5,
  [SUBSCRIPTION_PLAN.CUSTOM]: Infinity, // Custom plans have unlimited questions
};

// Define the plan in order of lowest to highest
export const PLAN_ORDER = [
  SUBSCRIPTION_PLAN.FREE,
  SUBSCRIPTION_PLAN.PRO_BASIC,
  SUBSCRIPTION_PLAN.PRO_PLUS,
  SUBSCRIPTION_PLAN.CUSTOM,
];

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

/**
 * Check if a plan is lower-tier than the current active plan
 * @param planToCheck The plan to check
 * @param currentPlan The current active plan
 * @returns True if the plan is lower-tier, false otherwise
 */
export const isLowerTierPlan = (
  planToCheck: SUBSCRIPTION_PLAN,
  currentPlan: SUBSCRIPTION_PLAN | undefined
): boolean => {
  if (!currentPlan) return false;
  
  const planToCheckIndex = PLAN_ORDER.indexOf(planToCheck);
  const currentPlanIndex = PLAN_ORDER.indexOf(currentPlan);
  
  return planToCheckIndex < currentPlanIndex;
}; 