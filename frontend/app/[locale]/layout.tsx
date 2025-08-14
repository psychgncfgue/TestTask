import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import '../styles/phone-dropdown-overrides.css'
import Providers from "../providers/providers";
import ThemeRegistry from "../ThemeRegistry";
import { dir } from 'i18next';
import { Locale, locales } from "../constants/locales";
import { cookies } from "next/headers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyMovies",
  description: "Управляйте своими фильмами и сериалами в одном месте!",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('themeMode')?.value === 'dark' ? 'dark' : 'light';
  let { locale } = await params
  locale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers initialTheme={theme} locale={locale}>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </Providers>
      </body>
    </html>
  );
}