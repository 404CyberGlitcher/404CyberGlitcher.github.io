// ============================================
// COLORMART - CART SYSTEM
// ============================================

class CartSystem {
    constructor() {
        this.cartKey = 'colormart-cart';
    }

    getCart() {
        try {
            return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
        } catch {
            return [];
        }
    }

    saveCart(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this.updateCartUI();
    }

    addItem(product, quantity = 1) {
        const cart = this.getCart();
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.salePrice || product.originalPrice,
                originalPrice: product.originalPrice,
                image: product.images?.[0] || 'assets/images/placeholder-product.jpg',
                quantity: quantity,
                category: product.category,
                brand: product.brand
            });
        }

        this.saveCart(cart);
        this.showNotification('Product added to cart!', 'success');
    }

    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart(cart);
        }
    }

    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= ENV.SITE.freeShippingThreshold ? 0 : 200;
    }

    getTotal() {
        return this.getSubtotal() + this.getShipping();
    }

    clearCart() {
        localStorage.removeItem(this.cartKey);
        this.updateCartUI();
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const total = this.getTotalItems();
            cartCount.textContent = total;
            cartCount.classList.toggle('active', total > 0);
        }

        // Update cart sidebar if open
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar?.classList.contains('active')) {
            this.renderCartSidebar();
        }
    }

    renderCartSidebar() {
        const cart = this.getCart();
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartFooter = document.getElementById('cart-footer');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const freeShippingMessage = document.getElementById('free-shipping-message');

        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-empty">
                        <p>Your cart is empty</p>
                        <a href="catalog.html" class="cta-button">Start Shopping</a>
                    </div>
                `;
                if (cartFooter) cartFooter.style.display = 'none';
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='assets/images/placeholder-product.jpg'">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${ENV.SITE.currencySymbol} ${item.price.toLocaleString()}</div>
                            <div class="cart-item-quantity">
                                <button onclick="cartSystem.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="cartSystem.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                            <button class="cart-item-remove" onclick="cartSystem.removeItem('${item.id}')">Remove</button>
                        </div>
                    </div>
                `).join('');

                if (cartFooter) cartFooter.style.display = 'block';

                const subtotal = this.getSubtotal();
                if (cartTotalAmount) {
                    cartTotalAmount.textContent = `${ENV.SITE.currencySymbol} ${subtotal.toLocaleString()}`;
                }

                if (freeShippingMessage) {
                    const threshold = ENV.SITE.freeShippingThreshold;
                    if (subtotal >= threshold) {
                        freeShippingMessage.classList.add('active');
                        freeShippingMessage.textContent = '🎉 You qualify for free shipping!';
                    } else {
                        freeShippingMessage.classList.remove('active');
                        const remaining = threshold - subtotal;
                        freeShippingMessage.textContent = `Add ${ENV.SITE.currencySymbol} ${remaining.toLocaleString()} more for free shipping`;
                    }
                }
            }
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Create global cart instance
const cartSystem = new CartSystem();
window.cartSystem = cartSystem;
export default cartSystem;