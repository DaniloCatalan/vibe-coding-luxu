"use client";

import React, { createContext, useContext } from "react";

// Helper to access nested object properties via dot notation (e.g., 'nav.buy')
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
};

interface TranslationContextType {
  dictionary: Record<string, any>;
  locale: string;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ 
  children, 
  dictionary,
  locale
}: { 
  children: React.ReactNode;
  dictionary: Record<string, any>;
  locale: string;
}) {
  const t = (key: string) => getNestedValue(dictionary, key);

  return (
    <TranslationContext.Provider value={{ dictionary, locale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
