<h1 align="center">
  <img alt="Gamory logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>
  Gamory
</h1>

<p align="center">
  Tu historial gamer en el bolsillo.
</p>

<p align="center">
  <a href="https://github.com/esarmiem/gamory">Repositorio</a>
</p>

## Que es Gamory

Gamory es una app mobile para registrar, organizar y calificar videojuegos.

Su objetivo es ayudarte a llevar un historial personal de lo que ya terminaste, lo que estas jugando ahora y como te fue con cada titulo, sin depender de una hoja de calculo o una nota suelta. La app combina almacenamiento local con enriquecimiento de datos desde IGDB para que guardar un juego sea rapido, visual y practico.

En pocas palabras, Gamory busca resolver tres cosas:

- centralizar tu biblioteca personal de juegos;
- registrar partidas terminadas y juegos en curso;
- guardar una calificacion y una reseña corta de cada experiencia.

## Proposito del producto

Gamory esta pensada como una companion app personal para jugadores que quieren:

- recordar que jugaron y en que plataforma;
- puntuar rapidamente sus juegos favoritos;
- ver metadata util como portada, genero, anio, Metacritic y media extra;
- mantener una lista simple de juegos "completed" e "in_progress".

La experiencia esta orientada a ser directa:

- agregas un juego desde un wizard de 3 pasos;
- puedes buscar sugerencias en IGDB;
- el juego queda guardado en SQLite local;
- desde el detalle puedes completar un juego en curso y agregar su rating final.

## Stack principal

Gamory esta construida sobre una base moderna de React Native:

- **Expo SDK 54**
- **React Native 0.81**
- **React 19**
- **TypeScript**
- **Expo Router 6** para navegacion basada en archivos
- **expo-sqlite** para persistencia local
- **Uniwind / TailwindCSS 4** para estilos utility-first
- **@gorhom/bottom-sheet** para modales y sheets
- **Moti** para animaciones de UI
- **i18next** para internacionalizacion
- **Jest + Testing Library** para testing
- **EAS Build** para builds remotos

Tambien reutiliza la base del starter de Obytes, pero la implementacion del dominio, la UI y los flujos de Gamory estan adaptados al producto real.

## Como esta construida

La app sigue una estructura por rutas y features:

```text
src/
├── app/
│   ├── _layout.tsx              # Providers globales y stack principal
│   ├── add.tsx                  # Wizard de alta de juegos
│   ├── game/[id].tsx            # Detalle del juego
│   └── (app)/
│       ├── _layout.tsx          # Shell principal y header de tabs
│       ├── index.tsx            # Home / dashboard
│       └── settings.tsx         # Pantalla de ajustes
├── features/
│   ├── games/
│   │   ├── components/onboarding/
│   │   ├── hooks.ts
│   │   └── types.ts
│   └── settings/
├── components/ui/               # Sistema de componentes reutilizables
├── lib/
│   ├── api/igdb.ts              # Integracion con IGDB
│   ├── db.ts                    # SQLite, consultas y migraciones
│   ├── i18n/
│   └── hooks/
├── translations/                # en.json y ar.json
└── global.css                   # Tokens y estilos globales
```

### Capas principales

**UI / Screens**

- `src/app/(app)/index.tsx`: dashboard con buscador, filtros y grid de juegos.
- `src/app/add.tsx`: onboarding para agregar un juego en 3 pasos.
- `src/app/game/[id].tsx`: detalle enriquecido con media, metadata y accion de completar juego.
- `src/features/settings/`: configuracion de idioma, tema e informacion de la app.

**Dominio de juegos**

- `src/features/games/types.ts`: modelado de `Game`, `NewGamePayload`, `IgdbSuggestion` e `IgdbGameDetails`.
- `src/features/games/hooks.ts`: lectura local, alta, completado de juegos y llamadas a IGDB.

**Persistencia**

- `src/lib/db.ts`: usa `expo-sqlite` con una base `gamory.sqlite`.
- Inicializa la tabla `games` al arrancar la app.
- Ejecuta migraciones controladas usando `PRAGMA table_info(...)`.
- Soporta `rating` nullable para juegos en curso.

**Datos externos**

- `src/lib/api/igdb.ts`: autentica contra Twitch, cachea el token y consulta IGDB.
- Busca sugerencias por nombre.
- Recupera detalles extra: artworks, screenshots, videos, developer, idiomas y multiplayer.

## Funcionalidades actuales

- Registro local de juegos en SQLite.
- Flujo de alta con wizard de 3 pasos.
- Busqueda de juegos con sugerencias desde IGDB.
- Estados de juego: `completed` e `in_progress`.
- Calificacion de 1 a 5 estrellas.
- Reseña corta opcional (`quick_review`).
- Filtros en Home: `Todos`, `Favoritos`, `En curso`.
- Favoritos definidos estrictamente como juegos con `rating === 5`.
- Pantalla de detalle con portada, banner, capturas y videos.
- Accion para completar un juego en curso desde su detalle.
- Ajustes de idioma y tema.
- Soporte de traducciones en ingles y arabe.

## Flujo principal de usuario

### 1. Dashboard

La pantalla principal muestra:

- header con branding de Gamory;
- CTA para agregar un juego;
- buscador por titulo o plataforma;
- filtros rapidos;
- cards con portada, plataforma, estado y rating.

### 2. Agregar juego

El alta se resuelve en un wizard de 3 pasos:

1. **Busqueda del juego**
   - escribes el nombre;
   - puedes seleccionar una sugerencia de IGDB;
   - se autocompletan datos como portada, plataformas, genero y anio.
2. **Estado**
   - eliges si el juego ya esta `completed` o sigue `in_progress`.
