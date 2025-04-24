export type ColorScheme = "blue" | "green" | "red" | "purple" | "orange" | "default";

export const colorSchemes: ColorScheme[] = ["default", "blue", "green", "red", "purple", "orange"];

// OKLCH color values for each theme
export const colorThemes = {
  // Default theme colors (neutral)
  default: {
    light: {
      primary: "oklch(0.205 0 0)",
      primary_foreground: "oklch(0.985 0 0)",
      secondary: "oklch(0.97 0 0)",
      secondary_foreground: "oklch(0.205 0 0)",
      accent: "oklch(0.97 0 0)",
      accent_foreground: "oklch(0.205 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      ring: "oklch(0.708 0 0)",
    },
    dark: {
      primary: "oklch(0.922 0 0)",
      primary_foreground: "oklch(0.205 0 0)",
      secondary: "oklch(0.269 0 0)",
      secondary_foreground: "oklch(0.985 0 0)",
      accent: "oklch(0.269 0 0)",
      accent_foreground: "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      ring: "oklch(0.556 0 0)",
    },
  },
  // Blue theme
  blue: {
    light: {
      primary: "oklch(0.55 0.2 240)",
      primary_foreground: "oklch(0.98 0 0)",
      secondary: "oklch(0.92 0.05 240)",
      secondary_foreground: "oklch(0.3 0.2 240)",
      accent: "oklch(0.9 0.1 240)",
      accent_foreground: "oklch(0.3 0.2 240)",
      destructive: "oklch(0.577 0.245 27.325)",
      ring: "oklch(0.65 0.15 240)",
    },
    dark: {
      primary: "oklch(0.7 0.2 240)",
      primary_foreground: "oklch(0.1 0 0)",
      secondary: "oklch(0.3 0.1 240)",
      secondary_foreground: "oklch(0.98 0 0)",
      accent: "oklch(0.35 0.15 240)",
      accent_foreground: "oklch(0.98 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      ring: "oklch(0.5 0.2 240)",
    },
  },
  // Green theme
  green: {
    light: {
      primary: "oklch(0.55 0.2 150)",
      primary_foreground: "oklch(0.98 0 0)",
      secondary: "oklch(0.92 0.05 150)",
      secondary_foreground: "oklch(0.3 0.2 150)",
      accent: "oklch(0.9 0.1 150)",
      accent_foreground: "oklch(0.3 0.2 150)",
      destructive: "oklch(0.577 0.245 27.325)",
      ring: "oklch(0.65 0.15 150)",
    },
    dark: {
      primary: "oklch(0.65 0.2 150)",
      primary_foreground: "oklch(0.1 0 0)",
      secondary: "oklch(0.3 0.1 150)",
      secondary_foreground: "oklch(0.98 0 0)",
      accent: "oklch(0.35 0.15 150)",
      accent_foreground: "oklch(0.98 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      ring: "oklch(0.5 0.2 150)",
    },
  },
  // Red theme
  red: {
    light: {
      primary: "oklch(0.55 0.25 25)",
      primary_foreground: "oklch(0.98 0 0)",
      secondary: "oklch(0.92 0.05 25)",
      secondary_foreground: "oklch(0.3 0.25 25)",
      accent: "oklch(0.9 0.1 25)",
      accent_foreground: "oklch(0.3 0.25 25)",
      destructive: "oklch(0.577 0.245 27.325)",
      ring: "oklch(0.65 0.2 25)",
    },
    dark: {
      primary: "oklch(0.65 0.25 25)",
      primary_foreground: "oklch(0.1 0 0)",
      secondary: "oklch(0.3 0.1 25)",
      secondary_foreground: "oklch(0.98 0 0)",
      accent: "oklch(0.35 0.15 25)",
      accent_foreground: "oklch(0.98 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      ring: "oklch(0.5 0.25 25)",
    },
  },
  // Purple theme
  purple: {
    light: {
      primary: "oklch(0.55 0.25 300)",
      primary_foreground: "oklch(0.98 0 0)",
      secondary: "oklch(0.92 0.05 300)",
      secondary_foreground: "oklch(0.3 0.25 300)",
      accent: "oklch(0.9 0.1 300)",
      accent_foreground: "oklch(0.3 0.25 300)",
      destructive: "oklch(0.577 0.245 27.325)",
      ring: "oklch(0.65 0.2 300)",
    },
    dark: {
      primary: "oklch(0.65 0.25 300)",
      primary_foreground: "oklch(0.1 0 0)",
      secondary: "oklch(0.3 0.1 300)",
      secondary_foreground: "oklch(0.98 0 0)",
      accent: "oklch(0.35 0.15 300)",
      accent_foreground: "oklch(0.98 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      ring: "oklch(0.5 0.25 300)",
    },
  },
  // Orange theme
  orange: {
    light: {
      primary: "oklch(0.55 0.25 60)",
      primary_foreground: "oklch(0.98 0 0)",
      secondary: "oklch(0.92 0.05 60)",
      secondary_foreground: "oklch(0.3 0.25 60)",
      accent: "oklch(0.9 0.1 60)",
      accent_foreground: "oklch(0.3 0.25 60)",
      destructive: "oklch(0.577 0.245 27.325)",
      ring: "oklch(0.65 0.2 60)",
    },
    dark: {
      primary: "oklch(0.65 0.25 60)",
      primary_foreground: "oklch(0.1 0 0)",
      secondary: "oklch(0.3 0.1 60)",
      secondary_foreground: "oklch(0.98 0 0)",
      accent: "oklch(0.35 0.15 60)",
      accent_foreground: "oklch(0.98 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      ring: "oklch(0.5 0.25 60)",
    },
  },
}; 