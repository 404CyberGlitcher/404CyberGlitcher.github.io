// ============================================
// Cart Functionality - Anas Plastic Enterprises
// Complete with Custom Quantity, Clear All, Min 100
// ============================================

document.addEventListener('DOMContentLoaded', function() {
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
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="cart-item-image">
                <img src="${item.image || 'https://via.placeholder.com/150x150?text=Product'}" 
                     alt="${item.name}" 
                     onerror="this.src='https://via.placeholder.com/150x150?text=Product'">
            </div>
            <div class="cart-item-details">
                <h4><a href="product-detail.html?id=${item.id}" style="color: inherit; text-decoration: none;">${item.name}</a></h4>
                <span class="cart-item-category">${formatCategoryName(item.category)}</span>
                
                <!-- Quantity Controls with Custom Input -->
                <div class="cart-quantity-controls">
                    <label style="font-size: 0.85rem; font-weight: 600; color: #6B7280;">Quantity:</label>
                    <div class="cart-quantity-row">
                        <button class="cart-qty-btn" onclick="updateCartQuantity(${index}, ${(item.quantity || 100) - 100})" title="Decrease by 100">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                               class="cart-qty-input" 
                               value="${item.quantity || 100}" 
                               min="100" 
                               step="100"
                               onchange="updateCartQuantityCustom(${index}, this.value)"
                               onkeypress="return event.keyCode !== 13"
                               title="Minimum 100 units">
                        <button class="cart-qty-btn" onclick="updateCartQuantity(${index}, ${(item.quantity || 100) + 100})" title="Increase by 100">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="quick-qty-btns">
                        <button class="quick-cart-qty" onclick="updateCartQuantity(${index}, 100)">100</button>
                        <button class="quick-cart-qty" onclick="updateCartQuantity(${index}, 500)">500</button>
                        <button class="quick-cart-qty" onclick="updateCartQuantity(${index}, 1000)">1K</button>
                        <button class="quick-cart-qty" onclick="updateCartQuantity(${index}, 5000)">5K</button>
                    </div>
                    ${(item.quantity || 0) < 100 ? `
                        <span style="color: #DC2626; font-size: 0.8rem; font-weight: 600;">
                            <i class="fas fa-exclamation-triangle"></i> Minimum 100 units required
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Render cart summary
    if (cartSummaryContainer) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const uniqueProducts = cart.length;
        const hasInvalidQuantity = cart.some(item => (item.quantity || 0) < 100);
        
        cartSummaryContainer.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Total Products:</span>
                <span>${uniqueProducts}</span>
            </div>
            <div class="summary-row">
                <span>Total Items:</span>
                <span>${totalItems.toLocaleString()} units</span>
            </div>
            ${hasInvalidQuantity ? `
                <p class="summary-warning">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Some items are below the minimum order quantity of 100 units.
                </p>
            ` : ''}
            <p class="summary-note">
                <i class="fas fa-info-circle"></i> 
                Prices will be discussed via WhatsApp after order submission. Minimum order: 100 units per product.
            </p>
            
            <!-- Galaxy Button for Checkout -->
            <div class="galaxy-button-wrapper" style="display: flex; justify-content: center; margin-bottom: 15px;">
                <div class="galaxy-button">
                    <button onclick="proceedToCheckout()" type="button" ${hasInvalidQuantity ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
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
                        <span class="text"><i class="fab fa-whatsapp"></i> Proceed to Checkout</span>
                    </button>
                    <div class="bodydrop"></div>
                </div>
            </div>
            
            <!-- Clear Cart Button -->
            <button class="clear-cart-btn" onclick="clearEntireCart()">
                <i class="fas fa-trash"></i> Clear Cart
            </button>
        `;
    }
    
    // Initialize galaxy buttons
    setTimeout(() => {
        if (typeof initializeAllGalaxyButtons === 'function') {
            initializeAllGalaxyButtons();
        }
    }, 300);
    
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
}

// ============================================
// Cart Quantity Functions
// ============================================

// Update quantity by adding/subtracting 100
function updateCartQuantity(index, newQuantity) {
    if (newQuantity < 100) {
        // Show confirmation for removal
        showMinQuantityWarning(index);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
        renderCart();
        updateCartCountDisplay();
        showQuantityUpdateNotification(cart[index]);
    }
}

// Update quantity with custom value
function updateCartQuantityCustom(index, customValue) {
    let newQuantity = parseInt(customValue);
    
    // Validate
    if (isNaN(newQuantity) || newQuantity < 100) {
        newQuantity = 100;
        showMinQuantityNotification();
    }
    
    // Round to nearest 100
    newQuantity = Math.round(newQuantity / 100) * 100;
    if (newQuantity < 100) newQuantity = 100;
    
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
        renderCart();
        updateCartCountDisplay();
    }
}

