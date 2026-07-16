import { createContext, useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const SEOContext = createContext();

const defaultSEO = {
  title: "Nike Legado | Oficial",
  description: "La tienda oficial de la cultura y legado Nike.",
  keywords: "nike, zapatillas, sneakers, legado, streetwear",
  ogTitle: "Nike Legado | Streetwear & Sneakers",
  ogImage: "https://nike-legado.vercel.app/social-share.jpg",
  twitterCard: "summary_large_image",
  robots: "index, follow",
  themeColor: "#000000"
};

export function SEOProvider({ children }) {
  const [seoConfig, setSeoConfig] = useState(() => {
    const saved = localStorage.getItem("nike_seo_v2");
    // Fallback migration strategy for older version
    const oldSaved = localStorage.getItem("nike_seo");
    if (saved) return JSON.parse(saved);
    if (oldSaved) return { ...defaultSEO, ...JSON.parse(oldSaved) };
    return defaultSEO;
  });

  useEffect(() => {
    localStorage.setItem("nike_seo_v2", JSON.stringify(seoConfig));
  }, [seoConfig]);

  return (
    <SEOContext.Provider value={{ seoConfig, setSeoConfig }}>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        <meta name="robots" content={seoConfig.robots} />
        <meta name="theme-color" content={seoConfig.themeColor} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoConfig.ogTitle || seoConfig.title} />
        <meta property="og:description" content={seoConfig.description} />
        <meta property="og:image" content={seoConfig.ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content={seoConfig.twitterCard} />
        <meta name="twitter:title" content={seoConfig.ogTitle || seoConfig.title} />
        <meta name="twitter:description" content={seoConfig.description} />
        <meta name="twitter:image" content={seoConfig.ogImage} />
      </Helmet>
      {children}
    </SEOContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSEO = () => useContext(SEOContext);
