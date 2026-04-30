// Checkout Functionality - Anas Plastic Enterprises

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
    
    if (window.location.pathname.includes('checkout.html')) {
        initializeCheckout();
    }
    
    updateCartCountDisplay();
});

function initializeCheckout() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    // Redirect if cart is empty
    if (cart.length === 0) {
        const checkoutContent = document.getElementById('checkoutContent');
        if (checkoutContent) {
            checkoutContent.innerHTML = `
                <div class="empty-cart" style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-shopping-cart" style="font-size: 5rem; color: #E5E7EB; margin-bottom: 20px; display: block;"></i>
                    <h2>Your cart is empty</h2>
                    <p>Please add products to your cart before checking out.</p>
                    <a href="products.html" class="btn-primary" style="margin-top: 20px; display: inline-block;">Browse Products</a>
                </div>
            `;
        }
        return;
    }
    
    renderCheckoutForm(cart);
}

function renderCheckoutForm(cart) {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const uniqueProducts = cart.length;
    
    checkoutContent.innerHTML = `
        <div class="checkout-container" data-aos="fade-up">
            <form id="checkoutForm" class="checkout-form">
                <div class="form-section">
                    <h3>Contact Information</h3>
                    <div class="form-group">
                        <label for="fullName">Full Name *</label>
                        <input type="text" id="fullName" name="fullName" required placeholder="Enter your full name">
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required placeholder="Enter your phone number">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email address">
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Shipping Address</h3>
                    <div class="form-group">
                        <label for="address">Complete Address *</label>
                        <textarea id="address" name="address" rows="3" required placeholder="Enter your shipping address"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="city">City *</label>
                        <input type="text" id="city" name="city" required placeholder="Enter your city">
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Order Summary</h3>
                    <div id="orderSummary">
                        <div class="order-items">
                            ${cart.map(item => `
                                <div class="order-item">
                                    <div class="order-item-image">
                                        <img src="${item.image || 'https://via.placeholder.com/60x60?text=Product'}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=Product'">
                                    </div>
                                    <div class="order-item-details">
                                        <span class="order-item-name">${item.name}</span>
                                        <span class="order-item-qty">Quantity: ${item.quantity}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-total">
                            <span>Total Products:</span>
                            <strong>${uniqueProducts}</strong>
                        </div>
                        <div class="order-total">
                            <span>Total Items:</span>
                            <strong>${totalItems}</strong>
                        </div>
                    </div>
                    <p class="order-note">
                        <i class="fas fa-info-circle"></i>
                        Prices and final quotation will be discussed via WhatsApp after order submission.
                    </p>
                </div>
                
                <div class="form-section">
                    <h3>Additional Notes (Optional)</h3>
                    <div class="form-group">
                        <textarea id="notes" name="notes" rows="3" placeholder="Any special requirements, custom packaging needs, or additional notes for your order..."></textarea>
                    </div>
                </div>
                
                <div class="galaxy-button-wrapper" style="text-align: center; margin-top: 20px;">
                    <div class="galaxy-button">
                        <button type="submit">
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
                            <span class="text">Send Order via WhatsApp</span>
                        </button>
                        <div class="bodydrop"></div>
                    </div>
                </div>
            </form>
        </div>
    `;
    
    // Initialize galaxy buttons
    if (typeof initializeGalaxyButtons === 'function') {
        setTimeout(() => initializeGalaxyButtons(), 200);
    }
    
    // Setup form submission
    setupCheckoutForm(cart);
}

function setupCheckoutForm(cart) {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        sendOrderViaWhatsApp(cart);
    });
}

function sendOrderViaWhatsApp(cart) {
    // Get form data
    const fullName = document.getElementById('fullName')?.value?.trim();
    const phone = document.getElementById('phone')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const address = document.getElementById('address')?.value?.trim();
    const city = document.getElementById('city')?.value?.trim();
    const notes = document.getElementById('notes')?.value?.trim();
    
    // Validate required fields
    if (!fullName || !phone || !address || !city) {
        alert('Please fill in all required fields (Name, Phone, Address, City).');
        return;
    }
    
    // Get current page URL for product links
    const baseUrl = window.location.origin;
    
    // Build WhatsApp message
    let message = `🛍️ *New Order - Anas Plastic Enterprises*\n\n`;
    
    message += `👤 *Customer Details*\n`;
    message += `• Name: ${fullName}\n`;
    message += `• Phone: ${phone}\n`;
    if (email) message += `• Email: ${email}\n`;
    message += `• Address: ${address}\n`;
    message += `• City: ${city}\n`;
    
    if (notes) {
        message += `\n📝 *Order Notes:*\n${notes}\n`;
    }
    
    message += `\n📦 *Order Items:*\n`;
    message += `────────────────────────\n`;
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    cart.forEach((item, index) => {
        message += `\n${index + 1}. *${item.name}*\n`;
        message += `   📦 Qty: ${item.quantity}\n`;
        message += `   🏷️ Category: ${formatCategoryName(item.category)}\n`;
        message += `   🔗 Link: ${baseUrl}/product-detail.html?id=${item.id}\n`;
    });
    
    message += `\n────────────────────────\n`;
    message += `📊 *Summary:*\n`;
    message += `• Total Products: ${cart.length}\n`;
    message += `• Total Items: ${totalItems}\n`;
    message += `\n💰 *Please send price quotation and confirm order.*`;
    
    // WhatsApp number
    const whatsappNumber = '923000841330';
    
    // Open WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Save order to localStorage
    const order = {
        orderId: 'ORD-' + Date.now(),
        customer: { fullName, phone, email: email || '', address, city },
        items: cart,
        notes: notes || '',
        totalItems: totalItems,
        orderDate: new Date().toISOString()
    };
    
    const orders = JSON.parse(localStorage.getItem('anasPlasticOrders')) || [];
    orders.push(order);
    localStorage.setItem('anasPlasticOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('anasPlasticCart');
    updateCartCountDisplay();
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Show success message
    setTimeout(() => {
        const checkoutContent = document.getElementById('checkoutContent');
        if (checkoutContent) {
            checkoutContent.innerHTML = `
                <div class="order-success" style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-check-circle" style="font-size: 5rem; color: #10B981; margin-bottom: 20px; display: block;"></i>
                    <h2>Order Sent Successfully!</h2>
                    <p>Your order has been sent to our WhatsApp. We will get back to you shortly with pricing details.</p>
                    <p style="color: #6B7280; margin-bottom: 30px;">Order ID: <strong>${order.orderId}</strong></p>
                    <a href="products.html" class="btn-primary" style="display: inline-block; margin-right: 10px;">Continue Shopping</a>
                    <a href="https://wa.me/923000841330" target="_blank" class="btn-secondary" style="display: inline-block; background: #25D366; margin-top: 10px;">
                        <i class="fab fa-whatsapp"></i> Open WhatsApp
                    </a>
                </div>
            `;
        }
    }, 500);
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