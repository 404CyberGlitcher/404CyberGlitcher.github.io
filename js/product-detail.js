// ============================================
// Product Detail Page - Anas Plastic Enterprises
// Professional Version with Enhanced Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product-detail.html')) {
        loadProductDetail();
    }
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    // Initialize Galaxy buttons
    setTimeout(() => {
        initializeAllGalaxyButtons();
    }, 300);
    
    updateCartCountDisplay();
});

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId || isNaN(productId)) {
        showProductNotFound();
        return;
    }
    
    if (typeof products === 'undefined') {
        console.error('Products data not loaded');
        showProductNotFound();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showProductNotFound();
        return;
    }
    
    document.title = `${product.name} - Anas Plastic Enterprises | Premium Cosmetic Packaging`;
    const pageTitle = document.getElementById('pageTitle');
    const pageDescription = document.getElementById('pageDescription');
    
    if (pageTitle) {
        pageTitle.textContent = `${product.name} - Anas Plastic Enterprises`;
    }
    if (pageDescription) {
        pageDescription.setAttribute('content', product.description.substring(0, 160));
    }
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.href = `https://www.anasplastic.com/product-detail?id=${product.id}`;
    }
    
    updateOpenGraphTags(product);
    renderProductDetail(product);
}

function updateOpenGraphTags(product) {
    const ogTags = {
        'og:title': `${product.name} - Anas Plastic Enterprises`,
        'og:description': product.description.substring(0, 200),
        'og:image': product.images[0],
        'og:url': window.location.href,
        'og:type': 'product'
    };
    
    Object.entries(ogTags).forEach(([property, content]) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    });
}

function showProductNotFound() {
    const container = document.getElementById('productDetailContainer');
    const notFound = document.getElementById('productNotFound');
    
    if (container) container.style.display = 'none';
    if (notFound) notFound.style.display = 'block';
}

