export type WelcomeSlideContent = {
  id: string;
  query: string;
  badge: string;
  title: string;
  description: string;
};

export type WelcomeSlide = WelcomeSlideContent & {
  imageUrl: string | number | null;
};
