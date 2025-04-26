import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ColorScheme, colorThemes } from "@/lib/themes";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  colorScheme: "default",
  setTheme: () => null,
  setColorScheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultColorScheme = "default",
  storageKey = "chatx-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-mode`) as Theme) || defaultTheme
  );
  
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => (localStorage.getItem(`${storageKey}-color`) as ColorScheme) || defaultColorScheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Clear all theme classes
    root.classList.remove("light", "dark");
    
    // Remove all color scheme classes
    root.classList.remove("theme-default", "theme-blue", "theme-green", "theme-red", "theme-purple", "theme-orange");
    
    // Add color scheme class
    root.classList.add(`theme-${colorScheme}`);
    
    // Determine and set dark/light mode
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
      
      // Apply color-specific CSS variables
      applyThemeColors(colorScheme, systemTheme);
      return;
    }
    
    root.classList.add(theme);
    
    // Apply color-specific CSS variables
    applyThemeColors(colorScheme, theme);
  }, [theme, colorScheme]);

  // Function to apply theme colors based on color scheme and mode (light/dark)
  const applyThemeColors = (colorScheme: ColorScheme, mode: "light" | "dark") => {
    const colors = colorThemes[colorScheme][mode];
    const root = window.document.documentElement;
    
    // Apply theme colors
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primary_foreground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondary_foreground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accent_foreground);
    root.style.setProperty("--ring", colors.ring);
  };

  const value = {
    theme,
    colorScheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(`${storageKey}-mode`, theme);
      setTheme(theme);
    },
    setColorScheme: (colorScheme: ColorScheme) => {
      localStorage.setItem(`${storageKey}-color`, colorScheme);
      setColorScheme(colorScheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
}; 