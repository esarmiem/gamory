import { useCallback, useState } from 'react';

import { hasExistingLocalDatabase } from '../db';
import { storage } from '../storage';

const IS_FIRST_TIME = 'IS_FIRST_TIME';

export function useIsFirstTime() {
  const [isFirstTime, setIsFirstTimeState] = useState<boolean>(() => {
    const storedValue = storage.getBoolean(IS_FIRST_TIME);
    if (storedValue !== undefined)
      return storedValue;

    const defaultValue = !hasExistingLocalDatabase();
    storage.set(IS_FIRST_TIME, defaultValue);
    return defaultValue;
  });

  const setIsFirstTime = useCallback((value: boolean) => {
    storage.set(IS_FIRST_TIME, value);
    setIsFirstTimeState(value);
  }, []);

  return [isFirstTime, setIsFirstTime] as const;
}
