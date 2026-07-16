import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, image, url }) {
  const defaultTitle = "Nike Legado | El ADN de la Pasión";
  const defaultDescription = "El verdadero gol no se marcó en un gran estadio, sino en una cancha improvisada de tierra. Streetwear ecuatoriano y herencia andina.";
  const defaultImage = "https://tu-dominio.com/assets/og-image.jpg"; // Placeholder
  const defaultUrl = "https://tu-dominio.com"; // Placeholder

  const seoTitle = title ? `${title} | Nike Legado` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || defaultUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />
    </Helmet>
  );
}