// Show warning when trying to go below 100
function showMinQuantityWarning(index) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.background = '#F59E0B';
    notification.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <div>
            <strong>Minimum 100 units required</strong>
            <span style="display: block; font-size: 0.85rem;">Would you like to remove this item instead?</span>
        </div>
        <button onclick="removeFromCart(${index}); this.parentElement.remove();" 
                style="background: white; color: #DC2626; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 700;">
            Remove
        </button>
    `;
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showMinQuantityNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.background = '#F59E0B';
    notification.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>Minimum quantity is 100 units. Quantity adjusted to 100.</span>
    `;
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

function showQuantityUpdateNotification(item) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.background = '#10B981';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${item.name}: ${item.quantity.toLocaleString()} units</span>
    `;
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============================================
// Cart Item Removal
// ============================================
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
        renderCart();
        updateCartCountDisplay();
        
        // Show removal notification with undo
        showRemovalNotification(removedItem);
    }
}

function clearEntireCart() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    if (cart.length === 0) return;
    
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'clear-cart-modal';
    modal.innerHTML = `
        <div class="clear-cart-modal-content">
            <div class="clear-cart-modal-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Clear Entire Cart?</h3>
            <p>You have ${cart.length} product(s) with a total of ${cart.reduce((sum, item) => sum + (item.quantity || 0), 0).toLocaleString()} units in your cart.</p>
            <p style="color: #DC2626; font-weight: 600;">This action cannot be undone!</p>
            <div class="clear-cart-modal-actions">
                <button class="cancel-clear-btn" onclick="this.closest('.clear-cart-modal').remove()">Cancel</button>
                <button class="confirm-clear-btn" onclick="confirmClearCart()">Yes, Clear Cart</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));
}

function confirmClearCart() {
    localStorage.removeItem('anasPlasticCart');
    updateCartCountDisplay();
    renderCart();
    
    // Remove modal
    document.querySelector('.clear-cart-modal')?.remove();
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.background = '#DC2626';
    notification.innerHTML = `
        <i class="fas fa-trash"></i>
        <span>Cart cleared successfully</span>
    `;
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

function showRemovalNotification(item) {
    document.querySelectorAll('.cart-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.background = '#DC2626';
    notification.innerHTML = `
        <i class="fas fa-trash-alt"></i>
        <span>${item.name} removed</span>
        <button onclick="undoRemoveItem(${item.id}, ${item.quantity || 100}, this.parentElement)" 
                style="background: white; color: #DC2626; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 0.85rem;">
            Undo
        </button>
    `;
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    
    // Store for undo
    window.lastRemovedItem = item;
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function undoRemoveItem(productId, quantity, notificationElement) {
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += (quantity || 100);
    } else {
        const removedItem = window.lastRemovedItem;
        cart.push({
            id: productId,
            name: removedItem?.name || 'Product',
            image: removedItem?.image || '',
            category: removedItem?.category || 'general',
            quantity: quantity || 100
        });
    }
    
    localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
    renderCart();
    updateCartCountDisplay();
    
    if (notificationElement) {
        notificationElement.remove();
    }
}

// ============================================
// Checkout Navigation
// ============================================
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    // Check minimum quantities
    const hasInvalidQuantity = cart.some(item => (item.quantity || 0) < 100);
    
    if (hasInvalidQuantity) {
        showMinQuantityWarning(-1);
        return;
    }
    
    if (cart.length === 0) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.style.background = '#F59E0B';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Your cart is empty. Please add products first.</span>
        `;
        
        document.body.appendChild(notification);
        requestAnimationFrame(() => notification.classList.add('show'));
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2500);
        return;
    }
    
    window.location.href = 'checkout.html';
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

// Initialize galaxy buttons if function exists
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
// Global Exports
// ============================================
window.updateCartQuantity = updateCartQuantity;
window.updateCartQuantityCustom = updateCartQuantityCustom;
window.removeFromCart = removeFromCart;
window.clearEntireCart = clearEntireCart;
window.confirmClearCart = confirmClearCart;
window.undoRemoveItem = undoRemoveItem;
window.proceedToCheckout = proceedToCheckout;
window.initializeAllGalaxyButtons = initializeAllGalaxyButtons;
window.updateCartCount = updateCartCountDisplay;