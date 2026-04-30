// ============================================
// Products Data and Functionality
// Anas Plastic Enterprises
// Complete Working Version with Image Sharing
// ============================================

// Product Database
const products = [
    {
        id: 1,
        name: 'Crystal Clear Cream Jar 50ml',
        category: 'cream-containers',
        description: 'Premium crystal-clear plastic jar perfect for facial creams, whitening creams, and moisturizers. Features a secure screw cap and elegant design. Ideal for both retail and wholesale packaging needs. Made from high-quality PET plastic for durability and clarity.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        description: 'Elegant 100ml jar with luxurious gold cap. Perfect for premium skincare products, night creams, and anti-aging formulations. The gold accent adds a touch of luxury to your brand presentation.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        description: 'Stunning crystal-clear bottle from our premium Crystal Series. Perfect for serums, toners, and liquid skincare products. Ultra-clear PET-G material for maximum product visibility and shelf appeal.',
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
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
        description: 'Professional 30ml serum bottle with precision dropper. Perfect for facial serums, essential oils, and concentrated treatments. Available in amber and clear glass options.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        description: 'Complete set of 5 jars for facial kits. Various sizes included (10ml to 100ml), perfect for facial treatments and spa products. Professional packaging solution for beauty clinics.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
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
        description: 'Durable small plastic storage box with snap lock closure. Ideal for organizing small cosmetic items, samples, and accessories. Clear design for easy content visibility.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        description: 'Premium round jar from the Crystal Series. Ultra-clear finish with elegant design, perfect for luxury skincare brands. Features a secure screw cap with inner liner for product protection.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        description: 'Specialized 30ml jar designed for whitening creams and concentrated skincare formulations. Compact size perfect for targeted treatments and sample products.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        description: 'High-quality 50ml dropper bottle for facial oils, serums, and premium liquid formulations. Precise dropper for controlled dispensing and minimal waste.',
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
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
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        description: 'Versatile set of 3 cosmetic jars in different sizes (15ml, 30ml, 50ml). Perfect for sample kits, travel sets, and multi-product packaging solutions.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
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
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
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
        description: 'Fine mist spray bottle perfect for toners, facial mists, and water-based products. Even spray distribution for optimal application and customer satisfaction.',
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
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
        description: 'Elegant lotion bottle from Crystal Series with pump dispenser. Perfect for body lotions, liquid soaps, and cream products with a premium look.',
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
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
    },
    {
        id: 17,
        name: 'Jar with Inner Seal 60ml',
        category: 'cream-containers',
        description: 'Secure 60ml jar with inner seal for maximum product protection. Ideal for natural and organic products that require extra preservation.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
        rating: 4.5,
        badge: 'New',
        specifications: {
            'Capacity': '60ml',
            'Material': 'PET + Aluminum Seal',
            'Color': 'Clear/White',
            'Cap Type': 'Screw Cap with Inner Seal',
            'Height': '60mm',
            'Diameter': '48mm',
            'Usage': 'Organic Products, Sensitive Formulas'
        }
    },
    {
        id: 18,
        name: 'Travel Kit Bottle Set 4-Piece',
        category: 'versatile-packaging',
        description: 'Convenient 4-piece travel kit with bottles and jars. Perfect for travel-sized products, hotel amenities, and sample distributions.',
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
        rating: 4.2,
        badge: 'Travel',
        specifications: {
            'Set Includes': '2 Bottles (30ml) + 2 Jars (15ml)',
            'Material': 'PET + PP',
            'Color': 'Clear',
            'Cap Type': 'Flip-Top + Screw Cap',
            'Packaging': 'Zipper Pouch',
            'Usage': 'Travel, Samples, Hotels'
        }
    },
    {
        id: 19,
        name: 'Premium Serum Dropper 20ml',
        category: 'facial-skincare',
        description: 'Luxury 20ml serum dropper with gold accents. Perfect for high-end serums, face oils, and premium skincare treatments.',
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
        rating: 4.9,
        badge: 'Luxury',
        specifications: {
            'Capacity': '20ml',
            'Material': 'Glass + Gold-Plated Cap',
            'Color': 'Clear with Gold',
            'Cap Type': 'Gold Dropper',
            'Height': '90mm',
            'Diameter': '20mm',
            'Usage': 'Premium Serums, Face Oils'
        }
    },
    {
        id: 20,
        name: 'Crystal Series Display Jar 300ml',
        category: 'crystal-series',
        description: 'Large 300ml display jar from Crystal Series. Perfect for counter displays, bulk products, and professional spa use with maximum visual impact.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
        rating: 4.7,
        badge: 'Display',
        specifications: {
            'Capacity': '300ml',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Wide Screw Cap',
            'Height': '100mm',
            'Diameter': '85mm',
            'Usage': 'Display, Bulk, Professional'
        }
    },
    {
        id: 21,
        name: 'Roll-On Bottle 10ml',
        category: 'facial-skincare',
        description: 'Compact 10ml roll-on bottle for under-eye serums, essential oils, and targeted treatments. Smooth rolling ball for easy application.',
        images: [
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500',
            'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500'
        ],
        rating: 4.4,
        badge: 'Compact',
        specifications: {
            'Capacity': '10ml',
            'Material': 'Glass + Steel Ball',
            'Color': 'Clear/Amber',
            'Cap Type': 'Roll-On with Cap',
            'Height': '65mm',
            'Diameter': '16mm',
            'Usage': 'Under-Eye, Essential Oils'
        }
    },
    {
        id: 22,
        name: 'Plastic Box with Dividers',
        category: 'versatile-packaging',
        description: 'Organized storage box with adjustable dividers. Perfect for organizing different cosmetic products, tools, and accessories in one place.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
        rating: 4.5,
        badge: 'Organizer',
        specifications: {
            'Size': 'Large with Dividers',
            'Material': 'PP Plastic',
            'Color': 'Clear',
            'Dimensions': '250 x 180 x 100mm',
            'Closure': 'Snap Lock',
            'Usage': 'Organization, Professional Kits'
        }
    },
    {
        id: 23,
        name: 'Crystal Series Mini Jar Set 5ml',
        category: 'crystal-series',
        description: 'Set of 10 mini crystal jars (5ml each). Perfect for samples, travel sizes, and promotional giveaways with premium Crystal Series quality.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
        rating: 4.6,
        badge: 'Mini Set',
        specifications: {
            'Set Includes': '10 Mini Jars (5ml each)',
            'Material': 'PET-G',
            'Color': 'Ultra Clear',
            'Cap Type': 'Mini Screw Cap',
            'Height': '20mm',
            'Diameter': '15mm',
            'Usage': 'Samples, Giveaways, Travel'
        }
    },
    {
        id: 24,
        name: 'Double Wall Jar 50ml',
        category: 'cream-containers',
        description: 'Premium double-wall jar that creates an elegant floating effect for your product. Adds a luxurious touch to high-end skincare brands.',
        images: [
            'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
        rating: 4.8,
        badge: 'Luxury',
        specifications: {
            'Capacity': '50ml',
            'Material': 'Acrylic + PET',
            'Color': 'Crystal Clear Double Wall',
            'Cap Type': 'Metallic Screw Cap',
            'Height': '60mm',
            'Diameter': '50mm',
            'Usage': 'Luxury Brands, Premium Products'
        }
    }
];

// ============================================
// Configuration
// ============================================
const PRODUCTS_PER_PAGE = 12;

// ============================================
// State Management
// ============================================
let currentPage = 1;
let currentCategory = 'all';
let searchQuery = '';
let filteredProducts = [...products];

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 50
        });
    }
    
    // Check if we're on products page
    if (window.location.pathname.includes('products.html')) {
        initializeProducts();
        
        // Check for category parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            currentCategory = categoryParam;
        }
    }
    
    // Update cart count on all pages
    updateCartCountDisplay();
});

