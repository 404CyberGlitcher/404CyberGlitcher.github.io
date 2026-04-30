// Products Data and Functionality - Anas Plastic Enterprises

// Product Database
const products = [
    {
        id: 1,
        name: 'Crystal Clear Cream Jar 50ml',
        category: 'cream-containers',
        description: 'Premium crystal-clear plastic jar perfect for facial creams, whitening creams, and moisturizers. Features a secure screw cap and elegant design.',
        images: ['assets/img/products/crystal-jar-50ml.png', 'assets/img/products/crystal-jar-50ml-2.png'],
        rating: 4.8,
        badge: 'Best Seller',
        specifications: {
            'Capacity': '50ml',
            'Material': 'PET Plastic',
            'Color': 'Crystal Clear',
            'Cap Type': 'Screw Cap',
            'Height': '65mm',
            'Diameter': '45mm'
        }
    },
    {
        id: 2,
        name: 'Luxury Gold Cap Jar 100ml',
        category: 'cream-containers',
        description: 'Elegant 100ml jar with luxurious gold cap. Ideal for premium skincare products, night creams, and anti-aging formulations.',
        images: ['assets/img/products/gold-cap-jar-100ml.png', 'assets/img/products/gold-cap-jar-100ml-2.png'],
        rating: 4.9,
        badge: 'Premium',
        specifications: {
            'Capacity': '100ml',
            'Material': 'PET + PP',
            'Color': 'Clear with Gold Cap',
            'Cap Type': 'Gold Plated Screw Cap',
            'Height': '75mm',
            'Diameter': '55mm'
        }
    },
    {
        id: 3,
        name: 'Crystal Series Bottle 200ml',
        category: 'crystal-series',
        description: 'Stunning crystal-clear bottle from our premium Crystal Series. Perfect for serums, toners, and liquid skincare products.',
        images: ['assets/img/products/crystal-bottle-200ml.png', 'assets/img/products/crystal-bottle-200ml-2.png'],
        rating: 4.7,
        badge: 'Crystal Series',
        specifications: {
            'Capacity': '200ml',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Dispensing Pump',
            'Height': '160mm',
            'Diameter': '50mm'
        }
    },
    {
        id: 4,
        name: 'Serum Bottle with Dropper 30ml',
        category: 'facial-skincare',
        description: 'Professional 30ml serum bottle with precision dropper. Perfect for facial serums, essential oils, and concentrated treatments.',
        images: ['assets/img/products/serum-bottle-30ml.png', 'assets/img/products/serum-bottle-30ml-2.png'],
        rating: 4.6,
        badge: 'Popular',
        specifications: {
            'Capacity': '30ml',
            'Material': 'Glass + Rubber',
            'Color': 'Amber/Clear',
            'Cap Type': 'Rubber Dropper',
            'Height': '95mm',
            'Diameter': '22mm'
        }
    },
    {
        id: 5,
        name: 'Facial Kit Jar Set',
        category: 'facial-skincare',
        description: 'Complete set of 5 jars for facial kits. Various sizes included, perfect for facial treatments and spa products.',
        images: ['assets/img/products/facial-kit-set.png', 'assets/img/products/facial-kit-set-2.png'],
        rating: 4.5,
        badge: 'Kit',
        specifications: {
            'Set Includes': '5 Jars (10ml, 20ml, 30ml, 50ml, 100ml)',
            'Material': 'PP Plastic',
            'Color': 'White',
            'Cap Type': 'Screw Cap',
            'Packaging': 'Individual Box'
        }
    },
    {
        id: 6,
        name: 'Shampoo Bottle 500ml',
        category: 'versatile-packaging',
        description: 'Versatile 500ml bottle suitable for shampoos, syrups, lotions, and other liquid products. Ergonomic design with flip-top cap.',
        images: ['assets/img/products/shampoo-bottle-500ml.png', 'assets/img/products/shampoo-bottle-500ml-2.png'],
        rating: 4.4,
        badge: 'Versatile',
        specifications: {
            'Capacity': '500ml',
            'Material': 'HDPE',
            'Color': 'White/Transparent',
            'Cap Type': 'Flip-Top',
            'Height': '210mm',
            'Diameter': '65mm'
        }
    },
    {
        id: 7,
        name: 'Plastic Storage Box - Small',
        category: 'versatile-packaging',
        description: 'Durable small plastic storage box. Ideal for organizing small cosmetic items, samples, and accessories.',
        images: ['assets/img/products/storage-box-small.png', 'assets/img/products/storage-box-small-2.png'],
        rating: 4.3,
        badge: 'Storage',
        specifications: {
            'Size': 'Small',
            'Material': 'PP Plastic',
            'Color': 'Clear',
            'Dimensions': '120 x 80 x 50mm',
            'Closure': 'Snap Lock'
        }
    },
    {
        id: 8,
        name: 'Crystal Series Round Jar 150ml',
        category: 'crystal-series',
        description: 'Premium round jar from the Crystal Series. Ultra-clear finish with elegant design, perfect for luxury skincare brands.',
        images: ['assets/img/products/crystal-round-jar-150ml.png', 'assets/img/products/crystal-round-jar-150ml-2.png'],
        rating: 4.8,
        badge: 'Crystal Series',
        specifications: {
            'Capacity': '150ml',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Screw Cap with Liner',
            'Height': '70mm',
            'Diameter': '70mm'
        }
    },
    {
        id: 9,
        name: 'Whitening Cream Jar 30ml',
        category: 'cream-containers',
        description: 'Specialized 30ml jar designed for whitening creams and concentrated skincare formulations.',
        images: ['assets/img/products/whitening-jar-30ml.png', 'assets/img/products/whitening-jar-30ml-2.png'],
        rating: 4.6,
        badge: 'Specialized',
        specifications: {
            'Capacity': '30ml',
            'Material': 'PP + PET',
            'Color': 'White with Clear',
            'Cap Type': 'Screw Cap',
            'Height': '50mm',
            'Diameter': '35mm'
        }
    },
    {
        id: 10,
        name: 'Dropper Bottle 50ml',
        category: 'facial-skincare',
        description: 'High-quality 50ml dropper bottle for facial oils, serums, and premium liquid formulations.',
        images: ['assets/img/products/dropper-bottle-50ml.png', 'assets/img/products/dropper-bottle-50ml-2.png'],
        rating: 4.5,
        badge: 'Premium',
        specifications: {
            'Capacity': '50ml',
            'Material': 'Glass + Rubber + Plastic',
            'Color': 'Amber/Clear/Blue',
            'Cap Type': 'Rubber Dropper with Cap',
            'Height': '110mm',
            'Diameter': '28mm'
        }
    },
    {
        id: 11,
        name: 'Plastic Storage Box - Medium',
        category: 'versatile-packaging',
        description: 'Medium-sized clear plastic storage box. Perfect for organizing cosmetic products, samples, and beauty accessories.',
        images: ['assets/img/products/storage-box-medium.png', 'assets/img/products/storage-box-medium-2.png'],
        rating: 4.4,
        badge: 'Storage',
        specifications: {
            'Size': 'Medium',
            'Material': 'PP Plastic',
            'Color': 'Clear',
            'Dimensions': '180 x 120 x 80mm',
            'Closure': 'Snap Lock with Hinges'
        }
    },
    {
        id: 12,
        name: 'Crystal Series Square Jar 200ml',
        category: 'crystal-series',
        description: 'Elegant square jar from our Crystal Series. Modern design with ultra-clear finish for a luxurious presentation.',
        images: ['assets/img/products/crystal-square-jar-200ml.png', 'assets/img/products/crystal-square-jar-200ml-2.png'],
        rating: 4.9,
        badge: 'Crystal Series',
        specifications: {
            'Capacity': '200ml',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Gold/Silver Screw Cap',
            'Height': '85mm',
            'Dimensions': '65 x 65mm'
        }
    }
];

