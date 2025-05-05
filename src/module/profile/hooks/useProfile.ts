import { useCallback, useMemo, useRef, useState } from 'react';
import supabaseClient from '@/services/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { authService } from '@/services/auth-service';
import { useAuthProvider } from '@/context/auth-provider';
import { toast } from 'sonner';
import { SubscriptionData } from '@/config/types';
import { SUBSCRIPTION_PLANS } from '@/config/constant';
import { useNavigate } from 'react-router-dom';

const STORAGE_BUCKET = 'profile-images';

export function useProfile(subscription: SubscriptionData) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { currentUser, setCurrentUser } = useAuthProvider();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fullName, setFullName] = useState<string>(
    currentUser?.user_metadata?.full_name || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const userProfile = useMemo(() => {
    return {
      avatarUrl: currentUser?.user_metadata?.avatar_url,
      full_name: currentUser?.user_metadata?.full_name,
      email: currentUser?.email,
      createdAt: currentUser?.created_at || "",
      lastSignInAt: currentUser?.last_sign_in_at || "",
    };
  }, [currentUser]);

  const expirationDate = useMemo(() => {
    if (subscription?.updatedAt) {
      return new Date(
        new Date(subscription.updatedAt).setMonth(
          new Date(subscription.updatedAt).getMonth() + 1
        )
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "N/A";
  }, [subscription?.updatedAt]);

  const currentPlanDetails = useMemo(() => {
    if (!subscription) return SUBSCRIPTION_PLANS[0]; // Default to FREE plan
    return SUBSCRIPTION_PLANS.find(plan => plan.type === subscription.planName) || SUBSCRIPTION_PLANS[0];
  }, [subscription]);

  const uploadProfileImage = async (file: File) => {
    if (!currentUser) {
      setUploadError('User not authenticated');
      return { error: 'User not authenticated', url: null };
    }

    if (!file) {
      setUploadError('No file selected');
      return { error: 'No file selected', url: null };
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabaseClient.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update user profile with new avatar URL
      const { data, error: updateError } = await authService.updateUserProfile({ avatar_url: publicUrl });
      setCurrentUser(data.user);

      if (updateError) {
        throw updateError;
      }

      return { error: null, url: publicUrl };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error uploading image';
      setUploadError(errorMessage);
      return { error: errorMessage, url: null };
    } finally {
      setIsUploading(false);
    }
  };

  const updateProfile = useCallback(async (userData: { full_name?: string }) => {
    try {
      const { data, error } = await authService.updateUserProfile(userData);
      if (error) throw error;
      setCurrentUser(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUpdating(true);
      const { error } = await updateProfile({ full_name: fullName });
      if (error) throw error;
      toast.success("Profile updated successfully", {
        position: "top-center",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error updating profile";
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { error, url } = await uploadProfileImage(file);

    if (error) {
      toast.error(error, {
        position: "top-center",
      });
      return;
    }

    if (url) {
      toast.success("Profile image updated successfully", {
        position: "top-center",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    const name = currentUser?.user_metadata?.full_name || "";
    return name.charAt(0) + (name.split(" ")[1]?.charAt(0) || "");
  };

  const deleteAccount = async () => {
    if (!currentUser) {
      toast.error("User not authenticated", {
        position: "top-center",
      });
      return;
    }

    try {
      setIsDeleting(true);

      // Call the authService.deleteUser method to handle the deletion
      const { error } = await authService.deleteUser();

      if (error) throw error;

      // Sign out handled by authService.deleteUser
      setCurrentUser(null);
      
      toast.success("Account deleted successfully", {
        position: "top-center",
      });
      
      navigate('/');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting account";
      toast.error(errorMessage, {
        position: "top-center",
      });
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    userProfile,
    isUploading,
    uploadError,
    expirationDate,
    currentPlanDetails,
    fullName,
    isUpdating,
    isDeleting,
    fileInputRef,
    getInitials,
    triggerFileInput,
    handleUpdateProfile,
    handleImageUpload,
    uploadProfileImage,
    updateProfile,
    setFullName,
    deleteAccount,
  };
} 