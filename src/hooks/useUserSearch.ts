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
export const useUserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await api.post<UserSearchResult[]>("/user/search", {
          params: { query },
        });
        setResults(response);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, results, isLoading };
};
