import { LoginFormInput, SignUpFormInput } from "@/config/types";
import supabaseClient from "./supabase/client";
import { Provider, Session } from "@supabase/supabase-js";

/**
 * Authentication service for managing user authentication
 */
export const authService = {
  /**
   * Sign in a user with email and password
   * @param credentials User login credentials
   * @returns Result of the sign-in operation
   */
  async signInWithEmail(credentials: LoginFormInput) {
    return await supabaseClient.auth.signInWithPassword(credentials);
  },

  /**
   * Sign up a new user with email, password and profile data
   * @param userData User registration data
   * @returns Result of the sign-up operation
   */
  async signUpWithEmail(userData: SignUpFormInput) {
    const { data, error } = await supabaseClient.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          'full_name': userData.full_name,
          is_onboarding: false
        }
      },
    });
    const userExists = data.user?.identities?.length === 0;

    return { data, error, userExists };
  },

  /**
   * Sign out the current user
   * @returns Result of the sign-out operation
   */
  async signOut() {
    return await supabaseClient.auth.signOut();
  },

  /**
   * Get the current user session
   * @returns Current session data
   */
  async getCurrentSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
  },

  /**
   * Get the current user
   * @returns Current user data
   */
  async getCurrentUser() {
    const { data } = await supabaseClient.auth.getUser();
    return data.user;
  },

  /**
   * Set up an auth state change listener
   * @param callback Function to call when auth state changes
   * @returns Subscription that can be used to unsubscribe
   */
  subscribeToAuthChanges(callback: (session: Session | null) => void) {
    const { data } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return data.subscription;
  },

  /**
   * Update the current user's profile data
   * @param userData Profile data to update (full_name, avatar_url)
   * @returns Result of the update operation
   */
  async updateUserProfile(userData: { full_name?: string, avatar_url?: string }) {
    return await supabaseClient.auth.updateUser({
      data: userData
    });
  },
  /**
   * Sign in a user with Google
   * @param authProvider The authentication provider to use
   * @returns Result of the sign-in operation
   */
  async signInWithAuthProvider(authProvider: Provider) {
    // First check if the user exists and get their onboarding status
    const { data: sessionData } = await supabaseClient.auth.getSession();

    // If user is already logged in, check their onboarding status
    if (sessionData.session) {
      const { data } = await supabaseClient.auth.getUser();
      const isOnboardingCompleted = data.user?.user_metadata?.is_onboarding === true;
      const redirectPath = isOnboardingCompleted ? '/dashboard' : '/onboarding';

      return await supabaseClient.auth.signInWithOAuth({
        provider: authProvider,
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`,
        },
      });
    }

    // Default case for new or unknown users
    return await supabaseClient.auth.signInWithOAuth({
      provider: authProvider,
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });
  },

  /**
   * Delete the current user account
   * This method uses a PostgreSQL function to handle the deletion since
   * the client-side auth.deleteUser() is not available
   * @returns Result of the delete operation
   */
  async deleteUser() {
    try {
      // Use a Supabase PostgreSQL function to delete the user
      // This will call the RPC function 'delete_user' which should be created in Supabase
      const { data, error } = await supabaseClient.rpc('delete_user');

      if (error) throw error;

      // Sign out the user after successful deletion
      await this.signOut();

      return { data, error: null };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { data: null, error };
    }
  },

  /**
   * Check if the user needs to complete onboarding
   * @returns Boolean indicating whether the user needs onboarding
   */
  async checkOnboardingStatus() {
    const { data } = await supabaseClient.auth.getUser();
    return data.user?.user_metadata?.is_onboarding === true;
  },

  /**
   * Mark onboarding as completed for the user
   * @returns Result of the update operation
   */
  async completeOnboarding() {
    return await supabaseClient.auth.updateUser({
      data: {
        is_onboarding: true
      }
    });
  }
};
