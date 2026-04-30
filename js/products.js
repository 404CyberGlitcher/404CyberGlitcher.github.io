// Products Data and Functionality - Anas Plastic Enterprises

// Product Database
const products = [
    {
        id: 1,
        name: 'Crystal Clear Cream Jar 50ml',
        category: 'cream-containers',
        description: 'Premium crystal-clear plastic jar perfect for facial creams, whitening creams, and moisturizers. Features a secure screw cap and elegant design. Ideal for both retail and wholesale packaging needs.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.8,
        badge: 'Best Seller',
        specifications: {
            'Capacity': '50ml',
            'Material': 'PET Plastic',
            'Color': 'Crystal Clear',
            'Cap Type': 'Screw Cap',
            'Height': '65mm',
            'Diameter': '45mm',
            'Usage': 'Creams, Moisturizers, Gels'
        }
    },
    {
        id: 2,
        name: 'Luxury Gold Cap Jar 100ml',
        category: 'cream-containers',
        description: 'Elegant 100ml jar with luxurious gold cap. Perfect for premium skincare products, night creams, and anti-aging formulations. The gold accent adds a touch of luxury to your brand.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.9,
        badge: 'Premium',
        specifications: {
            'Capacity': '100ml',
            'Material': 'PET + PP',
            'Color': 'Clear with Gold Cap',
            'Cap Type': 'Gold Plated Screw Cap',
            'Height': '75mm',
            'Diameter': '55mm',
            'Usage': 'Premium Creams, Night Creams'
        }
    },
    {
        id: 3,
        name: 'Crystal Series Bottle 200ml',
        category: 'crystal-series',
        description: 'Stunning crystal-clear bottle from our premium Crystal Series. Perfect for serums, toners, and liquid skincare products. Ultra-clear finish for maximum product visibility.',
        images: ['https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500', 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'],
        rating: 4.7,
        badge: 'Crystal Series',
        specifications: {
            'Capacity': '200ml',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Dispensing Pump',
            'Height': '160mm',
            'Diameter': '50mm',
            'Usage': 'Serums, Toners, Liquids'
        }
    },
    {
        id: 4,
        name: 'Serum Bottle with Dropper 30ml',
        category: 'facial-skincare',
        description: 'Professional 30ml serum bottle with precision dropper. Perfect for facial serums, essential oils, and concentrated treatments. Available in amber and clear glass.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.6,
        badge: 'Popular',
        specifications: {
            'Capacity': '30ml',
            'Material': 'Glass + Rubber',
            'Color': 'Amber/Clear',
            'Cap Type': 'Rubber Dropper',
            'Height': '95mm',
            'Diameter': '22mm',
            'Usage': 'Serums, Essential Oils'
        }
    },
    {
        id: 5,
        name: 'Facial Kit Jar Set (5 Pieces)',
        category: 'facial-skincare',
        description: 'Complete set of 5 jars for facial kits. Various sizes included (10ml to 100ml), perfect for facial treatments and spa products. Professional packaging solution.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.5,
        badge: 'Kit',
        specifications: {
            'Set Includes': '5 Jars (10ml, 20ml, 30ml, 50ml, 100ml)',
            'Material': 'PP Plastic',
            'Color': 'White',
            'Cap Type': 'Screw Cap',
            'Packaging': 'Individual Box',
            'Usage': 'Facial Kits, Spa Products'
        }
    },
    {
        id: 6,
        name: 'Shampoo Bottle 500ml',
        category: 'versatile-packaging',
        description: 'Versatile 500ml bottle suitable for shampoos, syrups, lotions, and other liquid products. Ergonomic design with convenient flip-top cap for easy dispensing.',
        images: ['https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500', 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'],
        rating: 4.4,
        badge: 'Versatile',
        specifications: {
            'Capacity': '500ml',
            'Material': 'HDPE',
            'Color': 'White/Transparent',
            'Cap Type': 'Flip-Top',
            'Height': '210mm',
            'Diameter': '65mm',
            'Usage': 'Shampoo, Syrup, Lotion'
        }
    },
    {
        id: 7,
        name: 'Plastic Storage Box - Small',
        category: 'versatile-packaging',
        description: 'Durable small plastic storage box with snap lock closure. Ideal for organizing small cosmetic items, samples, and accessories. Clear design for easy visibility.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.3,
        badge: 'Storage',
        specifications: {
            'Size': 'Small',
            'Material': 'PP Plastic',
            'Color': 'Clear',
            'Dimensions': '120 x 80 x 50mm',
            'Closure': 'Snap Lock',
            'Usage': 'Storage, Organization'
        }
    },
    {
        id: 8,
        name: 'Crystal Series Round Jar 150ml',
        category: 'crystal-series',
        description: 'Premium round jar from the Crystal Series. Ultra-clear finish with elegant design, perfect for luxury skincare brands. Features a secure screw cap with inner liner.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.8,
        badge: 'Crystal Series',
        specifications: {
            'Capacity': '150ml',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Screw Cap with Liner',
            'Height': '70mm',
            'Diameter': '70mm',
            'Usage': 'Luxury Creams, Masks'
        }
    },
    {
        id: 9,
        name: 'Whitening Cream Jar 30ml',
        category: 'cream-containers',
        description: 'Specialized 30ml jar designed for whitening creams and concentrated skincare formulations. Compact size perfect for targeted treatments.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.6,
        badge: 'Specialized',
        specifications: {
            'Capacity': '30ml',
            'Material': 'PP + PET',
            'Color': 'White with Clear',
            'Cap Type': 'Screw Cap',
            'Height': '50mm',
            'Diameter': '35mm',
            'Usage': 'Whitening Creams, Treatments'
        }
    },
    {
        id: 10,
        name: 'Dropper Bottle 50ml',
        category: 'facial-skincare',
        description: 'High-quality 50ml dropper bottle for facial oils, serums, and premium liquid formulations. Precise dropper for controlled dispensing.',
        images: ['https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500', 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'],
        rating: 4.5,
        badge: 'Premium',
        specifications: {
            'Capacity': '50ml',
            'Material': 'Glass + Rubber + Plastic',
            'Color': 'Amber/Clear/Blue',
            'Cap Type': 'Rubber Dropper with Cap',
            'Height': '110mm',
            'Diameter': '28mm',
            'Usage': 'Facial Oils, Serums'
        }
    },
    {
        id: 11,
        name: 'Plastic Storage Box - Medium',
        category: 'versatile-packaging',
        description: 'Medium-sized clear plastic storage box with hinged lid. Perfect for organizing cosmetic products, samples, and beauty accessories in your store or at home.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.4,
        badge: 'Storage',
        specifications: {
            'Size': 'Medium',
            'Material': 'PP Plastic',
            'Color': 'Clear',
            'Dimensions': '180 x 120 x 80mm',
            'Closure': 'Snap Lock with Hinges',
            'Usage': 'Multi-purpose Storage'
        }
    },
    {
        id: 12,
        name: 'Crystal Series Square Jar 200ml',
        category: 'crystal-series',
        description: 'Elegant square jar from our Crystal Series. Modern design with ultra-clear finish for a luxurious presentation. Available with gold or silver cap options.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.9,
        badge: 'Crystal Series',
        specifications: {
            'Capacity': '200ml',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Gold/Silver Screw Cap',
            'Height': '85mm',
            'Dimensions': '65 x 65mm',
            'Usage': 'Luxury Products, Gift Sets'
        }
    },
    {
        id: 13,
        name: 'Cosmetic Jars Set 3-Piece',
        category: 'cream-containers',
        description: 'Versatile set of 3 cosmetic jars in different sizes (15ml, 30ml, 50ml). Perfect for sample kits, travel sets, and multi-product packaging.',
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        rating: 4.4,
        badge: 'Value Set',
        specifications: {
            'Set Includes': '3 Jars (15ml, 30ml, 50ml)',
            'Material': 'PET Plastic',
            'Color': 'Clear',
            'Cap Type': 'Screw Cap',
            'Packaging': 'Bulk Pack',
            'Usage': 'Samples, Travel Kits'
        }
    },
    {
        id: 14,
        name: 'Airless Pump Bottle 30ml',
        category: 'facial-skincare',
        description: 'Modern airless pump bottle that protects product integrity. Ideal for serums, foundations, and sensitive formulations that require protection from air exposure.',
        images: ['https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500', 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'],
        rating: 4.7,
        badge: 'Innovative',
        specifications: {
            'Capacity': '30ml',
            'Material': 'PP + PET',
            'Color': 'White/Silver',
            'Cap Type': 'Airless Pump',
            'Height': '120mm',
            'Diameter': '25mm',
            'Usage': 'Serums, Foundations'
        }
    },
    {
        id: 15,
        name: 'Spray Bottle 100ml',
        category: 'versatile-packaging',
        description: 'Fine mist spray bottle perfect for toners, facial mists, and water-based products. Even spray distribution for optimal application.',
        images: ['https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500', 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'],
        rating: 4.3,
        badge: 'Popular',
        specifications: {
            'Capacity': '100ml',
            'Material': 'PET',
            'Color': 'Clear/White',
            'Cap Type': 'Fine Mist Sprayer',
            'Height': '140mm',
            'Diameter': '35mm',
            'Usage': 'Toners, Mists, Sprays'
        }
    },
    {
        id: 16,
        name: 'Crystal Series Lotion Bottle 250ml',
        category: 'crystal-series',
        description: 'Elegant lotion bottle from Crystal Series with pump dispenser. Perfect for body lotions, creams, and liquid soaps with a premium look.',
        images: ['https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500', 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'],
        rating: 4.8,
        badge: 'Crystal Series',
        specifications: {
            'Capacity': '250ml',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Lotion Pump',
            'Height': '180mm',
            'Diameter': '55mm',
            'Usage': 'Lotions, Liquid Soaps'
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

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    if (window.location.pathname.includes('products.html')) {
        initializeProducts();
    }
    
    // Update cart count on all pages
    updateCartCountDisplay();
});

// Initialize Products Page
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
    
    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
}

// Create Product Card
function createProductCard(product) {
    const productUrl = `product-detail.html?id=${product.id}`;
    
    return `
        <div class="product-card" data-aos="fade-up" data-aos-duration="600">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=Product+Image'">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn share-btn" onclick="event.stopPropagation(); shareCurrentProduct(${product.id}, '${productUrl}')" title="Share Product">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <a href="${productUrl}" class="action-btn quick-view" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${formatCategoryName(product.category)}</span>
                <h3 class="product-name">
                    <a href="${productUrl}" style="color: inherit; text-decoration: none;">${product.name}</a>
                </h3>
                <p class="product-description">${product.description.substring(0, 80)}...</p>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span>${product.rating}</span>
                </div>
                <div class="product-card-actions">
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartFromProducts(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <a href="${productUrl}" class="view-details-btn">Details</a>
                </div>
            </div>
        </div>
    `;
}

// Generate Star Rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
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
    window.scrollTo({ top: document.getElementById('productsGrid').offsetTop - 100, behavior: 'smooth' });
}

// Add to Cart from Products Page
function addToCartFromProducts(productId) {
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
    updateCartCountDisplay();
    showAddToCartNotification(product);
}

// Share Current Product
function shareCurrentProduct(productId, productUrl) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const fullUrl = window.location.origin + '/' + productUrl;
    
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: `Check out ${product.name} from Anas Plastic Enterprises - ${product.description.substring(0, 100)}`,
            url: fullUrl
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy link
        navigator.clipboard.writeText(fullUrl).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(() => {
            prompt('Copy this link:', fullUrl);
        });
    }
}

// Show Add to Cart Notification
function showAddToCartNotification(product) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${product.name} added to cart!</span>
        <a href="cart.html" style="color: white; text-decoration: underline; margin-left: 10px;">View Cart</a>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show General Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Update Cart Count Display
function updateCartCountDisplay() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
        }
    });
}

// Legacy support for main.js
function updateCartCount() {
    updateCartCountDisplay();
}

// Check URL for category parameter on load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('products.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            currentCategory = categoryParam;
            // Update filter buttons
            setTimeout(() => {
                const filterBtns = document.querySelectorAll('.filter-btn');
                filterBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.category === categoryParam) {
                        btn.classList.add('active');
                    }
                });
            }, 200);
        }
    }
});