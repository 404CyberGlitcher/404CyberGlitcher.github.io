// ============================================
// COLORMART - SEO UTILITY
// ============================================

class SEOManager {
    updatePageTitle(title) {
        document.title = `${title} - ${ENV.SITE.name}`;
    }

    updateMetaDescription(description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', description);
    }

    updateMetaKeywords(keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords);
    }

    updateOGTags(title, description, image = '', url = '') {
        this.updateMetaProperty('og:title', title);
        this.updateMetaProperty('og:description', description);
        this.updateMetaProperty('og:image', image || 'https://colormart.store/assets/images/og-image.jpg');
        this.updateMetaProperty('og:url', url || window.location.href);
        this.updateMetaProperty('og:type', 'website');
        this.updateMetaProperty('og:site_name', ENV.SITE.name);
    }

    updateTwitterCard(title, description, image = '') {
        this.updateMetaName('twitter:card', 'summary_large_image');
        this.updateMetaName('twitter:title', title);
        this.updateMetaName('twitter:description', description);
        this.updateMetaName('twitter:image', image || 'https://colormart.store/assets/images/og-image.jpg');
    }

    updateCanonicalURL(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', url);
    }

    updateMetaProperty(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    updateMetaName(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    updateProductSEO(product) {
        const title = product.name;
        const description = `Buy ${product.name} online at ${ENV.SITE.name}. ${product.description?.substring(0, 150)}...`;
        const keywords = `${product.name}, ${product.category}, ${product.brand}, beauty products, cosmetics, ${ENV.SITE.name}`;

        this.updatePageTitle(title);
        this.updateMetaDescription(description);
        this.updateMetaKeywords(keywords);
        this.updateOGTags(title, description, product.images?.[0], window.location.href);
        this.updateTwitterCard(title, description, product.images?.[0]);
        this.updateCanonicalURL(window.location.href);

        // Add structured data for product
        this.addProductStructuredData(product);
    }

    addProductStructuredData(product) {
        const structuredData = {
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            image: product.images || [],
            description: product.description,
            brand: {
                '@type': 'Brand',
                name: product.brand
            },
            offers: {
                '@type': 'Offer',
                priceCurrency: ENV.SITE.currency,
                price: product.salePrice || product.originalPrice,
                availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            }
        };

        if (product.reviews?.length) {
            structuredData.aggregateRating = {
                '@type': 'AggregateRating',
                ratingValue: this.calculateAverageRating(product.reviews),
                reviewCount: product.reviews.length
            };
        }

        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData);
    }

    calculateAverageRating(reviews) {
        if (!reviews.length) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    generateBreadcrumbSchema(items) {
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.url
            }))
        };
    }
}

const seoManager = new SEOManager();
export default seoManager;