'use client';

import { createContext, useContext } from 'react';
import { messages, type Locale, type Messages } from '@/lib/i18n';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
    }[keyof T & string]
  : never;

type MessageKey = NestedKeyOf<Messages['en']>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Return a fallback
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: (key: string) => {
        const keys = key.split('.');
        let current: unknown = messages.en;
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = (current as Record<string, unknown>)[k];
          } else {
            return key;
          }
        }
        return typeof current === 'string' ? current : key;
      },
      messages,
    };
  }
  return context;
}

export { I18nContext, type I18nContextType, type MessageKey };
