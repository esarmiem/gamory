const FONT_CLASS_PATTERN = /\bfont-(heading(?:-medium)?|sans(?:-medium|-semibold|-bold)?|normal|medium|semibold|bold)\b/g;

function hasToken(source: string, token: string) {
  return new RegExp(`(^|\\s)${token}(\\s|$)`).test(source);
}

export function stripFontClasses(className = '') {
  return className.replace(FONT_CLASS_PATTERN, ' ').replace(/\s+/g, ' ').trim();
}

export function resolveFontFamily(className = '', fallback: 'sans' | 'heading' = 'sans') {
  const source = className.trim();
  const group
    = hasToken(source, 'font-heading') || hasToken(source, 'font-heading-medium')
      ? 'heading'
      : fallback;

  let weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular';

  if (hasToken(source, 'font-heading-medium') || hasToken(source, 'font-sans-medium') || hasToken(source, 'font-medium')) {
    weight = 'medium';
  }
  else if (hasToken(source, 'font-sans-semibold') || hasToken(source, 'font-semibold')) {
    weight = 'semibold';
  }
  else if (hasToken(source, 'font-sans-bold') || hasToken(source, 'font-bold')) {
    weight = 'bold';
  }

  if (group === 'heading') {
    if (weight === 'medium')
      return 'SpaceGrotesk-Medium';

    return 'SpaceGrotesk-Bold';
  }

  if (weight === 'medium')
    return 'PlusJakartaSans-Medium';
  if (weight === 'semibold')
    return 'PlusJakartaSans-SemiBold';
  if (weight === 'bold')
    return 'PlusJakartaSans-Bold';

  return 'PlusJakartaSans-Regular';
}