// ============================================
// Products Page Initialization
// ============================================
function initializeProducts() {
    renderCategoryFilters();
    renderProducts();
    setupSearch();
    setupCategoryFilters();
    
    // Set initial active filter button
    setTimeout(() => {
        updateActiveFilterButton();
    }, 100);
}

// ============================================
// Category Functions
// ============================================
function getUniqueCategories() {
    const categories = products.map(p => p.category);
    return [...new Set(categories)];
}

function formatCategoryName(category) {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function renderCategoryFilters() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;

    const categories = getUniqueCategories();
    
    let filterHTML = '<button class="filter-btn active" data-category="all">All Products</button>';
    
    categories.forEach(category => {
        filterHTML += `
            <button class="filter-btn" data-category="${category}">
                ${formatCategoryName(category)}
            </button>
        `;
    });
    
    categoryFilters.innerHTML = filterHTML;
}

function updateActiveFilterButton() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === currentCategory) {
            btn.classList.add('active');
        }
    });
}

function setupCategoryFilters() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;

    categoryFilters.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            updateActiveFilterButton();
            renderProducts();
        }
    });
}

// ============================================
// Search Functions
// ============================================
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = this.value.trim();
            currentPage = 1;
            renderProducts();
        }, 300);
    });
}

// ============================================
// Product Rendering
// ============================================
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Apply filters
    filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = !searchQuery || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Handle empty results
    if (paginatedProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>No products found</h3>
                <p>${searchQuery ? 'Try adjusting your search terms.' : 'No products in this category yet.'}</p>
                ${searchQuery || currentCategory !== 'all' ? `
                    <button class="btn-primary" onclick="resetFilters()" style="margin-top: 15px;">
                        Reset Filters
                    </button>
                ` : ''}
            </div>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    // Render products
    productsGrid.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    
    // Render pagination
    renderPagination(totalPages);
    
    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
}

