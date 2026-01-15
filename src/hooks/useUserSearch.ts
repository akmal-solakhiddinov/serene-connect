import { useState, useEffect, useMemo } from 'react';
import { allUsers, conversations, type Conversation, type User } from '@/data/mockData';

export interface UserSearchResult {
  user: User;
  conversation?: Conversation;
  hasExistingConversation: boolean;
}

interface UseUserSearchResult {
  results: UserSearchResult[];
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
}

// Simulated API delay for realistic feel
const SEARCH_DELAY = 300;

// Get conversation by user ID
const getConversationByUserId = (userId: string): Conversation | undefined => {
  return conversations.find(conv => conv.user.id === userId);
};

// Search all users in the system
const searchUsers = (query: string): UserSearchResult[] => {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: UserSearchResult[] = [];

  // Search through all users
  allUsers.forEach(user => {
    if (user.name.toLowerCase().includes(normalizedQuery)) {
      const conversation = getConversationByUserId(user.id);
      results.push({
        user,
        conversation,
        hasExistingConversation: !!conversation,
      });
    }
  });

  return results;
};

export const useUserSearch = (): UseUserSearchResult => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce the search query
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  const results = useMemo(() => {
    if (!debouncedQuery) {
      return [];
    }
    return searchUsers(debouncedQuery);
  }, [debouncedQuery]);

  // Set loading to false after results are computed
  useEffect(() => {
    if (debouncedQuery) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [debouncedQuery, results]);

  return {
    results,
    isLoading,
    query,
    setQuery,
  };
};
