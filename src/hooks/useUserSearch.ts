import { useState, useEffect, useMemo } from 'react';
import { conversations, type Conversation, type User } from '@/data/mockData';

interface SearchResult {
  user: User;
  conversation?: Conversation;
  matchType: 'name' | 'message';
  matchedText?: string;
}

interface UseUserSearchResult {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
}

// Simulated API delay for realistic feel
const SEARCH_DELAY = 300;

// Get all unique users from conversations
const allUsers = conversations.map(conv => ({
  user: conv.user,
  conversation: conv,
}));

// Search function that mimics API behavior
const searchUsers = (query: string): SearchResult[] => {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search by user name
  allUsers.forEach(({ user, conversation }) => {
    if (user.name.toLowerCase().includes(normalizedQuery)) {
      results.push({
        user,
        conversation,
        matchType: 'name',
      });
    }
  });

  // Search by message content (if not already found by name)
  conversations.forEach(conv => {
    const alreadyFound = results.some(r => r.user.id === conv.user.id);
    if (!alreadyFound) {
      const matchingMessage = conv.messages.find(msg =>
        msg.content.toLowerCase().includes(normalizedQuery)
      );
      if (matchingMessage) {
        results.push({
          user: conv.user,
          conversation: conv,
          matchType: 'message',
          matchedText: matchingMessage.content,
        });
      }
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
    const searchResults = searchUsers(debouncedQuery);
    return searchResults;
  }, [debouncedQuery]);

  // Set loading to false after results are computed
  useEffect(() => {
    if (debouncedQuery) {
      // Simulate additional API processing time
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