3. **Review**
   - si esta completado, asignas rating;
   - opcionalmente agregas una reseña corta.

### 3. Detalle del juego

Desde cada card puedes abrir un detalle que incluye:

- hero con imagen principal;
- metadata del juego;
- rating y reseña guardada;
- idiomas, multiplayer, capturas y videos;
- accion para eliminar;
- accion para completar si aun estaba en progreso.

## Persistencia y modelo de datos

La tabla principal es `games` y hoy maneja estos campos:

```text
id
title
platform
rating
cover_url
genre
release_year
metacritic
igdb_id
platform_logo_url
status
quick_review
created_at
updated_at
```

### Reglas importantes del modelo

- `status` solo puede ser `completed` o `in_progress`.
- `rating` puede ser `null` cuando el juego esta en curso.
- `quick_review` es opcional.
- la busqueda local filtra por `title` y `platform`.

## UI y decisiones de producto

- Tipografia de headings: **Space Grotesk**
- Tipografia base: **Plus Jakarta Sans**
- Layout principal con header a la izquierda y CTA tipo pill a la derecha
- Estetica visual con fondos neutros, cards blancas y acentos de color
- Detalle del juego como modal en iOS y pantalla modal desde Expo Router

## Internacionalizacion

La app usa `i18next` y actualmente incluye:

- `en`
- `ar`

Los recursos viven en `src/translations/` y se registran desde `src/lib/i18n/resources.ts`.

## Requisitos

Antes de correr el proyecto necesitas:

- [Node.js LTS](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/installation)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall) en macOS o Linux
- entorno de React Native / Expo configurado
- Xcode para iOS
- Android Studio para Android

## Variables de entorno

El proyecto valida configuracion con `zod` desde `env.ts`.

Variables relevantes:

```bash
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_IGDB_CLIENT_ID=
EXPO_PUBLIC_IGDB_CLIENT_SECRET=
EXPO_PUBLIC_ASSOCIATED_DOMAIN=
EXPO_PUBLIC_VAR_NUMBER=
EXPO_PUBLIC_VAR_BOOL=
```

### Notas sobre configuracion

- `EXPO_PUBLIC_APP_ENV` se controla principalmente por scripts (`development`, `preview`, `production`).
- `EXPO_PUBLIC_NAME`, `EXPO_PUBLIC_BUNDLE_ID`, `EXPO_PUBLIC_PACKAGE` y `EXPO_PUBLIC_SCHEME` se derivan automaticamente en `env.ts`.
- si ejecutas prebuilds estrictos, el proyecto usa `STRICT_ENV_VALIDATION=1`.

### Importante

Las credenciales de IGDB se leen hoy mediante variables `EXPO_PUBLIC_*`, lo que significa que terminan embebidas en el bundle de la app. Para un entorno de produccion serio, conviene evaluar un backend intermedio o una estrategia mas segura para proteger esos secretos.

## Instalacion

Clona el repositorio e instala dependencias:

```bash
git clone https://github.com/esarmiem/gamory.git
cd gamory
pnpm install
```

Crea tu archivo `.env` con las variables necesarias y luego ejecuta:

```bash
pnpm start
```

## Quick Start

### iOS

```bash
pnpm ios
```

### Android

```bash
pnpm android
```

### Web

```bash
pnpm web
```

## Scripts utiles

```bash
pnpm start
pnpm ios
pnpm android
pnpm web
pnpm lint
pnpm lint:fix
pnpm type-check
pnpm test
pnpm test:watch
pnpm check-all
pnpm doctor
```

### Scripts por entorno

```bash
pnpm start:preview
pnpm start:production
pnpm ios:preview
pnpm ios:production
pnpm android:preview
pnpm android:production
```

### Builds con EAS

```bash
pnpm build:development:ios
pnpm build:development:android
pnpm build:preview:ios
pnpm build:preview:android
pnpm build:production:ios
pnpm build:production:android
```

Los perfiles de build estan definidos en `eas.json` para:

- `development`
- `preview`
- `production`
- `simulator`

## Calidad y tooling

El repositorio ya incluye tooling para desarrollo y CI:

- ESLint
- TypeScript
- Jest
- Husky
- lint-staged
- commitlint
- GitHub Actions
- Maestro para e2e mobile

Workflows relevantes:

- lint
- type-check
- tests
- expo doctor
- EAS builds
- e2e Android

## Convenciones del proyecto

- Se usa `pnpm` como package manager.
- La app favorece estructura por features.
- Los imports internos usan alias `@/`.
- Las migraciones SQLite se resuelven sin depender de un backend.
- Los formularios complejos se fragmentan en pasos/componentes pequenos.
- Los componentes funcionales deben mantenerse compactos y legibles.

## Estado actual de Gamory

Hoy Gamory funciona como una app local-first para tracking personal de videojuegos:

- guarda el catalogo del usuario en SQLite;
- usa IGDB para enriquecer informacion del juego;
- permite gestionar juegos terminados y en curso;
- prioriza una UX simple, visual y rapida de usar.

## Roadmap sugerido

Estas son mejoras naturales para siguientes iteraciones:

- sincronizacion en la nube;
- exportacion o backup de biblioteca;
- login de usuario;
- listas personalizadas;
- filtros avanzados por genero, plataforma o anio;
- estadisticas personales de juego.

## Creditos

- Base inicial inspirada en [Obytes React Native Starter](https://starter.obytes.com)
- Metadata de videojuegos obtenida desde [IGDB](https://www.igdb.com/)

## Repositorio

- GitHub: [https://github.com/esarmiem/gamory](https://github.com/esarmiem/gamory)
