import type { TxKeyPath } from '@/lib/i18n';

import * as React from 'react';
import { Text, View } from '@/components/ui';

type Props = {
  children: React.ReactNode;
  title?: TxKeyPath;
};

export function SettingsContainer({ children, title }: Props) {
  return (
    <>
      {title && (
        <Text className="pt-6 pb-3 font-heading text-xs font-bold tracking-[2px] text-neutral-500 uppercase" tx={title} />
      )}
      <View className="overflow-hidden rounded-[24px] bg-white">
        {children}
      </View>
    </>
  );
}
