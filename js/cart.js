// Cart Functionality - Anas Plastic Enterprises

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    const cartContainer = document.getElementById('cartContainer');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartItems.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'block';
    emptyCart.style.display = 'none';
    
    // Render cart items
    cartItems.innerHTML = cart.map((item, index) => {
        const product = products.find(p => p.id === item.id);
        return `
            <div class="cart-item" data-aos="fade-up">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/img/placeholder.png'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span class="cart-item-category">${formatCategoryName(item.category)}</span>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateCartQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Render cart summary
    if (cartSummary) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Total Items:</span>
                <span>${totalItems}</span>
            </div>
            <div class="summary-row">
                <span>Products:</span>
                <span>${cart.length}</span>
            </div>
            <p class="summary-note">Prices will be discussed via WhatsApp</p>
            <a href="checkout.html" class="checkout-btn">
                <i class="fab fa-whatsapp"></i> Proceed to Checkout
            </a>
            <button class="clear-cart-btn" onclick="clearCart()">
                <i class="fas fa-trash"></i> Clear Cart
            </button>
        `;
    }
}

function updateCartQuantity(index, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    cart[index].quantity = newQuantity;
    localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('anasPlasticCart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('anasPlasticCart');
        renderCart();
        updateCartCount();
    }
}