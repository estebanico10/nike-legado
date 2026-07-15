import { createContext, useContext, useState, useEffect } from "react";
import defaultEn from "../locales/en.json";

const LangContext = createContext();

// Mock base ES translation from the EN keys
const defaultEs = Object.keys(defaultEn).reduce((acc, key) => {
  acc[key] = defaultEn[key]; // Starts as english, editable in admin
  return acc;
}, {});
defaultEs["header.shop"] = "Tienda";
defaultEs["header.about"] = "Nosotros";
defaultEs["header.customize"] = "Personalizar";
defaultEs["hero.title"] = "EL LEGADO CONTINÚA";
defaultEs["hero.subtitle"] = "Redefiniendo el streetwear con clásicos modernos y visión de futuro.";
defaultEs["hero.cta"] = "Comprar Novedades";

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("nike_lang") || "es");
  const [translations, setTranslations] = useState(() => {
    const saved = localStorage.getItem("nike_translations");
    return saved ? JSON.parse(saved) : { en: defaultEn, es: defaultEs };
  });

  useEffect(() => {
    localStorage.setItem("nike_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("nike_translations", JSON.stringify(translations));
  }, [translations]);

  const t = (key) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, translations, setTranslations, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
