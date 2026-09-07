"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider storageKey="acolher_theme_mode_v1" {...props}>
      {children}
    </NextThemesProvider>
  );
}
