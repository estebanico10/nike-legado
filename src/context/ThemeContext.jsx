import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const defaultTheme = {
  light: {
    volt: "#CEFF00",
    canvas: "#FAFAFA",
    ink: "#111111",
    surface: "#FFFFFF"
  },
  dark: {
    volt: "#CEFF00",
    canvas: "#060606",
    ink: "#FFFFFF",
    surface: "#111111"
  },
  displayFont: '"Oswald", "Barlow Condensed", sans-serif',
  bodyFont: '"Inter", "Helvetica Neue", sans-serif',
  borderRadius: "0px",
  buttonStyle: "solid"
};

export function ThemeProvider({ children }) {
  const [themeSettings, setThemeSettings] = useState(() => {
    const saved = localStorage.getItem("nike_theme_v3");
    if (saved) return JSON.parse(saved);

    // Migración desde V2 o anterior
    const savedV2 = localStorage.getItem("nike_theme_v2");
    if (savedV2) {
      const parsed = JSON.parse(savedV2);
      // Si tiene estructura vieja (sin light/dark)
      if (parsed.volt && !parsed.light) {
        return {
          ...defaultTheme,
          light: { ...defaultTheme.light, volt: parsed.volt },
          dark: { ...defaultTheme.dark, volt: parsed.volt, canvas: parsed.canvas, ink: parsed.ink, surface: parsed.surface },
          displayFont: parsed.displayFont || defaultTheme.displayFont,
          bodyFont: parsed.bodyFont || defaultTheme.bodyFont,
          borderRadius: parsed.borderRadius || defaultTheme.borderRadius,
          buttonStyle: parsed.buttonStyle || defaultTheme.buttonStyle,
        };
      }
      return { ...defaultTheme, ...parsed };
    }
    
    return defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("nike_theme_v3", JSON.stringify(themeSettings));
    const root = document.documentElement;
    
    // Light variables
    root.style.setProperty("--color-volt-light", themeSettings.light.volt);
    root.style.setProperty("--color-canvas-light", themeSettings.light.canvas);
    root.style.setProperty("--color-ink-light", themeSettings.light.ink);
    root.style.setProperty("--color-surface-light", themeSettings.light.surface);

    // Dark variables
    root.style.setProperty("--color-volt-dark", themeSettings.dark.volt);
    root.style.setProperty("--color-canvas-dark", themeSettings.dark.canvas);
    root.style.setProperty("--color-ink-dark", themeSettings.dark.ink);
    root.style.setProperty("--color-surface-dark", themeSettings.dark.surface);

    // Global settings
    root.style.setProperty("--font-display", themeSettings.displayFont);
    root.style.setProperty("--font-body", themeSettings.bodyFont);
    root.style.setProperty("--border-radius", themeSettings.borderRadius);
    root.style.setProperty("--btn-style", themeSettings.buttonStyle);
  }, [themeSettings]);

  return (
    <ThemeContext.Provider value={{ themeSettings, setThemeSettings, defaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
