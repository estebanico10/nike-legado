import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const defaultTheme = {
  volt: "#CEFF00",
  canvas: "#FFFFFF",
  ink: "#111111",
  displayFont: '"Oswald", "Barlow Condensed", sans-serif'
};

export function ThemeProvider({ children }) {
  const [themeSettings, setThemeSettings] = useState(() => {
    const saved = localStorage.getItem("nike_theme");
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("nike_theme", JSON.stringify(themeSettings));
    const root = document.documentElement;
    root.style.setProperty("--color-volt", themeSettings.volt);
    root.style.setProperty("--color-canvas", themeSettings.canvas);
    root.style.setProperty("--color-ink", themeSettings.ink);
    root.style.setProperty("--font-display", themeSettings.displayFont);
  }, [themeSettings]);

  return (
    <ThemeContext.Provider value={{ themeSettings, setThemeSettings, defaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
