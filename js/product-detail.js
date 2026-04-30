// Product Detail Page - Anas Plastic Enterprises
// Professional Version with Image Sharing Support

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
            mirror: false        });
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
    
    // Check if products array exists
    if (typeof products === 'undefined') {
        console.error('Products data not loaded');
        showProductNotFound();
        return;
    }
    
    // Find product from the products array
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showProductNotFound();
        return;
    }
    
    // Update page title and meta
    document.title = `${product.name} - Anas Plastic Enterprises | Premium Cosmetic Packaging`;
    const pageTitle = document.getElementById('pageTitle');
    const pageDescription = document.getElementById('pageDescription');
    
    if (pageTitle) {
        pageTitle.textContent = `${product.name} - Anas Plastic Enterprises`;
    }
    if (pageDescription) {
        pageDescription.setAttribute('content', product.description.substring(0, 160));
    }
    
    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.href = `https://www.anasplastic.com/product-detail?id=${product.id}`;
    }
    
    // Update Open Graph tags for sharing
    updateOpenGraphTags(product);
    
    renderProductDetail(product);
}

function updateOpenGraphTags(product) {
    // Update or create OG tags for better sharing
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
    const shareText = encodeURIComponent(`Check out ${product.name} from Anas Plastic Enterprises - Premium Cosmetic Packaging Solutions`);
    const whatsappText = encodeURIComponent(`Hi, I'm interested in this product:\n\n*${product.name}*\n\n${product.description}\n\nLink: ${productUrl}`);

    container.innerHTML = `
        <div class="product-detail-wrapper" data-aos="fade-up">
            <!-- Product Images -->
            <div class="product-gallery">
                <div class="main-image-container">
                    <div class="main-image">
                        <img src="${product.images[0]}" alt="${product.name}" id="mainImage" onerror="this.src='https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}'">
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
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this, ${index})">
                            <img src="${img}" alt="${product.name} - View ${index + 1}" onerror="this.src='https://via.placeholder.com/100x100?text=Image'">
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
                        <span class="rating-count">(24 reviews)</span>
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
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="decreaseQuantity()" aria-label="Decrease quantity">−</button>
                            <input type="number" id="quantity" value="1" min="1" max="100" readonly aria-label="Quantity">
                            <button class="qty-btn" onclick="increaseQuantity()" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    
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
                        
                        <button class="share-detail-btn" onclick="shareProductWithImage(${product.id})" type="button" aria-label="Share product">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                        
                        <a href="https://wa.me/923000841330?text=${whatsappText}" target="_blank" class="whatsapp-inquiry-btn" aria-label="Inquire via WhatsApp">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
                
                <!-- Additional Info -->
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
            <span class="close-zoom">&times;</span>
            <img id="zoomedImage" src="" alt="Zoomed product image">
        </div>
    `;
    
    // Re-initialize galaxy buttons
    setTimeout(() => {
        initializeAllGalaxyButtons();
    }, 300);
    
    // Re-initialize AOS
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 300);
    }
}

// Initialize all galaxy buttons
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

// Change Main Image
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
}

// Open Image Zoom
function openImageZoom(imageSrc) {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');
    
    if (modal && zoomedImg) {
        zoomedImg.src = imageSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close Image Zoom
function closeImageZoom() {
    const modal = document.getElementById('imageZoomModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close zoom with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageZoom();
    }
});

// Quantity Controls
function increaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    }
}

function decreaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput && parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
    }
}

// Add to Cart with Quantity
function addToCartWithQuantity(productId) {
    const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
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

// Animate add to cart button
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

// Share Product with Image
async function shareProductWithImage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productUrl = window.location.href;
    const shareData = {
        title: product.name,
        text: `Check out ${product.name} from Anas Plastic Enterprises - Premium Cosmetic Packaging Solutions\n\n${product.description.substring(0, 100)}...`,
        url: productUrl
    };
    
    // Try native sharing with image
    if (navigator.share) {
        try {
            // Try to fetch image as blob for sharing
            const imageResponse = await fetch(product.images[0]);
            const imageBlob = await imageResponse.blob();
            const imageFile = new File([imageBlob], `${product.name}.jpg`, { type: 'image/jpeg' });
            
            shareData.files = [imageFile];
            
            await navigator.share(shareData);
        } catch (err) {
            // Fallback to sharing without image
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} from Anas Plastic Enterprises\n${productUrl}`,
                });
            } catch (fallbackErr) {
                // Copy to clipboard
                copyToClipboard(productUrl, product);
            }
        }
    } else {
        // Fallback for desktop
        copyToClipboard(productUrl, product);
    }
}

// Copy to clipboard fallback
function copyToClipboard(url, product) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification(`Link copied! Share ${product.name} with your contacts.`);
    }).catch(() => {
        // Last resort: show prompt
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showNotification('Link copied to clipboard!');
    });
}

// Show Notifications
function showAddToCartNotification(product, quantity) {
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
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
    }, 2500);
}

// Update Cart Count
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

// Make functions globally available
window.changeMainImage = changeMainImage;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addToCartWithQuantity = addToCartWithQuantity;
window.shareProductWithImage = shareProductWithImage;
window.openImageZoom = openImageZoom;
window.closeImageZoom = closeImageZoom;
window.initializeAllGalaxyButtons = initializeAllGalaxyButtons;