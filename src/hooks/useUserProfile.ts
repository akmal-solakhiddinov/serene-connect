import { useState, useEffect, useCallback } from 'react';
import { api } from '@/http/axios';
import type { UserProfile } from '@/types';

export interface UseUserProfileResult {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (userId?: string): UseUserProfileResult => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const endpoint = userId ? `/users/${userId}/profile` : '/user/profile';
      const response = await api.get<{ profile: UserProfile }>(endpoint);
      setProfile(response.profile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
};
