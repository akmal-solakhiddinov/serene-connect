import { useState, useEffect, useCallback } from 'react';
import { api } from '@/http/axios';
import type { UserProfile } from '@/types';

export interface UseUserProfileResult {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Mock profile data for when API is not available
const MOCK_PROFILE: UserProfile = {
  id: "me_mock",
  name: "Your Profile",
  avatar: "",
  online: true,
  email: "you@example.com",
  phone: "+1 234 567 890",
  location: "San Francisco, CA",
  bio: "Living life one message at a time ✨",
  joinedAt: "January 2024",
  stats: {
    messagesCount: 1234,
    mediaCount: 56,
    linksCount: 23,
  },
  sharedMedia: [
    { id: "1", type: "image", url: "", thumbnailUrl: "" },
    { id: "2", type: "image", url: "", thumbnailUrl: "" },
    { id: "3", type: "video", url: "", thumbnailUrl: "" },
  ],
  recentLinks: [
    { id: "1", title: "Cool Article", url: "https://example.com", type: "link" },
    { id: "2", title: "Music Playlist", url: "https://spotify.com", type: "music" },
  ],
};

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
      // Fallback to mock data if API fails
      setProfile(MOCK_PROFILE);
      setError(null); // Don't show error, just use mock data
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
