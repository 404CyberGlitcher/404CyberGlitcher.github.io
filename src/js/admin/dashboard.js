// ============================================
// COLORMART - ADMIN DASHBOARD SCRIPT
// ============================================

import firebaseService from '../config/firebase.js';

class AdminDashboard {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadStats();
        await this.loadRecentOrders();
        await this.loadRecentReviews();
    }

    async loadStats() {
        try {
            const stats = await firebaseService.getDashboardStats();
            
            document.getElementById('total-products').textContent = stats.totalProducts;
            document.getElementById('total-orders').textContent = stats.totalOrders;
            document.getElementById('total-reviews').textContent = stats.totalReviews;
            document.getElementById('total-contacts').textContent = stats.totalContacts;
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async loadRecentOrders() {
        const tbody = document.getElementById('recent-orders-body');
        if (!tbody) return;

        try {
            const orders = await firebaseService.getOrders();
            const recentOrders = orders.slice(0, 5);

            if (recentOrders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">No orders yet</td></tr>';
                return;
            }

            tbody.innerHTML = recentOrders.map(order => `
                <tr>
                    <td>#${order.id.substring(0, 8)}</td>
                    <td>${order.firstName} ${order.lastName}</td>
                    <td>${ENV.SITE.currencySymbol} ${order.total.toLocaleString()}</td>
                    <td><span class="status-badge ${order.status}">${order.status}</span></td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading recent orders:', error);
            tbody.innerHTML = '<tr><td colspan="5">Failed to load orders</td></tr>';
        }
    }

    async loadRecentReviews() {
        const container = document.getElementById('recent-reviews');
        if (!container) return;

        try {
            const reviews = await firebaseService.getReviews();
            const recentReviews = reviews.slice(0, 5);

            if (recentReviews.length === 0) {
                container.innerHTML = '<p>No reviews yet</p>';
                return;
            }

            container.innerHTML = recentReviews.map(review => `
                <div class="review-mini-item">
                    <h4>${review.name} - ${'⭐'.repeat(review.rating)}</h4>
                    <p>${review.text.substring(0, 100)}...</p>
                    <small>${new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading recent reviews:', error);
            container.innerHTML = '<p>Failed to load reviews</p>';
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});