import { useCallback, useState } from 'react';
import supabaseClient from '@/services/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { authService } from '@/services/auth-service';
import { useAuthProvider } from '@/context/auth-provider';

const STORAGE_BUCKET = 'profile-images';

export function useProfileImage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { currentUser, setCurrentUser } = useAuthProvider();

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
      const { data,error: updateError } = await authService.updateUserProfile({ avatar_url: publicUrl });
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

  const updateProfile = useCallback(async (userData: { fullname?: string }) => {
    try {
      const { data, error } = await authService.updateUserProfile(userData);
      if (error) throw error;
      setCurrentUser(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  return {
    uploadProfileImage,
    isUploading,
    uploadError,
    updateProfile,
  };
} 