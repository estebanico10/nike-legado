import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const defaultTheme = {
  volt: "#CEFF00",
  canvas: "#060606",
  ink: "#FFFFFF",
  surface: "#111111",
  displayFont: '"Oswald", "Barlow Condensed", sans-serif',
  bodyFont: '"Inter", "Helvetica Neue", sans-serif',
  borderRadius: "0px",
  buttonStyle: "solid"
};

export function ThemeProvider({ children }) {
  const [themeSettings, setThemeSettings] = useState(() => {
    const saved = localStorage.getItem("nike_theme_v2");
    const oldSaved = localStorage.getItem("nike_theme");
    
    if (saved) return JSON.parse(saved);
    if (oldSaved) return { ...defaultTheme, ...JSON.parse(oldSaved) };
    return defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("nike_theme_v2", JSON.stringify(themeSettings));
    const root = document.documentElement;
    root.style.setProperty("--color-volt", themeSettings.volt);
    root.style.setProperty("--color-canvas", themeSettings.canvas);
    root.style.setProperty("--color-ink", themeSettings.ink);
    root.style.setProperty("--color-surface", themeSettings.surface || "#111");
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

export const useTheme = () => useContext(ThemeContext);
