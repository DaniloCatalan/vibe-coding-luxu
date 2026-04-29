import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import { getLocale, getDictionary } from "@/lib/i18n/server";
import { TranslationProvider } from "@/lib/i18n/TranslationContext";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Luxe Estate - Premium Real Estate",
  description: "Find your sanctuary with Luxe Estate.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className="h-full antialiased font-display">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body 
        className="min-h-full flex flex-col bg-background-light text-nordic-dark selection:bg-mosque selection:text-white"
        suppressHydrationWarning
      >
        <AuthProvider>
          <TranslationProvider dictionary={dictionary} locale={locale}>
            <Navbar />
            {children}
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
