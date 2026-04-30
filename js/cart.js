// Cart Functionality - Anas Plastic Enterprises

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
    
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
    
    updateCartCountDisplay();
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummaryContainer = document.getElementById('cartSummary');
    const emptyCartContainer = document.getElementById('emptyCart');
    
    if (!cartItemsContainer) {
        console.error('Cart items container not found');
        return;
    }
    
    // Show empty cart state
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
        if (emptyCartContainer) emptyCartContainer.style.display = 'block';
        return;
    }
    
    // Show cart with items
    cartItemsContainer.style.display = 'flex';
    if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';
    if (emptyCartContainer) emptyCartContainer.style.display = 'none';
    
    // Render cart items
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        return `
            <div class="cart-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="cart-item-image">
                    <img src="${item.image || 'https://via.placeholder.com/150x150?text=Product'}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150x150?text=Product'">
                </div>
                <div class="cart-item-details">
                    <h4><a href="product-detail.html?id=${item.id}" style="color: inherit; text-decoration: none;">${item.name}</a></h4>
                    <span class="cart-item-category">${formatCategoryName(item.category)}</span>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateCartQuantity(${index}, ${item.quantity - 1})">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Render cart summary
    if (cartSummaryContainer) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const uniqueProducts = cart.length;
        
        cartSummaryContainer.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Total Products:</span>
                <span>${uniqueProducts}</span>
            </div>
            <div class="summary-row">
                <span>Total Items:</span>
                <span>${totalItems}</span>
            </div>
            <p class="summary-note">
                <i class="fas fa-info-circle"></i> 
                Prices will be discussed via WhatsApp after order submission
            </p>
            <a href="checkout.html" class="checkout-btn">
                <i class="fab fa-whatsapp"></i> Proceed to Checkout
            </a>
            <button class="clear-cart-btn" onclick="clearCart()">
                <i class="fas fa-trash"></i> Clear Cart
            </button>
        `;
    }
    
    // Re-initialize AOS
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
}

function updateCartQuantity(index, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
        renderCart();
        updateCartCountDisplay();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
        renderCart();
        updateCartCountDisplay();
        
        // Show removal notification
        showRemovalNotification(removedItem);
    }
}

function clearCart() {
    if (confirm('Are you sure you want to remove all items from your cart?')) {
        localStorage.removeItem('anasPlasticCart');
        renderCart();
        updateCartCountDisplay();
    }
}

function showRemovalNotification(item) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-trash-alt"></i>
        <span>${item.name} removed from cart</span>
        <button onclick="undoRemove(${item.id}, ${item.quantity})" style="background: white; color: #DC2626; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: 600;">Undo</button>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Store for undo
    window.lastRemovedItem = item;
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function undoRemove(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: window.lastRemovedItem?.name || 'Product',
            image: window.lastRemovedItem?.image || '',
            category: window.lastRemovedItem?.category || 'general',
            quantity: quantity
        });
    }
    
    localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
    renderCart();
    updateCartCountDisplay();
}

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
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.undoRemove = undoRemove;