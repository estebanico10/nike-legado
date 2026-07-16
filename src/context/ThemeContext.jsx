import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const defaultTheme = {
  light: {
    volt: "#CEFF00",
    canvas: "#FAFAFA",
    canvasAlt: "#F5F5F5",
    canvasNav: "rgba(255, 255, 255, 0.80)",
    ink: "#111111",
    inkSoft: "#757575",
    inkMuted: "#CCCCCC",
    surface: "#FFFFFF"
  },
  dark: {
    volt: "#CEFF00",
    canvas: "#060606",
    canvasAlt: "#1A1A1A",
    canvasNav: "rgba(17, 17, 17, 0.80)",
    ink: "#FFFFFF",
    inkSoft: "#A0A0A0",
    inkMuted: "#3A3A3A",
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

    const savedV2 = localStorage.getItem("nike_theme_v2");
    if (savedV2) {
      const parsed = JSON.parse(savedV2);
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
    root.style.setProperty("--color-volt-light", themeSettings.light.volt || defaultTheme.light.volt);
    root.style.setProperty("--color-canvas-light", themeSettings.light.canvas || defaultTheme.light.canvas);
    root.style.setProperty("--color-canvas-alt-light", themeSettings.light.canvasAlt || defaultTheme.light.canvasAlt);
    root.style.setProperty("--color-canvas-nav-light", themeSettings.light.canvasNav || defaultTheme.light.canvasNav);
    root.style.setProperty("--color-ink-light", themeSettings.light.ink || defaultTheme.light.ink);
    root.style.setProperty("--color-ink-soft-light", themeSettings.light.inkSoft || defaultTheme.light.inkSoft);
    root.style.setProperty("--color-ink-muted-light", themeSettings.light.inkMuted || defaultTheme.light.inkMuted);
    root.style.setProperty("--color-surface-light", themeSettings.light.surface || defaultTheme.light.surface);

    // Dark variables
    root.style.setProperty("--color-volt-dark", themeSettings.dark.volt || defaultTheme.dark.volt);
    root.style.setProperty("--color-canvas-dark", themeSettings.dark.canvas || defaultTheme.dark.canvas);
    root.style.setProperty("--color-canvas-alt-dark", themeSettings.dark.canvasAlt || defaultTheme.dark.canvasAlt);
    root.style.setProperty("--color-canvas-nav-dark", themeSettings.dark.canvasNav || defaultTheme.dark.canvasNav);
    root.style.setProperty("--color-ink-dark", themeSettings.dark.ink || defaultTheme.dark.ink);
    root.style.setProperty("--color-ink-soft-dark", themeSettings.dark.inkSoft || defaultTheme.dark.inkSoft);
    root.style.setProperty("--color-ink-muted-dark", themeSettings.dark.inkMuted || defaultTheme.dark.inkMuted);
    root.style.setProperty("--color-surface-dark", themeSettings.dark.surface || defaultTheme.dark.surface);

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
