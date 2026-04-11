import type { SvgProps } from 'react-native-svg';
import { Circle, Path, Svg } from 'react-native-svg';

export function PlayCircle({ color = '#F59E0B', ...props }: SvgProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Circle cx="12" cy="12" r="10" />
      <Path d="M10 8l6 4-6 4V8z" />
    </Svg>
  );
}
