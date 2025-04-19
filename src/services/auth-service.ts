import { LoginFormInput, SignUpFormInput } from "@/config/types";
import supabaseClient from "./supabase/client";
import { Session } from "@supabase/supabase-js";

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
    return await supabaseClient.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          'fullname': userData.fullname,
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
  }
};
