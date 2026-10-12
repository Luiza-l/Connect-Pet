"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  scriptProps,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const tipoScript = typeof window === "undefined" ? "text/javascript" : "text/plain";

  return (
    <NextThemesProvider
      storageKey="acolher_theme_mode_v1"
      scriptProps={{ ...scriptProps, type: tipoScript }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