function renderProductDetail(product) {
    const container = document.getElementById('productDetailContainer');
    const notFound = document.getElementById('productNotFound');
    
    if (!container) return;
    
    container.style.display = 'block';
    if (notFound) notFound.style.display = 'none';
    
    const productUrl = window.location.href;
    const whatsappText = encodeURIComponent(`Hi, I'm interested in this product:\n\n*${product.name}*\n\n${product.description}\n\nLink: ${productUrl}`);

    container.innerHTML = `
        <div class="product-detail-wrapper" data-aos="fade-up">
            <!-- Product Images -->
            <div class="product-gallery">
                <div class="main-image-container">
                    <div class="main-image" id="mainImageContainer">
                        <img src="${product.images[0]}" alt="${product.name}" id="mainImage" 
                             onerror="this.src='https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}'">
                        ${product.badge ? `<span class="detail-badge">${product.badge}</span>` : ''}
                        <div class="image-overlay">
                            <button class="zoom-btn" onclick="openImageZoom('${product.images[0]}')" title="Zoom Image">
                                <i class="fas fa-search-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                ${product.images.length > 1 ? `
                <div class="thumbnail-gallery">
                    ${product.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="changeMainImage('${img}', this, ${index})">
                            <img src="${img}" alt="${product.name} - View ${index + 1}" 
                                 onerror="this.src='https://via.placeholder.com/100x100?text=Image'">
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>

            <!-- Product Info -->
            <div class="product-info-detail">
                <div class="detail-header">
                    <span class="detail-category">${formatCategoryName(product.category)}</span>
                    <h1 class="detail-name">${product.name}</h1>
                    
                    <div class="detail-rating">
                        <div class="stars">
                            ${generateStarRating(product.rating)}
                        </div>
                        <span class="rating-value">${product.rating} / 5</span>
                    </div>
                </div>
                
                <div class="detail-description">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p>${product.description}</p>
                </div>
                
                <div class="detail-specifications">
                    <h3><i class="fas fa-clipboard-list"></i> Specifications</h3>
                    <div class="specs-grid">
                        ${Object.entries(product.specifications).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-label">${key}</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="detail-actions">
                    <!-- Quantity Selector -->
                    <div class="quantity-selector-new">
                        <label>Quantity <span style="color: #DC2626; font-size: 0.8rem;">(Min: 100)</span></label>
                        <div class="quantity-controls-new">
                            <button class="qty-btn-new qty-minus" onclick="decreaseQuantity()" aria-label="Decrease quantity">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" id="quantity" value="100" min="100" max="10000" step="100" 
                                   onchange="validateQuantity()" oninput="validateQuantityInput()">
                            <button class="qty-btn-new qty-plus" onclick="increaseQuantity()" aria-label="Increase quantity">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Quick Quantity Buttons -->
                    <div class="quick-quantity">
                        <span>Quick:</span>
                        <button class="quick-qty-btn" onclick="setQuantity(100)">100</button>
                        <button class="quick-qty-btn" onclick="setQuantity(500)">500</button>
                        <button class="quick-qty-btn" onclick="setQuantity(1000)">1,000</button>
                        <button class="quick-qty-btn" onclick="setQuantity(5000)">5,000</button>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <div class="galaxy-button-wrapper">
                            <div class="galaxy-button">
                                <button onclick="addToCartWithQuantity(${product.id})" type="button" aria-label="Add to cart">
                                    <span class="spark"></span>
                                    <span class="backdrop"></span>
                                    <span class="galaxy__container">
                                        <span class="star star--static"></span>
                                        <span class="star star--static"></span>
                                        <span class="star star--static"></span>
                                        <span class="star star--static"></span>
                                    </span>
                                    <span class="galaxy">
                                        <span class="galaxy__ring">
                                            ${Array(20).fill('<span class="star"></span>').join('')}
                                        </span>
                                    </span>
                                    <span class="text"><i class="fas fa-cart-plus"></i> Add to Cart</span>
                                </button>
                                <div class="bodydrop"></div>
                            </div>
                        </div>
                        
                        <button class="share-detail-btn" onclick="shareProductWithImage(${product.id})" type="button">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                        
                        <a href="https://wa.me/923000841330?text=${whatsappText}" target="_blank" class="whatsapp-inquiry-btn">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
                
                <!-- Info Badges -->
                <div class="additional-info">
                    <div class="info-badge">
                        <i class="fas fa-check-circle"></i> Quality Guaranteed
                    </div>
                    <div class="info-badge">
                        <i class="fas fa-truck"></i> Wholesale Available
                    </div>
                    <div class="info-badge">
                        <i class="fas fa-store"></i> In-Store Pickup
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Image Zoom Modal -->
        <div id="imageZoomModal" class="image-zoom-modal" onclick="closeImageZoom()">
            <span class="close-zoom" onclick="closeImageZoom()">&times;</span>
            <div class="zoom-controls">
                <button class="zoom-control-btn" onclick="event.stopPropagation(); zoomIn()" title="Zoom In">
                    <i class="fas fa-search-plus"></i>
                </button>
                <button class="zoom-control-btn" onclick="event.stopPropagation(); zoomOut()" title="Zoom Out">
                    <i class="fas fa-search-minus"></i>
                </button>
                <button class="zoom-control-btn" onclick="event.stopPropagation(); resetZoom()" title="Reset Zoom">
                    <i class="fas fa-compress"></i>
                </button>
            </div>
            <div class="zoom-image-container" id="zoomImageContainer">
                <img id="zoomedImage" src="" alt="Zoomed product image">
            </div>
        </div>
    `;
    
    // Initialize galaxy buttons
    setTimeout(() => {
        initializeAllGalaxyButtons();
    }, 300);
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 300);
    }
}

// ============================================
// Galaxy Button Initialization
// ============================================
function initializeAllGalaxyButtons() {
    const PARTICLES = document.querySelectorAll('.galaxy-button .star');
    
    PARTICLES.forEach(P => {
        const angle = Math.floor(Math.random() * 360);
        const duration = Math.floor(Math.random() * 14) + 6;
        const delay = Math.floor(Math.random() * 9) + 1;
        const alpha = (Math.floor(Math.random() * 50) + 40) / 100;
        const size = Math.floor(Math.random() * 4) + 2;
        const distance = Math.floor(Math.random() * 160) + 40;
        
        P.setAttribute('style', `
            --angle: ${angle};
            --duration: ${duration};
            --delay: ${delay};
            --alpha: ${alpha};
            --size: ${size};
            --distance: ${distance};
        `);
    });
}

// ============================================
// Image Functions
// ============================================
function changeMainImage(imageSrc, thumbnailElement, index) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.style.opacity = '0';
        mainImage.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            mainImage.src = imageSrc;
            mainImage.style.opacity = '1';
            mainImage.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    if (thumbnailElement) {
        thumbnailElement.classList.add('active');
    }
    
    // Update zoom button link
    const zoomBtn = document.querySelector('.zoom-btn');
    if (zoomBtn) {
        zoomBtn.setAttribute('onclick', `openImageZoom('${imageSrc}')`);
    }
}

// Zoom functionality
let currentZoomLevel = 1;
const ZOOM_STEP = 0.5;
const MAX_ZOOM = 5;
const MIN_ZOOM = 1;

function openImageZoom(imageSrc) {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');
    
    if (modal && zoomedImg) {
        zoomedImg.src = imageSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        currentZoomLevel = 1;
        zoomedImg.style.transform = `scale(${currentZoomLevel})`;
    }
}

function closeImageZoom() {
    const modal = document.getElementById('imageZoomModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        currentZoomLevel = 1;
        const zoomedImg = document.getElementById('zoomedImage');
        if (zoomedImg) {
            zoomedImg.style.transform = 'scale(1)';
        }
    }
}

function zoomIn() {
    if (currentZoomLevel < MAX_ZOOM) {
        currentZoomLevel += ZOOM_STEP;
        updateZoom();
    }
}

function zoomOut() {
    if (currentZoomLevel > MIN_ZOOM) {
        currentZoomLevel -= ZOOM_STEP;
        updateZoom();
    }
}

function resetZoom() {
    currentZoomLevel = 1;
    updateZoom();
}

function updateZoom() {
    const zoomedImg = document.getElementById('zoomedImage');
    if (zoomedImg) {
        zoomedImg.style.transform = `scale(${currentZoomLevel})`;
        zoomedImg.style.transition = 'transform 0.3s ease';
    }
}

// Close zoom with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageZoom();
    }
});

// Mouse wheel zoom in modal
document.addEventListener('wheel', function(e) {
    const modal = document.getElementById('imageZoomModal');
    if (modal && modal.style.display === 'flex') {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    }
}, { passive: false });

// ============================================
// Quantity Functions
// ============================================
function increaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        let currentQty = parseInt(qtyInput.value) || 100;
        qtyInput.value = currentQty + 100;
        animateQuantityChange('up');
    }
}

function decreaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        let currentQty = parseInt(qtyInput.value) || 100;
        if (currentQty > 100) {
            qtyInput.value = currentQty - 100;
            animateQuantityChange('down');
        }
    }
}

function setQuantity(qty) {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        qtyInput.value = qty;
        animateQuantityChange('set');
        // Highlight the clicked quick button
        document.querySelectorAll('.quick-qty-btn').forEach(btn => btn.classList.remove('active'));
        const clickedBtn = document.querySelector(`.quick-qty-btn[onclick="setQuantity(${qty})"]`);
        if (clickedBtn) clickedBtn.classList.add('active');
    }
}

function validateQuantity() {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        let qty = parseInt(qtyInput.value);
        if (isNaN(qty) || qty < 100) {
            qtyInput.value = 100;
        } else if (qty > 10000) {
            qtyInput.value = 10000;
        }
        // Round to nearest 100
        qtyInput.value = Math.round(qtyInput.value / 100) * 100;
    }
}

function validateQuantityInput() {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        // Remove non-numeric characters
        qtyInput.value = qtyInput.value.replace(/[^0-9]/g, '');
    }
}

function animateQuantityChange(direction) {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        qtyInput.classList.add(direction === 'up' ? 'qty-increase' : direction === 'down' ? 'qty-decrease' : 'qty-set');
        setTimeout(() => {
            qtyInput.classList.remove('qty-increase', 'qty-decrease', 'qty-set');
        }, 300);
    }
}

// ============================================
// Cart Functions
// ============================================
function addToCartWithQuantity(productId) {
    const quantity = parseInt(document.getElementById('quantity')?.value) || 100;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    if (quantity < 100) {
        showNotification('Minimum order quantity is 100 units.', 'error');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.images[0],
            category: product.category,
            quantity: quantity
        });
    }
    
    localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
    updateCartCountDisplay();
    
    // Animate button
    animateAddToCartButton();
    
    // Show success notification
    showAddToCartNotification(product, quantity);
}

function animateAddToCartButton() {
    const galaxyButton = document.querySelector('.galaxy-button button');
    if (galaxyButton) {
        galaxyButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            galaxyButton.style.transform = 'scale(1.05)';
            setTimeout(() => {
                galaxyButton.style.transform = 'scale(1)';
            }, 150);
        }, 150);
    }
}

// ============================================
// Share Functions
// ============================================
async function shareProductWithImage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productUrl = window.location.href;
    const shareData = {
        title: product.name,
        text: `Check out ${product.name} from Anas Plastic Enterprises - Premium Cosmetic Packaging\n\n${product.description.substring(0, 100)}...`,
        url: productUrl
    };
    
    if (navigator.share && navigator.canShare) {
        try {
            try {
                const response = await fetch(product.images[0]);
                const blob = await response.blob();
                const file = new File([blob], `${product.name.replace(/\s+/g, '-')}.jpg`, { type: 'image/jpeg' });
                
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: product.name,
                        text: `Check out ${product.name} from Anas Plastic Enterprises\n${productUrl}`,
                        files: [file]
                    });
                    return;
                }
            } catch (imgErr) {
                console.log('Image sharing not supported');
            }
            
            await navigator.share(shareData);
        } catch (err) {
            if (err.name !== 'AbortError') {
                copyProductLink(productUrl);
            }
        }
    } else {
        copyProductLink(productUrl);
    }
}

function copyProductLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Product link copied to clipboard!');
    }).catch(() => {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showNotification('Link copied!');
    });
}

// ============================================
// Notification Functions
// ============================================
function showAddToCartNotification(product, quantity) {
    document.querySelectorAll('.cart-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div>
            <strong>${quantity} x ${product.name}</strong>
            <span style="display: block; font-size: 0.85rem;">Added to cart successfully!</span>
        </div>
        <a href="cart.html" style="color: white; text-decoration: underline; font-weight: 700;">View Cart</a>
    `;
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showNotification(message, type = 'success') {
    document.querySelectorAll('.cart-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.background = type === 'error' ? '#DC2626' : '#10B981';
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    
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
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

// ============================================
// Global Exports
// ============================================
window.changeMainImage = changeMainImage;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.setQuantity = setQuantity;
window.validateQuantity = validateQuantity;
window.validateQuantityInput = validateQuantityInput;
window.addToCartWithQuantity = addToCartWithQuantity;
window.shareProductWithImage = shareProductWithImage;
window.openImageZoom = openImageZoom;
window.closeImageZoom = closeImageZoom;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetZoom = resetZoom;
window.initializeAllGalaxyButtons = initializeAllGalaxyButtons;