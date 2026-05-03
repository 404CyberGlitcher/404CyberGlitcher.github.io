// SEO utilities for dynamic meta tags and structured data

/**
 * Update page meta tags dynamically
 * @param {Object} data - SEO data
 */
export const updateMetaTags = (data) => {
  const defaultData = {
    title: "ColorMart - Premium Beauty & Cosmetics | Makeup, Hair Care & More",
    description:
      "Shop authentic makeup, cosmetics, and beauty products at ColorMart. Free shipping on orders over Rs.2500. Best prices in Pakistan.",
    keywords:
      "ColorMart, Color Mart, makeup, beauty, cosmetics, hair care, skincare, Pakistan",
    image: "https://colormart.store/images/og-image.jpg",
    url: window.location.href,
  };

  const seoData = { ...defaultData, ...data };

  // Update title
  document.title = seoData.title;

  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", seoData.description);
  } else {
    metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content = seoData.description;
    document.head.appendChild(metaDescription);
  }

  // Update meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute("content", seoData.keywords);
  } else {
    metaKeywords = document.createElement("meta");
    metaKeywords.name = "keywords";
    metaKeywords.content = seoData.keywords;
    document.head.appendChild(metaKeywords);
  }

  // Update Open Graph tags
  updateOGTag("og:title", seoData.title);
  updateOGTag("og:description", seoData.description);
  updateOGTag("og:image", seoData.image);
  updateOGTag("og:url", seoData.url);
  updateOGTag("og:type", "product");

  // Update Twitter Card tags
  updateMetaTag("twitter:title", seoData.title);
  updateMetaTag("twitter:description", seoData.description);
  updateMetaTag("twitter:image", seoData.image);
  updateMetaTag("twitter:card", "summary_large_image");
};

/**
 * Helper to update Open Graph tags
 */
const updateOGTag = (property, content) => {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (tag) {
    tag.setAttribute("content", content);
  } else {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    tag.setAttribute("content", content);
    document.head.appendChild(tag);
  }
};

/**
 * Helper to update meta tags
 */
const updateMetaTag = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (tag) {
    tag.setAttribute("content", content);
  } else {
    tag = document.createElement("meta");
    tag.name = name;
    tag.content = content;
    document.head.appendChild(tag);
  }
};

/**
 * Generate product structured data (JSON-LD)
 * @param {Object} product - Product data
 */
export const addProductStructuredData = (product) => {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.[0] || "",
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "ColorMart",
    },
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "PKR",
      price: product.salePrice || product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "ColorMart",
      },
    },
    aggregateRating: product.averageRating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.averageRating,
          reviewCount: product.reviewCount || 0,
        }
      : undefined,
  };

  // Remove undefined fields
  Object.keys(structuredData).forEach(
    (key) => structuredData[key] === undefined && delete structuredData[key],
  );

  let script = document.querySelector("#product-structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "product-structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(structuredData);
};

/**
 * Add organization structured data
 */
export const addOrganizationStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ColorMart",
    url: "https://colormart.store",
    logo: "https://colormart.store/images/logo.png",
    sameAs: [
      "https://facebook.com/colormart",
      "https://instagram.com/colormart",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-300-1234567",
      contactType: "customer service",
      email: "hello@colormart.store",
    },
  };

  let script = document.querySelector("#organization-structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "organization-structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(structuredData);
};

/**
 * Add breadcrumb structured data
 * @param {Array} items - Breadcrumb items
 */
export const addBreadcrumbStructuredData = (items) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  let script = document.querySelector("#breadcrumb-structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "breadcrumb-structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(structuredData);
};
