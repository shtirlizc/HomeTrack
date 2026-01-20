import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/common/dark-mode/theme-provider";
import Script from "next/script";
import { env } from "prisma/config";

import "./globals.css";

const yandexApiKey = env("YANDEX_API_KEY");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "ИЖС Уфа",
  description: "ИЖС Уфа",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <Script
          strategy="beforeInteractive"
          src={`https://api-maps.yandex.ru/v3/?apikey=${yandexApiKey}&lang=ru_RU`}
        />
      </body>
    </html>
  );
}
