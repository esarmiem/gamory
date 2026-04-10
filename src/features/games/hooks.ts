import type { Game, NewGamePayload } from './types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { addGame, deleteGame, getGames } from '@/lib/db';

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
    handleDeleteGame,
  };
}
