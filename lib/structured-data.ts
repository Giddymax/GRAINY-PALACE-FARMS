import { siteConfig } from "@/lib/site-config";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/grainy-palace-farms-seal.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressRegion: "Greater Accra",
      addressCountry: "GH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: "customer service",
      areaServed: "GH",
    },
    sameAs: Object.values(siteConfig.social),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    image: `${siteConfig.url}/brand/grainy-palace-farms-seal.png`,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    priceRange: "₵₵",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressRegion: "Greater Accra",
      addressCountry: "GH",
    },
  };
}

export function productJsonLd(product: {
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  price: number;
  isAvailable: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl ? [product.imageUrl] : undefined,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: "GHS",
      price: product.price.toFixed(2),
      availability: product.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  authorName: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : undefined,
    author: { "@type": "Person", name: article.authorName },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/brand/grainy-palace-farms-seal.png`,
      },
    },
    datePublished: article.publishedAt,
    mainEntityOfPage: `${siteConfig.url}/articles/${article.slug}`,
  };
}
