// ============================================
// COLORMART - ADMIN PANEL (ALL-IN-ONE)
// ============================================

import firebaseService from '../config/firebase.js';
import imageCompressor from '../utils/imageCompressor.js';
import discountCalculator from '../utils/discountCalculator.js';

class AdminPanel {
    constructor() {
        this.currentView = 'dashboard';
        this.products = [];
        this.orders = [];
        this.reviews = [];
        this.contacts = [];
        this.editingProduct = null;
        this.selectedImages = [];
        
        this.init();
    }

    async init() {
        // Check authentication
        const user = await firebaseService.getCurrentUser();
        
        if (!user) {
            this.showLoginScreen();
        } else {
            await this.showAdminScreen(user);
        }

        this.setupEventListeners();
    }

    // ============ AUTH ============
    
    showLoginScreen() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('admin-screen').style.display = 'none';
    }

    async showAdminScreen(user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-screen').style.display = 'flex';
        document.getElementById('admin-email-display').textContent = user.email;
        
        await this.loadDashboardData();
    }

    // ============ EVENT LISTENERS ============
    
    setupEventListeners() {
        // Login form
        document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', async () => {
            await this.handleLogout();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.switchView(view);
            });
        });

        // Product search
        document.getElementById('product-search')?.addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

        // Order filter
        document.getElementById('order-status-filter')?.addEventListener('change', (e) => {
            this.filterOrders(e.target.value);
        });

        // Add product button
        document.getElementById('add-product-btn')?.addEventListener('click', () => {
            this.openProductModal();
        });

        // Modal close buttons
        document.getElementById('modal-close')?.addEventListener('click', () => this.closeProductModal());
        document.getElementById('cancel-btn')?.addEventListener('click', () => this.closeProductModal());
        document.getElementById('order-modal-close')?.addEventListener('click', () => this.closeOrderModal());
        document.getElementById('contact-modal-close')?.addEventListener('click', () => this.closeContactModal());

        // Modal overlay clicks
        document.getElementById('product-modal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeProductModal();
        });
        document.getElementById('order-modal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeOrderModal();
        });
        document.getElementById('contact-modal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeContactModal();
        });

        // Product form
        document.getElementById('product-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveProduct();
        });

        // Product images
        document.getElementById('product-images')?.addEventListener('change', (e) => {
            this.handleImageSelection(e.target.files);
        });
    }

    // ============ AUTH HANDLERS ============
    
    async handleLogin() {
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value.trim();
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');
        const loginStatus = document.getElementById('login-status');
        const loginBtn = document.querySelector('.login-btn');

        // Reset errors
        emailError.textContent = '';
        passwordError.textContent = '';
        loginStatus.className = 'login-status';

        // Validate
        if (!email) {
            emailError.textContent = 'Email is required';
            return;
        }
        if (!email.includes('@')) {
            emailError.textContent = 'Please enter a valid email address';
            return;
        }
        if (!email.endsWith('@colormart.store')) {
            emailError.textContent = 'Only @colormart.store emails are allowed';
            return;
        }
        if (!password) {
            passwordError.textContent = 'Password is required';
            return;
        }
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            return;
        }

        try {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Signing in...';

            const user = await firebaseService.loginAdmin(email, password);
            
            loginStatus.className = 'login-status success';
            loginStatus.textContent = 'Login successful! Redirecting...';
            
            setTimeout(async () => {
                await this.showAdminScreen(user);
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            loginStatus.className = 'login-status error';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    loginStatus.textContent = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    loginStatus.textContent = 'Incorrect password';
                    break;
                case 'auth/invalid-email':
                    loginStatus.textContent = 'Invalid email address';
                    break;
                case 'auth/too-many-requests':
                    loginStatus.textContent = 'Too many attempts. Please try again later';
                    break;
                default:
                    loginStatus.textContent = 'Login failed. Please try again';
            }
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    }

    async handleLogout() {
        try {
            await firebaseService.logoutAdmin();
            this.showLoginScreen();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // ============ VIEW SWITCHING ============
    
    switchView(view) {
        this.currentView = view;

        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });

        // Update view title
        const titles = {
            dashboard: 'Dashboard',
            products: 'Manage Products',
            orders: 'Manage Orders',
            reviews: 'Manage Reviews',
            contacts: 'Contact Messages'
        };
        document.getElementById('view-title').textContent = titles[view] || view;

        // Show/hide views
        document.querySelectorAll('.view-content').forEach(v => v.classList.remove('active'));
        document.getElementById(`${view}-view`)?.classList.add('active');

        // Load data for view
        this.loadViewData(view);
    }

    async loadViewData(view) {
        switch (view) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'products':
                await this.loadProducts();
                break;
            case 'orders':
                await this.loadOrders();
                break;
            case 'reviews':
                await this.loadReviews();
                break;
            case 'contacts':
                await this.loadContacts();
                break;
        }
    }

    // ============ DASHBOARD ============
    
    async loadDashboardData() {
        try {
            const stats = await firebaseService.getDashboardStats();
            
            document.getElementById('total-products').textContent = stats.totalProducts;
            document.getElementById('total-orders').textContent = stats.totalOrders;
            document.getElementById('total-reviews').textContent = stats.totalReviews;
            document.getElementById('total-contacts').textContent = stats.totalContacts;

            // Load recent orders
            this.orders = await firebaseService.getOrders();
            this.renderRecentOrders();

            // Load recent reviews
            this.reviews = await firebaseService.getReviews();
            this.renderRecentReviews();
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    renderRecentOrders() {
        const tbody = document.getElementById('recent-orders-body');
        const recentOrders = this.orders.slice(0, 5);

        if (recentOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No orders yet</td></tr>';
            return;
        }

        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>#${order.id.substring(0, 8)}</td>
                <td>${order.firstName} ${order.lastName}</td>
                <td>${ENV.SITE.currencySymbol} ${order.total?.toLocaleString() || 0}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>${this.formatDate(order.createdAt)}</td>
            </tr>
        `).join('');
    }

    renderRecentReviews() {
        const container = document.getElementById('recent-reviews');
        const recentReviews = this.reviews.slice(0, 5);

        if (recentReviews.length === 0) {
            container.innerHTML = '<p>No reviews yet</p>';
            return;
        }

        container.innerHTML = recentReviews.map(review => `
            <div class="review-mini-item">
                <h4>${this.escapeHtml(review.name)} - ${'⭐'.repeat(review.rating)}</h4>
                <p>${this.escapeHtml(review.text.substring(0, 100))}...</p>
                <small>${this.formatDate(review.createdAt)}</small>
            </div>
        `).join('');
    }

    // ============ PRODUCTS ============
    
    async loadProducts() {
        try {
            this.products = await firebaseService.getProducts();
            this.renderProductsTable();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderProductsTable(filteredProducts = null) {
        const products = filteredProducts || this.products;
        const tbody = document.getElementById('products-table-body');

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No products found</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>
                    <img src="${product.images?.[0] || '../assets/images/placeholder-product.jpg'}" 
                         alt="${product.name}" 
                         class="product-thumbnail"
                         onerror="this.src='../assets/images/placeholder-product.jpg'">
                </td>
                <td>${this.escapeHtml(product.name)}</td>
                <td>${product.category}</td>
                <td>${ENV.SITE.currencySymbol} ${product.originalPrice?.toLocaleString() || 0}</td>
                <td>${product.salePrice ? `${ENV.SITE.currencySymbol} ${product.salePrice.toLocaleString()}` : '-'}</td>
                <td>${product.stock || 0}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="adminPanel.editProduct('${product.id}')">Edit</button>
                        <button class="delete-btn" onclick="adminPanel.deleteProduct('${product.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    openProductModal(product = null) {
        const modal = document.getElementById('product-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('product-form');

        this.editingProduct = product;
        this.selectedImages = [];

        if (product) {
            modalTitle.textContent = 'Edit Product';
            this.populateProductForm(product);
        } else {
            modalTitle.textContent = 'Add New Product';
            form.reset();
            document.getElementById('product-id').value = '';
        }

        document.getElementById('images-preview').innerHTML = '';
        modal.classList.add('active');
    }

    closeProductModal() {
        document.getElementById('product-modal')?.classList.remove('active');
        this.editingProduct = null;
        this.selectedImages = [];
        document.getElementById('images-preview').innerHTML = '';
    }

    populateProductForm(product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-category').value = product.category || '';
        document.getElementById('product-brand').value = product.brand || '';
        document.getElementById('product-original-price').value = product.originalPrice || '';
        document.getElementById('product-sale-price').value = product.salePrice || '';
        document.getElementById('product-stock').value = product.stock || 0;
        document.getElementById('product-description').value = product.description || '';

        if (product.images) {
            document.getElementById('images-preview').innerHTML = product.images.map(img => `
                <img src="${img}" alt="Product image">
            `).join('');
        }
    }

    async handleImageSelection(files) {
        try {
            const compressedFiles = await imageCompressor.compressMultipleImages(Array.from(files));
            this.selectedImages = compressedFiles;

            const preview = document.getElementById('images-preview');
            preview.innerHTML = compressedFiles.map(file => {
                const url = URL.createObjectURL(file);
                return `<img src="${url}" alt="New product image">`;
            }).join('');

            const totalSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
            document.getElementById('compression-info').innerHTML = `
                <span>Image compression: <strong>Complete</strong></span>
                <span>Total size: ${imageCompressor.formatFileSize(totalSize)}</span>
            `;
        } catch (error) {
            console.error('Error compressing images:', error);
            this.showNotification('Failed to process images', 'error');
        }
    }

    async saveProduct() {
        const productData = {
            name: document.getElementById('product-name').value.trim(),
            category: document.getElementById('product-category').value,
            brand: document.getElementById('product-brand').value.trim(),
            originalPrice: parseFloat(document.getElementById('product-original-price').value),
            salePrice: parseFloat(document.getElementById('product-sale-price').value) || null,
            stock: parseInt(document.getElementById('product-stock').value) || 0,
            description: document.getElementById('product-description').value.trim()
        };

        if (!productData.name || !productData.category || !productData.originalPrice) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const productId = document.getElementById('product-id').value;
        const saveBtn = document.getElementById('save-btn');

        try {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            if (this.selectedImages.length > 0) {
                const imageUrls = [];
                for (const file of this.selectedImages) {
                    const url = await firebaseService.uploadProductImage(file, productId || 'new-product');
                    imageUrls.push(url);
                }
                productData.images = imageUrls;
            }

            if (productId) {
                await firebaseService.updateProduct(productId, productData);
                this.showNotification('Product updated successfully!', 'success');
            } else {
                await firebaseService.addProduct(productData);
                this.showNotification('Product added successfully!', 'success');
            }

            this.closeProductModal();
            await this.loadProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            this.showNotification('Failed to save product', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Product';
        }
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.openProductModal(product);
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await firebaseService.deleteProduct(productId);
            this.showNotification('Product deleted successfully!', 'success');
            await this.loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification('Failed to delete product', 'error');
        }
    }

    searchProducts(query) {
        if (!query) {
            this.renderProductsTable();
            return;
        }

        const filtered = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand?.toLowerCase().includes(query.toLowerCase()) ||
            product.category?.toLowerCase().includes(query.toLowerCase())
        );

        this.renderProductsTable(filtered);
    }

    // ============ ORDERS ============
    
    async loadOrders() {
        try {
            this.orders = await firebaseService.getOrders();
            this.renderOrdersTable();
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    renderOrdersTable(filteredOrders = null) {
        const orders = filteredOrders || this.orders;
        const tbody = document.getElementById('orders-table-body');

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id.substring(0, 8)}</td>
                <td>${order.firstName} ${order.lastName}</td>
                <td>${order.email}</td>
                <td>${order.items?.length || 0} items</td>
                <td>${ENV.SITE.currencySymbol} ${order.total?.toLocaleString() || 0}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>
                    <button class="view-details-btn" onclick="adminPanel.viewOrderDetails('${order.id}')">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterOrders(status) {
        if (status === 'all') {
            this.renderOrdersTable();
        } else {
            const filtered = this.orders.filter(order => order.status === status);
            this.renderOrdersTable(filtered);
        }
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const content = document.getElementById('order-detail-content');
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
            </div>
            <div class="order-info-group">
                <h3>Order Items</h3>
                <div class="order-items-list">
                    ${order.items?.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <div class="order-item-details">
                                <div class="order-item-title">${this.escapeHtml(item.name)}</div>
                                <div class="order-item-qty-price">
                                    Qty: ${item.quantity} × ${ENV.SITE.currencySymbol} ${item.price?.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    `).join('') || '<p>No items</p>'}
                </div>
            </div>
            <div class="order-info-group">
                <h3>Totals</h3>
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
                <button class="update-status-btn" onclick="adminPanel.updateOrderStatus('${order.id}')">
                    Update Status
                </button>
            </div>
        `;

        document.getElementById('order-modal').classList.add('active');
    }

    closeOrderModal() {
        document.getElementById('order-modal')?.classList.remove('active');
    }

    async updateOrderStatus(orderId) {
        const newStatus = document.getElementById('status-update-select')?.value;
        if (!newStatus) return;

        try {
            await firebaseService.updateOrderStatus(orderId, newStatus);
            const order = this.orders.find(o => o.id === orderId);
            if (order) order.status = newStatus;
            
            this.renderOrdersTable();
            this.closeOrderModal();
            this.showNotification(`Order status updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error('Error updating order:', error);
            this.showNotification('Failed to update status', 'error');
        }
    }

    // ============ REVIEWS ============
    
    async loadReviews() {
        try {
            this.reviews = await firebaseService.getReviews();
            this.renderReviewsTable();
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    }

    renderReviewsTable() {
        const tbody = document.getElementById('reviews-table-body');

        if (this.reviews.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No reviews found</td></tr>';
            return;
        }

        tbody.innerHTML = this.reviews.map(review => `
            <tr>
                <td>${review.productName || review.productId?.substring(0, 8) || 'Unknown'}</td>
                <td>
                    <strong>${this.escapeHtml(review.name)}</strong><br>
                    <small>${review.email}</small>
                </td>
                <td><span class="rating-stars">${'⭐'.repeat(review.rating)}</span> (${review.rating}/5)</td>
                <td>
                    <div class="review-text-cell" title="${this.escapeHtml(review.text)}">
                        ${this.escapeHtml(review.text)}
                    </div>
                </td>
                <td>${this.formatDate(review.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="delete-review-btn" onclick="adminPanel.deleteReview('${review.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async deleteReview(reviewId) {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await firebaseService.deleteReview(reviewId);
            this.showNotification('Review deleted successfully', 'success');
            await this.loadReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            this.showNotification('Failed to delete review', 'error');
        }
    }

    // ============ CONTACTS ============
    
    async loadContacts() {
        try {
            this.contacts = await firebaseService.getContacts();
            this.renderContactsTable();
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }

    renderContactsTable() {
        const tbody = document.getElementById('contacts-table-body');

        if (this.contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No messages found</td></tr>';
            return;
        }

        tbody.innerHTML = this.contacts.map(contact => `
            <tr class="${!contact.read ? 'unread-row' : ''}">
                <td>
                    <span class="read-badge ${contact.read ? 'read' : 'unread'}"></span>
                    <strong>${this.escapeHtml(contact.name)}</strong>
                </td>
                <td><a href="mailto:${this.escapeHtml(contact.email)}">${this.escapeHtml(contact.email)}</a></td>
                <td>${contact.phone ? this.escapeHtml(contact.phone) : 'N/A'}</td>
                <td>
                    <div class="message-cell" title="${this.escapeHtml(contact.message)}">
                        ${this.escapeHtml(contact.message)}
                    </div>
                </td>
                <td>${this.formatDate(contact.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        ${!contact.read ? `
                            <button class="mark-read-btn" onclick="adminPanel.markContactAsRead('${contact.id}')">
                                Mark Read
                            </button>
                        ` : ''}
                        <button class="view-message-btn" onclick="adminPanel.viewContactMessage('${contact.id}')">
                            View
                        </button>
                        <button class="delete-message-btn" onclick="adminPanel.deleteContact('${contact.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    viewContactMessage(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;

        const content = document.getElementById('contact-detail-content');
        content.innerHTML = `
            <div class="order-info-group">
                <h3>Sender Information</h3>
                <p><strong>Name:</strong> ${this.escapeHtml(contact.name)}</p>
                <p><strong>Email:</strong> <a href="mailto:${this.escapeHtml(contact.email)}">${this.escapeHtml(contact.email)}</a></p>
                <p><strong>Phone:</strong> ${contact.phone ? this.escapeHtml(contact.phone) : 'N/A'}</p>
                <p><strong>Date:</strong> ${this.formatDate(contact.createdAt)}</p>
            </div>
            <div class="order-info-group">
                <h3>Message</h3>
                <p style="white-space: pre-wrap;">${this.escapeHtml(contact.message)}</p>
            </div>
            <div class="form-actions" style="margin-top: 2rem;">
                <button class="cancel-btn" onclick="adminPanel.closeContactModal()">Close</button>
                <a href="mailto:${this.escapeHtml(contact.email)}" class="save-btn" style="text-decoration: none; display: inline-block; padding: 0.75rem 1.5rem; background: #000; color: #fff; border-radius: 0.5rem;">
                    Reply via Email
                </a>
            </div>
        `;

        document.getElementById('contact-modal').classList.add('active');

        if (!contact.read) {
            this.markContactAsRead(contactId);
        }
    }

    closeContactModal() {
        document.getElementById('contact-modal')?.classList.remove('active');
    }

    async markContactAsRead(contactId) {
        try {
            await firebaseService.markContactAsRead(contactId);
            const contact = this.contacts.find(c => c.id === contactId);
            if (contact) contact.read = true;
            this.renderContactsTable();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }

    async deleteContact(contactId) {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await firebaseService.deleteContact(contactId);
            this.showNotification('Message deleted successfully', 'success');
            await this.loadContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
            this.showNotification('Failed to delete message', 'error');
        }
    }

    // ============ UTILITIES ============
    
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();
window.adminPanel = adminPanel;
export default adminPanel;