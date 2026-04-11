import type { Game, IgdbSuggestion, NewGamePayload } from './types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { getIgdbGameDetails, searchIgdb } from '@/lib/api/igdb';
import { addGame, deleteGame, getGames, updateGameCompletion } from '@/lib/db';

export function useIgdbDetails(igdbId: number | null | undefined) {
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadDetails() {
      if (!igdbId) {
        if (mounted)
          setIsLoading(false);
        return;
      }
      try {
        const data = await getIgdbGameDetails(igdbId);
        if (mounted)
          setDetails(data);
      }
      catch (err) {
        console.error('Error fetching game details:', err);
      }
      finally {
        if (mounted)
          setIsLoading(false);
      }
    }

    loadDetails();
    return () => {
      mounted = false;
    };
  }, [igdbId]);

  return { details, isLoading };
}

export function useGames(search: string = '') {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(() => {
    try {
      setIsLoading(true);
      const data = getGames(search);
      setGames(data);
      setError(null);
    }
    catch (err) {
      setError(String(err));
    }
    finally {
      setIsLoading(false);
    }
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      fetchGames();
    }, [fetchGames]),
  );

  const handleAddGame = async (payload: NewGamePayload) => {
    addGame(payload);
    fetchGames();
  };

  const handleCompleteGame = async (id: number, rating: number | null, quickReview: string | null) => {
    updateGameCompletion(id, rating, quickReview);
    fetchGames();
  };

  const handleDeleteGame = async (id: number) => {
    deleteGame(id);
    fetchGames();
  };

  return {
    games,
    isLoading,
    error,
    refetch: fetchGames,
    handleAddGame,
    handleCompleteGame,
    handleDeleteGame,
  };
}

export function useIgdbSearch(title: string, igdbId: number | null) {
  const [results, setResults] = useState<IgdbSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const term = title.trim();
    if (term.length < 2 || igdbId !== null) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const res = await searchIgdb(term);
        setResults(res);
      }
      catch (err) {
        setResults([]);
        setError(String(err));
      }
      finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [title, igdbId]);

  return { results, isSearching, error, setResults, setError };
}
