import type { TxKeyPath } from '@/lib/i18n';

import * as React from 'react';
import { Text, View } from '@/components/ui';

type Props = {
  children: React.ReactNode;
  title?: TxKeyPath;
};

export function SettingsContainer({ children, title }: Props) {
  return (
    <View className="mb-2">
      {title && (
        <Text className="pt-6 pb-3 font-heading text-xs font-bold tracking-[2px] text-muted-foreground uppercase dark:text-neutral-500" tx={title} />
      )}
      <View className="overflow-hidden rounded-[24px] bg-card dark:bg-charcoal-850">
        {children}
      </View>
    </View>
  );
}
