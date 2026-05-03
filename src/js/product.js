// ============================================
// COLORMART - PRODUCT DETAIL PAGE SCRIPT
// ============================================

import firebaseService from './config/firebase.js';
import reviewSystem from './components/reviewSystem.js';
import discountCalculator from './utils/discountCalculator.js';
import seoManager from './utils/seo.js';
import skeletonLoader from './utils/skeletonLoader.js';

class ProductPage {
    constructor() {
        this.productId = null;
        this.product = null;
        
        this.init();
    }

    async init() {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });

        this.productId = this.getProductIdFromURL();
        
        if (!this.productId) {
            this.showError('Product not found');
            return;
        }

        await this.loadProduct();
        this.setupEventListeners();
    }

    getProductIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async loadProduct() {
        try {
            this.product = await firebaseService.getProductById(this.productId);
            
            if (!this.product) {
                this.showError('Product not found');
                return;
            }

            this.renderProduct();
            this.setupSEO();
            await this.loadRelatedProducts();
            await reviewSystem.loadReviews(this.productId, 'reviews-list');
        } catch (error) {
            console.error('Error loading product:', error);
            this.showError('Failed to load product details');
        }
    }

    renderProduct() {
        // Update breadcrumb
        document.getElementById('product-name-breadcrumb').textContent = this.product.name;

        // Update product images
        this.renderProductGallery();

        // Update product info
        document.getElementById('product-brand').textContent = this.product.brand || '';
        document.getElementById('product-title').textContent = this.product.name;
        document.getElementById('product-category').textContent = this.product.category;
        
        // Update price
        const currentPrice = this.product.salePrice || this.product.originalPrice;
        const priceHTML = this.product.salePrice && this.product.salePrice < this.product.originalPrice
            ? `
                <span class="current-price">${ENV.SITE.currencySymbol} ${currentPrice.toLocaleString()}</span>
                <span class="original-price">${ENV.SITE.currencySymbol} ${this.product.originalPrice.toLocaleString()}</span>
                <span class="discount-badge">-${discountCalculator.getDiscountBadge(this.product).percentage}% OFF</span>
            `
            : `
                <span class="current-price">${ENV.SITE.currencySymbol} ${currentPrice.toLocaleString()}</span>
            `;
        
        document.getElementById('product-price').innerHTML = priceHTML;
        document.getElementById('product-description').textContent = this.product.description || '';
        document.getElementById('full-description').textContent = this.product.description || '';

        // Update availability
        const availabilityEl = document.getElementById('product-availability');
        if (this.product.stock > 0) {
            availabilityEl.textContent = 'In Stock';
            availabilityEl.className = 'in-stock';
        } else {
            availabilityEl.textContent = 'Out of Stock';
            availabilityEl.className = 'out-of-stock';
            document.getElementById('add-to-cart-btn').disabled = true;
            document.getElementById('buy-now-btn').disabled = true;
        }
    }

    renderProductGallery() {
        const images = this.product.images || ['../assets/images/placeholder-product.jpg'];
        const galleryWrapper = document.getElementById('product-gallery-wrapper');
        const thumbnailGallery = document.getElementById('thumbnail-gallery');

        if (!galleryWrapper) return;

        galleryWrapper.innerHTML = images.map(img => `
            <div class="swiper-slide">
                <img src="${img}" alt="${this.product.name}" loading="lazy">
            </div>
        `).join('');

        if (thumbnailGallery) {
            thumbnailGallery.innerHTML = images.map((img, index) => `
                <img src="${img}" 
                     alt="${this.product.name} thumbnail ${index + 1}" 
                     class="${index === 0 ? 'active' : ''}"
                     onclick="productPage.goToSlide(${index})">
            `).join('');
        }

        // Initialize Swiper
        this.swiper = new Swiper('.product-gallery', {
            slidesPerView: 1,
            loop: images.length > 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });

        this.swiper.on('slideChange', () => {
            const activeIndex = this.swiper.realIndex;
            document.querySelectorAll('.thumbnail-gallery img').forEach((thumb, index) => {
                thumb.classList.toggle('active', index === activeIndex);
            });
        });
    }

    goToSlide(index) {
        this.swiper?.slideTo(index);
    }

    setupEventListeners() {
        // Quantity controls
        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const quantityInput = document.getElementById('quantity');

        decreaseBtn?.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        increaseBtn?.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });

        quantityInput?.addEventListener('change', () => {
            const value = parseInt(quantityInput.value);
            if (value < 1) quantityInput.value = 1;
            if (value > 10) quantityInput.value = 10;
        });

        // Add to cart
        document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
            if (this.product) {
                const quantity = parseInt(document.getElementById('quantity').value) || 1;
                window.addToCart({
                    id: this.product.id,
                    name: this.product.name,
                    price: this.product.salePrice || this.product.originalPrice,
                    originalPrice: this.product.originalPrice,
                    images: this.product.images,
                    quantity
                });
            }
        });

        // Buy now
        document.getElementById('buy-now-btn')?.addEventListener('click', () => {
            if (this.product) {
                const quantity = parseInt(document.getElementById('quantity').value) || 1;
                window.addToCart({
                    id: this.product.id,
                    name: this.product.name,
                    price: this.product.salePrice || this.product.originalPrice,
                    originalPrice: this.product.originalPrice,
                    images: this.product.images,
                    quantity
                });
                window.location.href = 'checkout.html';
            }
        });

        // Tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                
                // Toggle active class on buttons
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                // Toggle active class on content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabName}-tab`)?.classList.add('active');
            });
        });

        // Review form
        document.getElementById('review-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitReview();
        });
    }

    async submitReview() {
        const name = document.getElementById('reviewer-name').value.trim();
        const email = document.getElementById('reviewer-email').value.trim();
        const ratingInput = document.querySelector('input[name="rating"]:checked');
        const text = document.getElementById('review-text').value.trim();

        if (!name || !email || !ratingInput || !text) {
            alert('Please fill in all required fields');
            return;
        }

        const rating = parseInt(ratingInput.value);

        const result = await reviewSystem.submitReview(this.productId, {
            name,
            email,
            rating,
            text
        });

        alert(result.message);
    }

    async loadRelatedProducts() {
        const grid = document.getElementById('related-products-grid');
        if (!grid) return;

        skeletonLoader.createGridSkeleton(grid, 4);

        try {
            const products = await firebaseService.getProducts({
                category: this.product.category,
                limit: 4
            });

            // Filter out current product
            const related = products
                .filter(p => p.id !== this.productId)
                .slice(0, 4);

            skeletonLoader.removeSkeleton(grid);

            if (related.length === 0) {
                grid.innerHTML = '<p>No related products found.</p>';
                return;
            }

            grid.innerHTML = related.map(product => {
                const badge = discountCalculator.getDiscountBadge(product);
                const currentPrice = product.salePrice || product.originalPrice;

                return `
                    <div class="product-card" data-aos="fade-up">
                        <a href="product.html?id=${product.id}">
                            <div class="product-card-image">
                                <img src="${product.images?.[0] || '../assets/images/placeholder-product.jpg'}" 
                                     alt="${product.name}" 
                                     loading="lazy"
                                     onerror="this.src='../assets/images/placeholder-product.jpg'">
                                ${badge ? `<span class="product-card-badge">${badge.text}</span>` : ''}
                            </div>
                        </a>
                        <div class="product-card-content">
                            <div class="product-card-brand">${product.brand || ''}</div>
                            <a href="product.html?id=${product.id}" class="product-card-title">
                                ${product.name}
                            </a>
                            <div class="product-card-price">
                                <span class="product-card-current-price">
                                    ${ENV.SITE.currencySymbol} ${currentPrice.toLocaleString()}
                                </span>
                            </div>
                            <button class="quick-add-btn" onclick="window.quickAddToCart('${product.id}')">
                                Quick Add
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading related products:', error);
            skeletonLoader.removeSkeleton(grid);
            grid.innerHTML = '<p>Failed to load related products.</p>';
        }
    }

    setupSEO() {
        if (!this.product) return;
        seoManager.updateProductSEO(this.product);
    }

    showError(message) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="container" style="text-align: center; padding: 4rem 0;">
                    <h2>${message}</h2>
                    <a href="catalog.html" class="cta-button">Browse Products</a>
                </div>
            `;
        }
    }
}

// Initialize product page
const productPage = new ProductPage();
window.productPage = productPage;
export default productPage;