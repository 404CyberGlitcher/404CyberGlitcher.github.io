// ============================================
// COLORMART - MAIN PAGE SCRIPT
// ============================================

import firebaseService from './config/firebase.js';
import skeletonLoader from './utils/skeletonLoader.js';
import discountCalculator from './utils/discountCalculator.js';
import seoManager from './utils/seo.js';

class MainPage {
    constructor() {
        this.init();
    }

    async init() {
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });

        // Initialize Swiper
        this.initHeroSlider();

        // Load content
        await this.loadCategories();
        await this.loadNewArrivals();
        await this.loadBestSellers();
        await this.loadReviews();

        // Setup SEO
        this.setupSEO();
    }

    setupSEO() {
        seoManager.updatePageTitle('Premium Beauty, Cosmetics & Lifestyle Products');
        seoManager.updateMetaDescription(
            `${ENV.SITE.name} - Your premier destination for beauty, cosmetics, and lifestyle products. Shop makeup, hair care, men's care, and organizers with free shipping on orders over ${ENV.SITE.currencySymbol} ${ENV.SITE.freeShippingThreshold.toLocaleString()}.`
        );
    }

    initHeroSlider() {
        new Swiper('.hero-slider', {
            slidesPerView: 1,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }

    async loadCategories() {
        const categoryGrid = document.getElementById('category-grid');
        if (!categoryGrid) return;

        const categories = [
            { name: 'Makeup', image: 'assets/images/category-makeup.jpg', slug: 'makeup' },
            { name: 'Hair Care', image: 'assets/images/category-hair-care.jpg', slug: 'hair-care' },
            { name: "Men's Care", image: 'assets/images/category-mens-care.jpg', slug: 'mens-care' },
            { name: 'Organizers', image: 'assets/images/category-organizers.jpg', slug: 'organizers' },
            { name: 'Essentials', image: 'assets/images/category-essentials.jpg', slug: 'essentials' }
        ];

        categoryGrid.innerHTML = categories.map(cat => `
            <a href="src/catalog.html?category=${cat.slug}" class="category-card" data-aos="fade-up">
                <img src="${cat.image}" alt="${cat.name}" onerror="this.src='assets/images/placeholder-product.jpg'">
                <div class="category-card-overlay">
                    <h3>${cat.name}</h3>
                </div>
            </a>
        `).join('');
    }

    async loadNewArrivals() {
        const grid = document.getElementById('new-arrivals-grid');
        if (!grid) return;

        skeletonLoader.createGridSkeleton(grid, 4);

        try {
            const products = await firebaseService.getProducts({ 
                limit: 8, 
                orderBy: 'createdAt', 
                order: 'desc' 
            });
            
            skeletonLoader.removeSkeleton(grid);
            this.renderProductGrid(grid, products);
        } catch (error) {
            console.error('Error loading new arrivals:', error);
            skeletonLoader.removeSkeleton(grid);
            grid.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
        }
    }

    async loadBestSellers() {
        const grid = document.getElementById('best-sellers-grid');
        if (!grid) return;

        skeletonLoader.createGridSkeleton(grid, 4);

        try {
            const products = await firebaseService.getProducts({ 
                limit: 8, 
                featured: true 
            });
            
            skeletonLoader.removeSkeleton(grid);
            this.renderProductGrid(grid, products);
        } catch (error) {
            console.error('Error loading best sellers:', error);
            skeletonLoader.removeSkeleton(grid);
            grid.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
        }
    }

    renderProductGrid(container, products) {
        if (!products.length) {
            container.innerHTML = '<p class="no-products">No products found.</p>';
            return;
        }

        container.innerHTML = products.map(product => {
            const badge = discountCalculator.getDiscountBadge(product);
            const currentPrice = product.salePrice || product.originalPrice;
            
            return `
                <div class="product-card" data-aos="fade-up">
                    <a href="src/product.html?id=${product.id}">
                        <div class="product-card-image">
                            <img src="${product.images?.[0] || 'assets/images/placeholder-product.jpg'}" 
                                 alt="${product.name}" 
                                 loading="lazy"
                                 onerror="this.src='assets/images/placeholder-product.jpg'">
                            ${badge ? `<span class="product-card-badge">${badge.text}</span>` : ''}
                        </div>
                    </a>
                    <div class="product-card-content">
                        <div class="product-card-brand">${product.brand || ''}</div>
                        <a href="src/product.html?id=${product.id}" class="product-card-title">
                            ${product.name}
                        </a>
                        <div class="product-card-price">
                            <span class="product-card-current-price">
                                ${ENV.SITE.currencySymbol} ${currentPrice.toLocaleString()}
                            </span>
                            ${product.salePrice && product.salePrice < product.originalPrice ? `
                                <span class="product-card-original-price">
                                    ${ENV.SITE.currencySymbol} ${product.originalPrice.toLocaleString()}
                                </span>
                                <span class="product-card-discount">
                                    -${badge.percentage}%
                                </span>
                            ` : ''}
                        </div>
                        <button class="quick-add-btn" onclick="quickAddToCart('${product.id}')">
                            Quick Add
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async loadReviews() {
        const reviewsGrid = document.getElementById('reviews-grid');
        if (!reviewsGrid) return;

        try {
            const reviews = await firebaseService.getReviews();
            
            if (reviews.length === 0) {
                reviewsGrid.innerHTML = '<p class="no-reviews">No reviews yet.</p>';
                return;
            }

            const displayReviews = reviews.slice(0, 6);
            
            reviewsGrid.innerHTML = displayReviews.map(review => `
                <div class="review-card" data-aos="fade-up">
                    <div class="review-header">
                        <div class="reviewer-avatar">
                            ${review.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="reviewer-info">
                            <h4>${review.name}</h4>
                            <div class="review-rating">
                                ${'⭐'.repeat(review.rating)}
                            </div>
                        </div>
                    </div>
                    <p class="review-text">${review.text}</p>
                    ${review.productName ? `<p class="review-product">On: ${review.productName}</p>` : ''}
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading reviews:', error);
            reviewsGrid.innerHTML = '<p class="error-message">Failed to load reviews.</p>';
        }
    }
}

// Quick add to cart function
window.quickAddToCart = async function(productId) {
    try {
        const product = await firebaseService.getProductById(productId);
        if (product) {
            window.addToCart({
                id: product.id,
                name: product.name,
                price: product.salePrice || product.originalPrice,
                originalPrice: product.originalPrice,
                images: product.images
            });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};

// Initialize main page
document.addEventListener('DOMContentLoaded', () => {
    new MainPage();
});