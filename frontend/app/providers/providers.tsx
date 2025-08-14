'use client';

import { makeStore } from "../redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useMemo } from "react";
import I18nProvider from "./I18nProvider";

export default function Providers({
  children,
  initialTheme,
  locale,
}: {
  children: ReactNode;
  initialTheme: 'light' | 'dark';
  locale: string;
}) {
  const store = useMemo(
    () =>
      makeStore({
        theme: { mode: initialTheme },
      }),
    [initialTheme]
  );

  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <I18nProvider locale={locale}>
          {children}
        </I18nProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}