function createProductCard(product) {
    const productUrl = `product-detail.html?id=${product.id}`;
    
    return `
        <div class="product-card" data-aos="fade-up" data-aos-duration="600">
            <div class="product-image">
                <img src="${product.images[0]}" 
                     alt="${product.name}" 
                     loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}'">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn share-btn" 
                            onclick="event.stopPropagation(); shareProductWithImage(${product.id}, '${productUrl}')" 
                            title="Share Product">
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
                    <a href="${productUrl}" style="color: inherit; text-decoration: none;">
                        ${product.name}
                    </a>
                </h3>
                <p class="product-description">${product.description.substring(0, 80)}...</p>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span>${product.rating}</span>
                </div>
                <div class="product-card-actions">
                    <button class="add-to-cart-btn" 
                            onclick="event.stopPropagation(); addToCartFromProducts(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <a href="${productUrl}" class="view-details-btn">Details</a>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// Star Rating
// ============================================
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

// ============================================
// Pagination
// ============================================
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
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

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    
    // Scroll to products grid
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = productsGrid.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
}

function resetFilters() {
    currentCategory = 'all';
    searchQuery = '';
    currentPage = 1;
    
    // Reset search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Update filter buttons
    updateActiveFilterButton();
    
    // Re-render
    renderProducts();
}

// ============================================
// Cart Functions
// ============================================
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

// ============================================
// Share Functions
// ============================================
async function shareProductWithImage(productId, productUrl) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const fullUrl = window.location.origin + '/' + productUrl;
    const shareData = {
        title: product.name,
        text: `Check out ${product.name} from Anas Plastic Enterprises - Premium Cosmetic Packaging\n\n${product.description.substring(0, 100)}...`,
        url: fullUrl
    };
    
    if (navigator.share && navigator.canShare) {
        try {
            // Try to include image
            try {
                const response = await fetch(product.images[0]);
                const blob = await response.blob();
                const file = new File([blob], `${product.name.replace(/\s+/g, '-')}.jpg`, { type: 'image/jpeg' });
                
                const shareDataWithImage = {
                    title: product.name,
                    text: `Check out ${product.name} from Anas Plastic Enterprises\n${fullUrl}`,
                    files: [file]
                };
                
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share(shareDataWithImage);
                    return;
                }
            } catch (imgErr) {
                console.log('Image sharing not supported, sharing without image');
            }
            
            // Share without image
            await navigator.share(shareData);
        } catch (err) {
            if (err.name !== 'AbortError') {
                copyProductLink(fullUrl);
            }
        }
    } else {
        copyProductLink(fullUrl);
    }
}

function copyProductLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showShareNotification('Product link copied to clipboard! Share it with your contacts.');
    }).catch(() => {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            showShareNotification('Link copied! Share it with your contacts.');
        } catch (err) {
            prompt('Copy this link to share:', url);
        }
        document.body.removeChild(tempInput);
    });
}

// ============================================
// Notification Functions
// ============================================
function showAddToCartNotification(product) {
    // Remove existing notifications
    document.querySelectorAll('.cart-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div>
            <strong>${product.name}</strong>
            <span style="display: block; font-size: 0.85rem;">Added to cart successfully!</span>
        </div>
        <a href="cart.html" style="color: white; text-decoration: underline; font-weight: 700;">View Cart</a>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showShareNotification(message) {
    document.querySelectorAll('.cart-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.background = '#1E3A8A';
    notification.innerHTML = `
        <i class="fas fa-share-alt"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ============================================
// Utility Functions
// ============================================
function updateCartCountDisplay() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
            if (totalItems > 0) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        }
    });
}

// ============================================
// Global Exports
// ============================================
window.addToCartFromProducts = addToCartFromProducts;
window.shareProductWithImage = shareProductWithImage;
window.changePage = changePage;
window.resetFilters = resetFilters;
window.updateCartCount = updateCartCountDisplay;

// ============================================
// Legacy Support
// ============================================
function updateCartCount() {
    updateCartCountDisplay();
}
window.updateCartCount = updateCartCount;