import type { Game, NewGamePayload } from '@/features/games/types';
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('gamory.sqlite');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      platform TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      cover_url TEXT,
      genre TEXT,
      release_year INTEGER,
      metacritic INTEGER,
      igdb_id INTEGER,
      platform_logo_url TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
    CREATE INDEX IF NOT EXISTS idx_games_platform ON games(platform);
  `);
}

export function getGameById(id: number): Game | null {
  return db.getFirstSync<Game>(`
    SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url
    FROM games
    WHERE id = ?
  `, [id]);
}

export function getGames(search: string = ''): Game[] {
  const normalized = search.trim().toLowerCase();

  if (normalized === '') {
    return db.getAllSync<Game>(`
      SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url
      FROM games
      ORDER BY title ASC
    `);
  }

  return db.getAllSync<Game>(`
    SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url
    FROM games
    WHERE lower(title) LIKE ? OR lower(platform) LIKE ?
    ORDER BY title ASC
  `, [`%${normalized}%`, `%${normalized}%`]);
}

export function addGame(payload: NewGamePayload): Game {
  const result = db.runSync(`
    INSERT INTO games (title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `, [
    payload.title.trim(),
    payload.platform ? payload.platform.trim() : '',
    payload.rating,
    payload.cover_url || null,
    payload.genre || null,
    payload.release_year || null,
    payload.metacritic || null,
    payload.igdb_id || null,
    payload.platform_logo_url || null,
  ]);

  const game = db.getFirstSync<Game>(`
    SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url
    FROM games
    WHERE id = ?
  `, [result.lastInsertRowId]);

  if (!game)
    throw new Error('Game not found after insert');
  return game;
}

export function deleteGame(id: number): boolean {
  const result = db.runSync('DELETE FROM games WHERE id = ?', [id]);
  return result.changes > 0;
}
