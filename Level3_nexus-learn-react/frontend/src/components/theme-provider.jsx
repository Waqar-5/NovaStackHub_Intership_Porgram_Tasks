import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the app with next-themes so we get dark / light / system theme
 * switching with the class strategy (adds/removes `.dark` on <html>),
 * matching the tokens defined in app/globals.css.
 */
export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
