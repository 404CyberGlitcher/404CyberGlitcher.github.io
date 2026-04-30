// Product Detail Page - Anas Plastic Enterprises

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
    if (typeof initializeGalaxyButtons === 'function') {
        initializeGalaxyButtons();
    }
    
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
    document.title = `${product.name} - Anas Plastic Enterprises`;
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
    
    renderProductDetail(product);
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

    container.innerHTML = `
        <div class="product-detail-wrapper" data-aos="fade-up">
            <!-- Product Images -->
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.images[0]}" alt="${product.name}" id="mainImage" onerror="this.src='https://via.placeholder.com/600x600?text=Product+Image'">
                    ${product.badge ? `<span class="detail-badge">${product.badge}</span>` : ''}
                </div>
                ${product.images.length > 1 ? `
                <div class="thumbnail-gallery">
                    ${product.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                            <img src="${img}" alt="${product.name} - View ${index + 1}" onerror="this.src='https://via.placeholder.com/100x100?text=Image'">
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>

            <!-- Product Info -->
            <div class="product-info-detail">
                <span class="detail-category">${formatCategoryName(product.category)}</span>
                <h1 class="detail-name">${product.name}</h1>
                
                <div class="detail-rating">
                    ${generateStarRating(product.rating)}
                    <span>${product.rating} / 5</span>
                </div>
                
                <div class="detail-description">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                </div>
                
                <div class="detail-specifications">
                    <h3>Specifications</h3>
                    <table class="specs-table">
                        ${Object.entries(product.specifications).map(([key, value]) => `
                            <tr>
                                <td>${key}</td>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <div class="detail-actions">
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <button class="qty-btn" onclick="decreaseQuantity()">−</button>
                        <input type="number" id="quantity" value="1" min="1" max="100" readonly>
                        <button class="qty-btn" onclick="increaseQuantity()">+</button>
                    </div>
                    
                    <div class="galaxy-button-wrapper">
                        <div class="galaxy-button">
                            <button onclick="addToCartWithQuantity(${product.id})" type="button">
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
                                <span class="text">Add to Cart</span>
                            </button>
                            <div class="bodydrop"></div>
                        </div>
                    </div>
                    
                    <button class="share-detail-btn" onclick="shareProductDetail(${product.id})" type="button">
                        <i class="fas fa-share-alt"></i> Share Product
                    </button>
                    
                    <a href="https://wa.me/923000841330?text=${encodeURIComponent(`Hi, I'm interested in: ${product.name}\n\nProduct: ${productUrl}`)}" target="_blank" class="whatsapp-inquiry-btn">
                        <i class="fab fa-whatsapp"></i> Inquire via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Re-initialize galaxy buttons for new elements
    if (typeof initializeGalaxyButtons === 'function') {
        setTimeout(() => initializeGalaxyButtons(), 200);
    }
    
    // Re-initialize AOS
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 200);
    }
}

// Change Main Image
function changeMainImage(imageSrc, thumbnailElement) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 50);
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    if (thumbnailElement) {
        thumbnailElement.classList.add('active');
    }
}

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
    
    // Show success notification
    showAddToCartNotification(product, quantity);
}

// Share Product Detail
function shareProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: `Check out ${product.name} from Anas Plastic Enterprises`,
            url: productUrl
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(productUrl).then(() => {
            showNotification('Product link copied to clipboard!');
        }).catch(() => {
            prompt('Copy this link:', productUrl);
        });
    }
}

// Show Notification
function showAddToCartNotification(product, quantity) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${quantity} x ${product.name} added to cart!</span>
        <a href="cart.html">View Cart</a>
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
    }, 2000);
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