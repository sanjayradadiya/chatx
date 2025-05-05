import { LoginFormInput, SignUpFormInput } from "@/config/types";
import supabaseClient from "./supabase/client";
import { Provider, Session } from "@supabase/supabase-js";
import { USER_STATUS } from "@/config/enum";

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
   * Check if a user with the given email already exists
   * @param email Email address to check
   * @returns Boolean indicating whether the user exists
   */
  async checkUserExists(email: string) {
    // We can use the signUp function with the identities length check to determine if a user exists
    const { data } = await supabaseClient.auth.signUp({
      email,
      password: crypto.randomUUID(), // Use a random password as we'll never use it
    });
    
    // If identities array is empty, the user already exists
    return data.user?.identities?.length === 0;
  },

  /**
   * Sign up a new user with email, password and profile data
   * @param userData User registration data
   * @returns Result of the sign-up operation
   */
  async signUpWithEmail(userData: SignUpFormInput) {
    return await supabaseClient.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          'full_name': userData.full_name,
          status: USER_STATUS.ACTIVE,
        }
      },
    });
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
    return await supabaseClient.auth.signInWithOAuth({
      provider: authProvider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  },

  /**
   * Soft delete the current user account
   * This method updates the user's status to 'deleted' instead of permanently deleting the account
   * @returns Result of the soft delete operation
   */
  async deleteUser() {
    try {
      // Call the RPC function 'delete_user' which now implements soft deletion
      const { data, error } = await supabaseClient.rpc('delete_user');
      
      if (error) throw error;
      
      // Sign out the user after marking account as deleted
      await this.signOut();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error soft deleting user:', error);
      return { data: null, error };
    }
  }
};
