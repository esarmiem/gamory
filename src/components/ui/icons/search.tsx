import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function Search({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Circle cx="9.167" cy="9.167" r="5.833" stroke={color} strokeWidth="1.6" />
      <Path
        d="M13.286 13.286L16.667 16.667"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}