// Products per page
const PRODUCTS_PER_PAGE = 12;

// Current state
let currentPage = 1;
let currentCategory = 'all';
let searchQuery = '';
let filteredProducts = [...products];

// Initialize Products Page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('products.html')) {
        initializeProducts();
    }
});

function initializeProducts() {
    renderCategoryFilters();
    renderProducts();
    setupSearch();
    setupCategoryFilters();
}

// Render Category Filters
function renderCategoryFilters() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;

    const categories = getUniqueCategories();
    
    // Clear existing buttons except "All"
    categoryFilters.innerHTML = '<button class="filter-btn active" data-category="all">All Products</button>';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.category = category;
        btn.textContent = formatCategoryName(category);
        categoryFilters.appendChild(btn);
    });
}

// Get Unique Categories
function getUniqueCategories() {
    const categories = products.map(p => p.category);
    return [...new Set(categories)];
}

// Format Category Name
function formatCategoryName(category) {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Apply filters
    filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    if (paginatedProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    productsGrid.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    renderPagination();
}

// Create Product Card
function createProductCard(product) {
    const productUrl = `product-detail.html?id=${product.id}`;
    
    return `
        <div class="product-card" data-aos="fade-up" data-aos-duration="600">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy" onerror="this.src='assets/img/placeholder.png'">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn share-btn" onclick="event.preventDefault(); shareProduct(${JSON.stringify(product).replace(/"/g, '&quot;')}, '${productUrl}')" title="Share Product">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="action-btn quick-view" onclick="window.location.href='${productUrl}'" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${formatCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 80)}...</p>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span>${product.rating}</span>
                </div>
                <div class="product-card-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <a href="${productUrl}" class="view-details-btn">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// Generate Star Rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Setup Search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = this.value;
            currentPage = 1;
            renderProducts();
        }, 300);
    });
}

// Setup Category Filters
function setupCategoryFilters() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;

    categoryFilters.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            // Update active state
            this.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update category and render
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            renderProducts();
        }
    });
}

// Render Pagination
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span class="page-dots">...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change Page
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add to Cart Function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.images[0],
            category: product.category,
            quantity: 1
        });
    }
    
    localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success animation
    showAddToCartAnimation(product);
}

// Show Add to Cart Animation
function showAddToCartAnimation(product) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${product.name} added to cart!</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}