// ============================================
// COLORMART - ORDER CONFIRMATION PAGE SCRIPT
// ============================================

import firebaseService from './config/firebase.js';

class OrderConfirmation {
    constructor() {
        this.orderId = null;
        this.init();
    }

    async init() {
        this.orderId = this.getOrderIdFromURL();
        
        if (this.orderId) {
            await this.loadOrderDetails();
        } else {
            this.showDefaultMessage();
        }
    }

    getOrderIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async loadOrderDetails() {
        try {
            const orders = await firebaseService.getOrders();
            const order = orders.find(o => o.id === this.orderId);

            if (order) {
                this.renderOrderDetails(order);
            } else {
                this.showDefaultMessage();
            }
        } catch (error) {
            console.error('Error loading order:', error);
            this.showDefaultMessage();
        }
    }

    renderOrderDetails(order) {
        document.getElementById('order-number').textContent = order.id;
        
        const orderDetails = document.getElementById('order-details');
        if (orderDetails) {
            orderDetails.innerHTML = `
                <div class="order-detail-row">
                    <span>Order Date:</span>
                    <span>${new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>
                <div class="order-detail-row">
                    <span>Customer:</span>
                    <span>${order.firstName} ${order.lastName}</span>
                </div>
                <div class="order-detail-row">
                    <span>Email:</span>
                    <span>${order.email}</span>
                </div>
                <div class="order-detail-row">
                    <span>Subtotal:</span>
                    <span>${ENV.SITE.currencySymbol} ${order.subtotal.toLocaleString()}</span>
                </div>
                <div class="order-detail-row">
                    <span>Shipping:</span>
                    <span>${order.shipping === 0 ? 'FREE' : `${ENV.SITE.currencySymbol} ${order.shipping.toLocaleString()}`}</span>
                </div>
                <div class="order-detail-row total">
                    <span>Total:</span>
                    <span>${ENV.SITE.currencySymbol} ${order.total.toLocaleString()}</span>
                </div>
            `;
        }
    }

    showDefaultMessage() {
        document.getElementById('order-number').textContent = 'N/A';
        const orderDetails = document.getElementById('order-details');
        if (orderDetails) {
            orderDetails.innerHTML = '<p>Order details not available. Please check your email for confirmation.</p>';
        }
    }
}

// Initialize confirmation page
document.addEventListener('DOMContentLoaded', () => {
    new OrderConfirmation();
});