// ============================================
// COLORMART - CHECKOUT PAGE SCRIPT
// ============================================

import firebaseService from './config/firebase.js';
import emailService from './utils/emailService.js';

class CheckoutPage {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });

        this.loadCart();
        this.setupFormValidation();
        this.setupEventListeners();
    }

    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('colormart-cart') || '[]');
        
        if (this.cart.length === 0) {
            window.location.href = 'catalog.html';
            return;
        }

        this.renderOrderSummary();
    }

    renderOrderSummary() {
        const cartItemsContainer = document.getElementById('checkout-cart-items');
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="checkout-cart-item">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     class="checkout-cart-item-image"
                     onerror="this.src='../assets/images/placeholder-product.jpg'">
                <div class="checkout-cart-item-details">
                    <div class="checkout-cart-item-title">${item.name}</div>
                    <div class="checkout-cart-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="checkout-cart-item-price">
                    ${ENV.SITE.currencySymbol} ${(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        `).join('');

        this.updateTotals();
    }

    updateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= ENV.SITE.freeShippingThreshold ? 0 : 200;
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `${ENV.SITE.currencySymbol} ${subtotal.toLocaleString()}`;
        
        const shippingEl = document.getElementById('shipping-cost');
        if (shipping === 0) {
            shippingEl.innerHTML = '<span class="free-shipping-badge">FREE</span>';
        } else {
            shippingEl.textContent = `${ENV.SITE.currencySymbol} ${shipping.toLocaleString()}`;
        }
        
        document.getElementById('total').textContent = `${ENV.SITE.currencySymbol} ${total.toLocaleString()}`;
    }

    setupEventListeners() {
        const form = document.getElementById('checkout-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.placeOrder();
        });
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('#checkout-form input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.style.borderColor = '#d1d5db';
                } else {
                    input.style.borderColor = '#dc2626';
                }
            });
        });
    }

    async placeOrder() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const postalCode = document.getElementById('postal-code').value.trim();
        const notes = document.getElementById('notes').value.trim();

        if (!firstName || !lastName || !email || !phone || !address || !city) {
            alert('Please fill in all required fields');
            return;
        }

        if (!this.validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        const submitBtn = document.querySelector('.place-order-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Placing Order...';

        try {
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = subtotal >= ENV.SITE.freeShippingThreshold ? 0 : 200;
            const total = subtotal + shipping;

            const orderData = {
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                postalCode,
                notes,
                items: this.cart,
                subtotal,
                shipping,
                total,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Save order to Firebase
            const order = await firebaseService.addOrder(orderData);
            
            // Send confirmation emails
            await emailService.sendOrderConfirmationToCustomer({
                ...orderData,
                orderId: order.id
            });
            
            await emailService.sendOrderNotificationToStaff({
                ...orderData,
                orderId: order.id
            });

            // Clear cart
            localStorage.removeItem('colormart-cart');
            
            // Redirect to confirmation
            window.location.href = `order-confirmation.html?id=${order.id}`;

        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutPage();
});