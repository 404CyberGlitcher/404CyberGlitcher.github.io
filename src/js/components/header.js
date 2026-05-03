// ============================================
// COLORMART - HEADER COMPONENT
// ============================================

class HeaderComponent {
    constructor() {
        this.headerContainer = document.getElementById('header-container');
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const headerHTML = `
            <header class="site-header">
                <div class="header-container">
                    <div class="logo-container">
                        <a href="${this.getHomePath()}" class="logo" aria-label="${ENV.SITE.name} Home">
                            <img src="${this.getAssetPath('assets/images/logo.svg')}" alt="${ENV.SITE.name}">
                        </a>
                    </div>
                    
                    <nav class="main-nav" aria-label="Main navigation">
                        <a href="${this.getHomePath()}" class="nav-link">Home</a>
                        <a href="${this.getPagePath('catalog.html')}" class="nav-link">Catalog</a>
                        <a href="${this.getPagePath('contact.html')}" class="nav-link">Contact</a>
                    </nav>
                    
                    <div class="header-actions">
                        <button class="search-toggle" aria-label="Search">
                            🔍
                        </button>
                        <button class="cart-toggle" aria-label="Shopping cart">
                            🛒
                            <span class="cart-count" id="cart-count">0</span>
                        </button>
                        <button class="mobile-menu-toggle" aria-label="Menu">
                            ☰
                        </button>
                    </div>
                </div>
            </header>

            <!-- Search Overlay -->
            <div class="search-overlay" id="search-overlay">
                <div class="search-container">
                    <input type="text" placeholder="Search products..." id="search-input" aria-label="Search products">
                </div>
                <button class="search-close" aria-label="Close search">✕</button>
            </div>

            <!-- Mobile Menu -->
            <div class="mobile-menu" id="mobile-menu">
                <div class="mobile-menu-header">
                    <h3>Menu</h3>
                    <button class="mobile-menu-close" aria-label="Close menu">✕</button>
                </div>
                <nav class="mobile-nav" aria-label="Mobile navigation">
                    <a href="${this.getHomePath()}" class="mobile-nav-link">Home</a>
                    <a href="${this.getPagePath('catalog.html')}" class="mobile-nav-link">Catalog</a>
                    <a href="${this.getPagePath('contact.html')}" class="mobile-nav-link">Contact</a>
                </nav>
            </div>

            <!-- Cart Sidebar -->
            <div class="cart-sidebar" id="cart-sidebar">
                <div class="cart-header">
                    <h3>Shopping Cart</h3>
                    <button class="cart-close" aria-label="Close cart">✕</button>
                </div>
                <div class="cart-items-container" id="cart-items-container">
                    <!-- Cart items will be injected here -->
                </div>
                <div class="cart-footer" id="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span id="cart-total-amount">${ENV.SITE.currencySymbol} 0</span>
                    </div>
                    <div class="cart-free-shipping" id="free-shipping-message">
                        🎉 You qualify for free shipping!
                    </div>
                    <button class="checkout-btn" id="checkout-btn">Proceed to Checkout</button>
                </div>
            </div>
        `;

        this.headerContainer.innerHTML = headerHTML;
    }

