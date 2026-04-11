import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

export function MoreVertical({ color = '#6B7280', ...props }: SvgProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Circle cx="9" cy="3.75" r="1.25" fill={color} />
      <Circle cx="9" cy="9" r="1.25" fill={color} />
      <Circle cx="9" cy="14.25" r="1.25" fill={color} />
    </Svg>
  );
}
