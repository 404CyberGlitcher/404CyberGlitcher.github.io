// ============================================
// COLORMART - ADMIN ORDERS MANAGEMENT
// ============================================

import firebaseService from '../config/firebase.js';

class AdminOrders {
    constructor() {
        this.orders = [];
        this.currentFilter = 'all';
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadOrders();
    }

    setupEventListeners() {
        // Status filter
        document.getElementById('order-status-filter')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderOrdersTable();
        });

        // Order modal close
        document.getElementById('order-modal-close')?.addEventListener('click', () => {
            this.closeOrderModal();
        });

        // Close modal on overlay click
        document.getElementById('order-modal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeOrderModal();
            }
        });
    }

    async loadOrders() {
        try {
            this.orders = await firebaseService.getOrders();
            this.renderOrdersTable();
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showNotification('Failed to load orders', 'error');
        }
    }

    renderOrdersTable() {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        let filteredOrders = this.orders;
        
        if (this.currentFilter !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === this.currentFilter);
        }

        if (filteredOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>#${order.id.substring(0, 8)}</td>
                <td>${order.firstName} ${order.lastName}</td>
                <td>${order.email}</td>
                <td>${order.items?.length || 0} items</td>
                <td>${ENV.SITE.currencySymbol} ${order.total?.toLocaleString() || 0}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>
                    <button class="view-details-btn" onclick="adminOrders.viewOrderDetails('${order.id}')">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('order-modal');
        const content = document.getElementById('order-detail-content');

        if (!modal || !content) return;

        content.innerHTML = `
            <div class="order-info-group">
                <h3>Order Information</h3>
                <p><strong>Order ID:</strong> #${order.id}</p>
                <p><strong>Date:</strong> ${this.formatDate(order.createdAt)}</p>
                <p><strong>Status:</strong> <span class="status-badge ${order.status}">${order.status}</span></p>
            </div>

            <div class="order-info-group">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city} ${order.postalCode || ''}</p>
                ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
            </div>

            <div class="order-info-group">
                <h3>Order Items</h3>
                <div class="order-items-list">
                    ${order.items?.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" 
                                 alt="${item.name}" 
                                 class="order-item-image"
                                 onerror="this.src='../../assets/images/placeholder-product.jpg'">
                            <div class="order-item-details">
                                <div class="order-item-title">${item.name}</div>
                                <div class="order-item-qty-price">
                                    Qty: ${item.quantity} × ${ENV.SITE.currencySymbol} ${item.price?.toLocaleString()}
                                </div>
                            </div>
                            <div class="order-item-price">
                                ${ENV.SITE.currencySymbol} ${(item.price * item.quantity)?.toLocaleString()}
                            </div>
                        </div>
                    `).join('') || '<p>No items</p>'}
                </div>
            </div>

            <div class="order-info-group">
                <h3>Order Totals</h3>
                <p><strong>Subtotal:</strong> ${ENV.SITE.currencySymbol} ${order.subtotal?.toLocaleString() || 0}</p>
                <p><strong>Shipping:</strong> ${order.shipping === 0 ? 'FREE' : `${ENV.SITE.currencySymbol} ${order.shipping?.toLocaleString()}`}</p>
                <p><strong>Total:</strong> ${ENV.SITE.currencySymbol} ${order.total?.toLocaleString() || 0}</p>
            </div>

            <div class="status-update">
                <h3>Update Status</h3>
                <select id="status-update-select">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                <button class="update-status-btn" onclick="adminOrders.updateOrderStatus('${order.id}')">
                    Update Status
                </button>
            </div>
        `;

        modal.classList.add('active');
    }

    closeOrderModal() {
        const modal = document.getElementById('order-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async updateOrderStatus(orderId) {
        const newStatus = document.getElementById('status-update-select')?.value;
        if (!newStatus) return;

        try {
            await firebaseService.updateOrderStatus(orderId, newStatus);
            
            // Update local data
            const order = this.orders.find(o => o.id === orderId);
            if (order) {
                order.status = newStatus;
            }
            
            this.renderOrdersTable();
            this.closeOrderModal();
            this.showNotification(`Order status updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error('Error updating order status:', error);
            this.showNotification('Failed to update order status', 'error');
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize admin orders
const adminOrders = new AdminOrders();
window.adminOrders = adminOrders;
export default adminOrders;