    setupEventListeners() {
        // Search toggle
        const searchToggle = document.querySelector('.search-toggle');
        const searchOverlay = document.getElementById('search-overlay');
        const searchClose = document.querySelector('.search-close');
        const searchInput = document.getElementById('search-input');

        searchToggle?.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });

        searchClose?.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `${this.getPagePath('catalog.html')}?search=${encodeURIComponent(query)}`;
                }
            }
        });

        // Mobile menu
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileClose = document.querySelector('.mobile-menu-close');

        mobileToggle?.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        mobileClose?.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });

        // Cart toggle
        const cartToggle = document.querySelector('.cart-toggle');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartClose = document.querySelector('.cart-close');

        cartToggle?.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            this.updateCartDisplay();
        });

        cartClose?.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn?.addEventListener('click', () => {
            const cart = this.getCart();
            if (cart.length > 0) {
                window.location.href = this.getPagePath('checkout.html');
            }
        });

        // Close overlays on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchOverlay?.classList.remove('active');
                mobileMenu?.classList.remove('active');
                cartSidebar?.classList.remove('active');
            }
        });
    }

    updateCartDisplay() {
        const cart = this.getCart();
        const cartCount = document.getElementById('cart-count');
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const freeShippingMessage = document.getElementById('free-shipping-message');
        const cartFooter = document.getElementById('cart-footer');

        if (cartCount) {
            cartCount.textContent = cart.length;
            cartCount.classList.toggle('active', cart.length > 0);
        }

        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p></div>';
                if (cartFooter) cartFooter.style.display = 'none';
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${ENV.SITE.currencySymbol} ${item.price.toLocaleString()}</div>
                            <div class="cart-item-quantity">
                                <button onclick="window.updateCartItemQty('${item.id}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="window.updateCartItemQty('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                            <button class="cart-item-remove" onclick="window.removeFromCart('${item.id}')">Remove</button>
                        </div>
                    </div>
                `).join('');

                if (cartFooter) cartFooter.style.display = 'block';

                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                if (cartTotalAmount) cartTotalAmount.textContent = `${ENV.SITE.currencySymbol} ${total.toLocaleString()}`;

                if (freeShippingMessage) {
                    const freeShippingThreshold = ENV.SITE.freeShippingThreshold;
                    if (total >= freeShippingThreshold) {
                        freeShippingMessage.classList.add('active');
                    } else {
                        freeShippingMessage.classList.remove('active');
                        freeShippingMessage.textContent = `Add ${ENV.SITE.currencySymbol} ${(freeShippingThreshold - total).toLocaleString()} more for free shipping`;
                    }
                }
            }
        }
    }

    getCart() {
        try {
            return JSON.parse(localStorage.getItem('colormart-cart') || '[]');
        } catch {
            return [];
        }
    }

    addToCart(product) {
        const cart = this.getCart();
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += product.quantity || 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.salePrice || product.originalPrice,
                image: product.images?.[0] || this.getAssetPath('assets/images/placeholder-product.jpg'),
                quantity: product.quantity || 1
            });
        }

        localStorage.setItem('colormart-cart', JSON.stringify(cart));
        this.updateCartDisplay();
        this.showNotification('Product added to cart!', 'success');
    }

    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('colormart-cart', JSON.stringify(cart));
        this.updateCartDisplay();
    }

    updateCartItemQty(productId, newQty) {
        if (newQty <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQty;
            localStorage.setItem('colormart-cart', JSON.stringify(cart));
            this.updateCartDisplay();
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

    getHomePath() {
        const depth = window.location.pathname.split('/').filter(Boolean).length;
        if (depth === 0) return './';
        if (depth === 1 && window.location.pathname.includes('src/')) return '../index.html';
        if (depth === 2) return '../../index.html';
        return '../index.html';
    }

    getPagePath(page) {
        const depth = window.location.pathname.split('/').filter(Boolean).length;
        if (depth === 0) return `src/${page}`;
        if (depth === 1 && window.location.pathname.includes('src/')) return page;
        return `../${page}`;
    }

    getAssetPath(path) {
        const depth = window.location.pathname.split('/').filter(Boolean).length;
        if (depth === 0) return path;
        if (depth === 1) return `../${path}`;
        return `../../${path}`;
    }

    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath || 
                currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize header
const header = new HeaderComponent();

// Make cart functions available globally
window.updateCartItemQty = (productId, newQty) => header.updateCartItemQty(productId, newQty);
window.removeFromCart = (productId) => header.removeFromCart(productId);
window.addToCart = (product) => header.addToCart(product);
window.getCart = () => header.getCart();

export default header;