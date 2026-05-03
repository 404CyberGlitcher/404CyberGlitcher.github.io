// ============================================
// COLORMART - CATALOG PAGE SCRIPT
// ============================================

import firebaseService from './config/firebase.js';
import skeletonLoader from './utils/skeletonLoader.js';
import discountCalculator from './utils/discountCalculator.js';
import seoManager from './utils/seo.js';

class CatalogPage {
    constructor() {
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.filters = {
            categories: [],
            brands: [],
            maxPrice: null,
            search: ''
        };
        this.sortBy = 'featured';
        this.allProducts = [];
        
        this.init();
    }

    async init() {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });

        this.parseURLParams();
        this.setupEventListeners();
        await this.loadProducts();
        this.setupSEO();
    }

    parseURLParams() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('category')) {
            this.filters.categories = [params.get('category')];
        }
        
        if (params.has('brand')) {
            this.filters.brands = [params.get('brand')];
        }
        
        if (params.has('search')) {
            this.filters.search = params.get('search');
        }
        
        if (params.has('sort')) {
            this.sortBy = params.get('sort');
        }
    }

    setupEventListeners() {
        // Category filters
        document.querySelectorAll('#category-filters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCategoryFilters();
                this.applyFilters();
            });
        });

        // Price range
        const priceRange = document.getElementById('price-range');
        const maxPriceDisplay = document.getElementById('max-price-display');
        
        priceRange?.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            maxPriceDisplay.textContent = `${ENV.SITE.currencySymbol} ${value.toLocaleString()}`;
        });

        priceRange?.addEventListener('change', (e) => {
            this.filters.maxPrice = parseInt(e.target.value);
            this.applyFilters();
        });

        // Sort
        document.getElementById('sort-select')?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });

        // Clear filters
        document.getElementById('clear-filters')?.addEventListener('click', () => {
            this.clearFilters();
        });

        // Search input
        const searchInput = document.getElementById('search-input');
        searchInput?.addEventListener('input', this.debounce(() => {
            this.filters.search = searchInput.value;
            this.applyFilters();
        }, 300));

        // Filter toggle for mobile
        document.getElementById('filter-toggle')?.addEventListener('click', () => {
            document.querySelector('.filters-sidebar')?.classList.toggle('active');
        });
    }

    updateCategoryFilters() {
        this.filters.categories = Array.from(
            document.querySelectorAll('#category-filters input:checked')
        ).map(cb => cb.value);
    }

    async loadProducts() {
        const grid = document.getElementById('catalog-products-grid');
        if (!grid) return;

        skeletonLoader.createGridSkeleton(grid, 8);

        try {
            this.allProducts = await firebaseService.getProducts();
            this.updateBrandFilters();
            this.applyFilters();
        } catch (error) {
            console.error('Error loading products:', error);
            skeletonLoader.removeSkeleton(grid);
            grid.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
        }
    }

    updateBrandFilters() {
        const brands = [...new Set(this.allProducts.map(p => p.brand).filter(Boolean))];
        const brandFiltersContainer = document.getElementById('brand-filters');
        
        if (brandFiltersContainer) {
            brandFiltersContainer.innerHTML = brands.map(brand => `
                <label class="filter-option">
                    <input type="checkbox" value="${brand}" 
                           ${this.filters.brands.includes(brand) ? 'checked' : ''}
                           onchange="catalogPage.updateBrandFilters()">
                    <span>${brand}</span>
                </label>
            `).join('');
        }
    }

    updateBrandFilters() {
        this.filters.brands = Array.from(
            document.querySelectorAll('#brand-filters input:checked')
        ).map(cb => cb.value);
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.allProducts];

        // Category filter
        if (this.filters.categories.length > 0) {
            filtered = filtered.filter(p => this.filters.categories.includes(p.category));
        }

        // Brand filter
        if (this.filters.brands.length > 0) {
            filtered = filtered.filter(p => this.filters.brands.includes(p.brand));
        }

        // Price filter
        if (this.filters.maxPrice) {
            filtered = filtered.filter(p => {
                const price = p.salePrice || p.originalPrice;
                return price <= this.filters.maxPrice;
            });
        }

        // Search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                (p.brand && p.brand.toLowerCase().includes(searchTerm)) ||
                (p.description && p.description.toLowerCase().includes(searchTerm))
            );
        }

        // Sort
        filtered = this.sortProducts(filtered);

        // Update results count
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.innerHTML = `Showing <span>${filtered.length}</span> products`;
        }

        // Paginate and render
        this.renderProducts(filtered);
        this.updatePagination(filtered.length);
    }

    sortProducts(products) {
        const sorted = [...products];
        
        switch (this.sortBy) {
            case 'price-low-high':
                sorted.sort((a, b) => (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice));
                break;
            case 'price-high-low':
                sorted.sort((a, b) => (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice));
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'alphabetical':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'best-selling':
                // If you have a sales count field, sort by that
                break;
            default: // featured
                break;
        }
        
        return sorted;
    }

    renderProducts(products) {
        const grid = document.getElementById('catalog-products-grid');
        if (!grid) return;

        skeletonLoader.removeSkeleton(grid);

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="no-products">
                    <h3>No Products Found</h3>
                    <p>Try adjusting your filters or search criteria.</p>
                </div>
            `;
            return;
        }

        const start = (this.currentPage - 1) * this.productsPerPage;
        const end = start + this.productsPerPage;
        const pageProducts = products.slice(start, end);

        grid.innerHTML = pageProducts.map(product => {
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
                            ${product.salePrice && product.salePrice < product.originalPrice ? `
                                <span class="product-card-original-price">
                                    ${ENV.SITE.currencySymbol} ${product.originalPrice.toLocaleString()}
                                </span>
                            ` : ''}
                        </div>
                        <button class="quick-add-btn" onclick="window.quickAddToCart('${product.id}')">
                            Quick Add
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updatePagination(totalProducts) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(totalProducts / this.productsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="catalogPage.changePage(${this.currentPage - 1})">
                ‹
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="${i === this.currentPage ? 'active' : ''}" 
                            onclick="catalogPage.changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<button disabled>...</button>';
            }
        }

        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="catalogPage.changePage(${this.currentPage + 1})">
                ›
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    changePage(page) {
        this.currentPage = page;
        this.applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    clearFilters() {
        this.filters = {
            categories: [],
            brands: [],
            maxPrice: null,
            search: ''
        };
        
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        const priceRange = document.getElementById('price-range');
        if (priceRange) priceRange.value = 10000;
        
        document.getElementById('max-price-display').textContent = `${ENV.SITE.currencySymbol} 10,000`;
        document.getElementById('sort-select').value = 'featured';
        
        this.currentPage = 1;
        this.applyFilters();
    }

    setupSEO() {
        seoManager.updatePageTitle('Product Catalog');
        seoManager.updateMetaDescription(
            `Browse our complete catalog of beauty, cosmetics, hair care, men's care, and organizer products at ${ENV.SITE.name}. Find your perfect products with easy filtering and sorting.`
        );
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize catalog page
const catalogPage = new CatalogPage();
window.catalogPage = catalogPage;
export default catalogPage;