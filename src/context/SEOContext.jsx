import { createContext, useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const SEOContext = createContext();

const defaultSEO = {
  title: "Nike Legado | Oficial",
  description: "La tienda oficial de la cultura y legado Nike.",
  keywords: "nike, zapatillas, sneakers, legado, streetwear"
};

export function SEOProvider({ children }) {
  const [seoConfig, setSeoConfig] = useState(() => {
    const saved = localStorage.getItem("nike_seo");
    return saved ? JSON.parse(saved) : defaultSEO;
  });

  useEffect(() => {
    localStorage.setItem("nike_seo", JSON.stringify(seoConfig));
  }, [seoConfig]);

  return (
    <SEOContext.Provider value={{ seoConfig, setSeoConfig }}>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
      </Helmet>
      {children}
    </SEOContext.Provider>
  );
}

export const useSEO = () => useContext(SEOContext);
