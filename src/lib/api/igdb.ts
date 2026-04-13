import type { IgdbGameDetails, IgdbSuggestion } from '@/features/games/types';
import Env from 'env';

const EMBEDDED_IGDB_CLIENT_ID = Env.EXPO_PUBLIC_IGDB_CLIENT_ID;
const EMBEDDED_IGDB_CLIENT_SECRET = Env.EXPO_PUBLIC_IGDB_CLIENT_SECRET;

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getIgdbToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 15000) {
    return tokenCache.token;
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${EMBEDDED_IGDB_CLIENT_ID}&client_secret=${EMBEDDED_IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' },
  );

  if (!response.ok) {
    throw new Error(`Error autenticando con Twitch: código ${response.status}`);
  }

  const payload = await response.json();
  tokenCache = {
    token: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in - 30) * 1000,
  };

  return payload.access_token;
}

function normalizeCoverUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || rawUrl.trim() === '')
    return null;
  const withProtocol = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;
  return withProtocol.replace('t_thumb', 't_cover_big');
}

function normalizeHeroImageUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || rawUrl.trim() === '')
    return null;
  const withProtocol = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;
  return withProtocol.replace(/t_\w+/i, 't_1080p');
}

function releaseYearFromUnix(timestamp?: number | null): number | null {
  if (!timestamp)
    return null;
  const year = 1970 + Math.floor(timestamp / 31556952);
  if (year > 1970 && year < 2100)
    return year;
  return null;
}

export async function searchIgdb(query: string): Promise<IgdbSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2)
    return [];

  const token = await getIgdbToken();
  const body = `search "${trimmed.replace(/"/g, '')}"; fields name,cover.url,platforms.name,platforms.platform_logo.url,genres.name,first_release_date,aggregated_rating; limit 8;`;

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': EMBEDDED_IGDB_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'text/plain',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`IGDB devolvió un error: código ${response.status}`);
  }

  const rawItems = await response.json();

  return rawItems.map((item: any) => {
    const platformNames: string[] = [];
    const platformLogos: string[] = [];

    if (item.platforms) {
      for (const p of item.platforms) {
        platformNames.push(p.name);
        let urlStr = '';
        if (p.platform_logo?.url) {
          urlStr = p.platform_logo.url.startsWith('//')
            ? `https:${p.platform_logo.url}`
            : p.platform_logo.url;
        }
        platformLogos.push(urlStr);
      }
    }

    const logoUrl = platformLogos.every(s => s === '') ? null : platformLogos.join(',');

    return {
      igdb_id: item.id,
      title: item.name,
      cover_url: normalizeCoverUrl(item.cover?.url),
      platforms: platformNames,
      platform_logo_url: logoUrl,
      genres: item.genres?.map((g: any) => g.name) || [],
      release_year: releaseYearFromUnix(item.first_release_date),
      metacritic: item.aggregated_rating
        ? Math.round(item.aggregated_rating)
        : null,
    };
  });
}

export async function getIgdbGameDetails(igdbId: number): Promise<IgdbGameDetails> {
  const token = await getIgdbToken();
  const body = `fields artworks.url, screenshots.url, videos.video_id, involved_companies.developer, involved_companies.company.name, language_supports.language.name, multiplayer_modes.campaigncoop, multiplayer_modes.lancoop, multiplayer_modes.offlinecoop, multiplayer_modes.onlinecoop, multiplayer_modes.splitscreen; where id = ${igdbId};`;

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': EMBEDDED_IGDB_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'text/plain',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`IGDB devolvió un error: código ${response.status}`);
  }

  const rawItems = await response.json();
  const item = rawItems[0];
  if (!item) {
    throw new Error('No se encontró el juego en IGDB');
  }

  const artworks = (item.artworks || [])
    .map((a: any) => normalizeCoverUrl(a.url))
    .filter(Boolean)
    .map((url: string) => url.replace('t_cover_big', 't_1080p'));

  const screenshots = (item.screenshots || [])
    .map((s: any) => normalizeCoverUrl(s.url))
    .filter(Boolean)
    .map((url: string) => url.replace('t_cover_big', 't_1080p'));

  const videos = (item.videos || []).map((v: any) => v.video_id).filter(Boolean);

  const developer = item.involved_companies?.find((c: any) => c.developer)?.company?.name;

  const languagesRaw = item.language_supports?.map((ls: any) => ls.language?.name).filter(Boolean) || [];
  const languages = Array.from(new Set(languagesRaw)).sort();

  let multiplayer = 'Single Player';
  const mMode = item.multiplayer_modes?.[0];
  if (mMode) {
    const features = [];
    if (mMode.campaigncoop)
      features.push('Co-op de Campaña');
    if (mMode.lancoop)
      features.push('Co-op LAN');
    if (mMode.offlinecoop)
      features.push('Co-op Offline');
    if (mMode.onlinecoop)
      features.push('Co-op Online');
    if (mMode.splitscreen)
      features.push('Pantalla Dividida');
    if (features.length > 0)
      multiplayer = features.join(', ');
  }

  return {
    artworks,
    screenshots,
    videos,
    developer,
    languages: languages as string[],
    multiplayer,
  };
}

export async function getIgdbOnboardingImage(gameName: string): Promise<string | null> {
  const trimmed = gameName.trim();
  if (!trimmed)
    return null;

  const token = await getIgdbToken();
  const body = `search "${trimmed.replace(/"/g, '')}"; fields artworks.url,screenshots.url,cover.url; limit 1;`;

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': EMBEDDED_IGDB_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'text/plain',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`IGDB devolvió un error: código ${response.status}`);
  }

  const rawItems = await response.json();
  const game = rawItems[0];

  const heroImage
    = normalizeHeroImageUrl(game?.artworks?.[0]?.url)
      || normalizeHeroImageUrl(game?.screenshots?.[0]?.url)
      || normalizeHeroImageUrl(game?.cover?.url);

  return heroImage;
}
