import type { WelcomeSlide, WelcomeSlideContent } from './types';
import { useMemo } from 'react';

const welcomeSlidesContent: WelcomeSlideContent[] = [
  {
    id: 'mario',
    query: 'Mario',
    badge: 'Bienvenido a Gamory',
    title: 'Guarda tus aventuras completadas',
    description: 'Registra cada juego que termines, dale una calificación y construye tu historial gamer personal.',
  },
  {
    id: 'gta',
    query: 'GTA',
    badge: 'Tu progreso en un lugar',
    title: 'Lleva control de lo que juegas ahora',
    description: 'Agrega juegos en curso para no perderles la pista y mantener tu backlog organizado.',
  },
  {
    id: 'silksong',
    query: 'Silksong',
    badge: 'Tu biblioteca gamer',
    title: 'Explora, reseña y descubre',
    description: 'Busca en la biblioteca de juegos disponibles, agrega reseñas y comparte tu criterio como jugador.',
  },
];

export function useWelcomeSlides() {
  const slides = useMemo<WelcomeSlide[]>(
    () => [
      { ...welcomeSlidesContent[0], imageUrl: require('../../../assets/mario.jpg') },
      { ...welcomeSlidesContent[1], imageUrl: require('../../../assets/gta.png') },
      { ...welcomeSlidesContent[2], imageUrl: require('../../../assets/silksong.png') },
    ],
    [],
  );

  const hasAnyImage = useMemo(() => slides.some(slide => slide.imageUrl), [slides]);

  return {
    slides,
    isLoading: false,
    error: null,
    hasAnyImage,
  };
}
