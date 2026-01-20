import { useState, useEffect } from "react";
import { api } from "@/http/axios";
import type { UserSearchResult } from "@/types";

interface UseUserSearchResult {
  results: UserSearchResult[];
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
}

const SEARCH_DELAY = 300;

export const useUserSearch = (): UseUserSearchResult => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await api.get<{ results: UserSearchResult[] }>("/users/search", {
          params: { q: query },
        });
        setResults(response.results || []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  return {
    results,
    isLoading,
    query,
    setQuery,
  };
};
