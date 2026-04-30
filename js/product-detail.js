// Product Detail Page - Anas Plastic Enterprises

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product-detail.html')) {
        loadProductDetail();
    }
});

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    // Find product from the products array (defined in products.js)
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    // Update page title and meta
    document.title = `${product.name} - Anas Plastic Enterprises`;
    document.getElementById('pageTitle').textContent = `${product.name} - Anas Plastic Enterprises`;
    document.getElementById('pageDescription').setAttribute('content', product.description);
    
    renderProductDetail(product);
}

function renderProductDetail(product) {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;

    const productUrl = window.location.href;

    container.innerHTML = `
        <div class="product-detail-wrapper" data-aos="fade-up">
            <!-- Product Images -->
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.images[0]}" alt="${product.name}" id="mainImage" onerror="this.src='assets/img/placeholder.png'">
                    ${product.badge ? `<span class="detail-badge">${product.badge}</span>` : ''}
                </div>
                ${product.images.length > 1 ? `
                <div class="thumbnail-gallery">
                    ${product.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                            <img src="${img}" alt="${product.name} - Image ${index + 1}" onerror="this.src='assets/img/placeholder.png'">
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
                        <button class="qty-btn" onclick="decreaseQuantity()">-</button>
                        <input type="number" id="quantity" value="1" min="1" max="100" readonly>
                        <button class="qty-btn" onclick="increaseQuantity()">+</button>
                    </div>
                    
                    <div class="galaxy-button-wrapper">
                        <div class="galaxy-button">
                            <button onclick="addToCartWithQuantity(${product.id})">
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
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                        <span class="star"></span>
                                    </span>
                                </span>
                                <span class="text">Add to Cart</span>
                            </button>
                            <div class="bodydrop"></div>
                        </div>
                    </div>
                    
                    <button class="share-detail-btn" onclick="shareProduct(${JSON.stringify(product).replace(/"/g, '&quot;')}, '${productUrl}')">
                        <i class="fas fa-share-alt"></i> Share Product
                    </button>
                    
                    <a href="https://wa.me/923000841330?text=${encodeURIComponent(`Hi, I'm interested in: ${product.name}\nProduct: ${productUrl}`)}" target="_blank" class="whatsapp-inquiry-btn">
                        <i class="fab fa-whatsapp"></i> Inquire via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Change Main Image
function changeMainImage(imageSrc, thumbnailElement) {
    document.getElementById('mainImage').src = imageSrc;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnailElement.classList.add('active');
}

// Quantity Controls
function increaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    qtyInput.value = parseInt(qtyInput.value) + 1;
}

function decreaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    if (parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
    }
}

// Add to Cart with Quantity
function addToCartWithQuantity(productId) {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const product = products.find(p => p.id === productId);
    if (!product) return;

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
    updateCartCount();
    
    // Show success notification
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