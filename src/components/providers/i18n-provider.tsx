'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { I18nContext, type I18nContextType } from '@/hooks/use-i18n';
import { messages, type Locale, type Messages } from '@/lib/i18n';
import { useAppStore } from '@/stores/app-store';

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useAppStore();

  const t = useCallback(
    (key: string): string => {
      const msgSet = messages[locale] || messages.en;
      return getNestedValue(msgSet, key);
    },
    [locale]
  );

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    messages,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
