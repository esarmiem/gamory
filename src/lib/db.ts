import type { Game, NewGamePayload } from '@/features/games/types';
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('gamory.sqlite');

export function initDatabase() {
  const tableInfo = db.getAllSync<{ name: string }>('PRAGMA table_info(games)');
  const hasGamesTable = tableInfo.length > 0;
  const hasStatusColumn = tableInfo.some(col => col.name === 'status');

  if (!hasGamesTable) {
    // Initial schema
    db.execSync(`
      CREATE TABLE games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        platform TEXT NOT NULL DEFAULT '',
        rating INTEGER CHECK(rating IS NULL OR (rating >= 1 AND rating <= 5)),
        cover_url TEXT,
        genre TEXT,
        release_year INTEGER,
        metacritic INTEGER,
        igdb_id INTEGER,
        platform_logo_url TEXT,
        status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('completed', 'in_progress')),
        quick_review TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_games_title ON games(title);
      CREATE INDEX idx_games_platform ON games(platform);
    `);
  }
  else if (!hasStatusColumn) {
    // Migration: add status, quick_review, and make rating nullable
    db.execSync(`
      BEGIN TRANSACTION;
      CREATE TABLE games_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        platform TEXT NOT NULL DEFAULT '',
        rating INTEGER CHECK(rating IS NULL OR (rating >= 1 AND rating <= 5)),
        cover_url TEXT,
        genre TEXT,
        release_year INTEGER,
        metacritic INTEGER,
        igdb_id INTEGER,
        platform_logo_url TEXT,
        status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('completed', 'in_progress')),
        quick_review TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO games_new (id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url, status, quick_review, created_at, updated_at)
      SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url, 'completed', null, created_at, updated_at FROM games;

      DROP TABLE games;
      ALTER TABLE games_new RENAME TO games;

      CREATE INDEX idx_games_title ON games(title);
      CREATE INDEX idx_games_platform ON games(platform);
      COMMIT;
    `);
  }
}

export function getGameById(id: number): Game | null {
  return db.getFirstSync<Game>(`
    SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url, status, quick_review
    FROM games
    WHERE id = ?
  `, [id]);
}

export function getGames(search: string = ''): Game[] {
  const normalized = search.trim().toLowerCase();

  if (normalized === '') {
    return db.getAllSync<Game>(`
      SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url, status, quick_review
      FROM games
      ORDER BY title ASC
    `);
  }

  return db.getAllSync<Game>(`
    SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url, status, quick_review
    FROM games
    WHERE lower(title) LIKE ? OR lower(platform) LIKE ?
    ORDER BY title ASC
  `, [`%${normalized}%`, `%${normalized}%`]);
}

export function addGame(payload: NewGamePayload): Game {
  const result = db.runSync(`
    INSERT INTO games (title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url, status, quick_review, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
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
    payload.status,
    payload.quick_review || null,
  ]);

  const game = db.getFirstSync<Game>(`
    SELECT id, title, platform, rating, cover_url, genre, release_year, metacritic, igdb_id, platform_logo_url, status, quick_review
    FROM games
    WHERE id = ?
  `, [result.lastInsertRowId]);

  if (!game)
    throw new Error('Game not found after insert');
  return game;
}

export function updateGameCompletion(id: number, rating: number | null, quickReview: string | null): boolean {
  const result = db.runSync(`
    UPDATE games 
    SET status = 'completed', rating = ?, quick_review = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [rating, quickReview || null, id]);
  return result.changes > 0;
}

export function deleteGame(id: number): boolean {
  const result = db.runSync('DELETE FROM games WHERE id = ?', [id]);
  return result.changes > 0;
}
