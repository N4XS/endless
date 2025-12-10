import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'product' | 'article';
  image?: string;
  structuredData?: object;
}

const BASE_URL = 'https://endless-tents.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export const SEO = ({
  title,
  description = 'Endless - Vendeur de rêves étoilés. Vente et location de tentes de toit premium en Belgique. Service d\'installation gratuit & garantie 1 an.',
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
  structuredData,
}: SEOProps) => {
  const fullTitle = title 
    ? `${title} | Endless - Tentes de Toit Belgique`
    : 'Endless - Tentes de Toit Premium | Vente & Location en Belgique';

  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Schema generators
export const generateProductSchema = (product: {
  name: string;
  description: string;
  price: number;
  image: string;
  sku?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.sku || 'STARZZ-001',
  brand: {
    '@type': 'Brand',
    name: 'Endless',
  },
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'EUR',
    availability: `https://schema.org/${product.availability || 'InStock'}`,
    seller: {
      '@type': 'Organization',
      name: 'Endless',
    },
    priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  },
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `https://endless-tents.com${item.url}`,
  })),
});

export const generateServiceSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Location de tentes de toit',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Endless',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue des Étoiles 15',
      addressLocality: 'Namur',
      postalCode: '5000',
      addressCountry: 'BE',
    },
  },
  areaServed: {
    '@type': 'Country',
    name: 'Belgique',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Location Weekend',
      price: 89,
      priceCurrency: 'EUR',
    },
    {
      '@type': 'Offer',
      name: 'Location Semaine',
      price: 199,
      priceCurrency: 'EUR',
    },
  ],
});
