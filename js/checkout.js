// Checkout Functionality - Anas Plastic Enterprises

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('checkout.html')) {
        initializeCheckout();
    }
});

function initializeCheckout() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    // Redirect if cart is empty
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    renderOrderSummary(cart);
    setupCheckoutForm(cart);
}

function renderOrderSummary(cart) {
    const orderSummary = document.getElementById('orderSummary');
    if (!orderSummary) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    orderSummary.innerHTML = `
        <div class="order-items">
            ${cart.map(item => `
                <div class="order-item">
                    <div class="order-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/img/placeholder.png'">
                    </div>
                    <div class="order-item-details">
                        <span class="order-item-name">${item.name}</span>
                        <span class="order-item-qty">Qty: ${item.quantity}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="order-total">
            <span>Total Items:</span>
            <strong>${totalItems}</strong>
        </div>
        <p class="order-note">
            <i class="fas fa-info-circle"></i>
            Prices and final quotation will be discussed via WhatsApp after order submission.
        </p>
    `;
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
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const notes = document.getElementById('notes').value.trim();
    
    // Validate required fields
    if (!fullName || !phone || !address || !city) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Build WhatsApp message
    let message = `*New Order - Anas Plastic Enterprises*\n\n`;
    message += `*Customer Details*\n`;
    message += `Name: ${fullName}\n`;
    message += `Phone: ${phone}\n`;
    if (email) message += `Email: ${email}\n`;
    message += `Address: ${address}\n`;
    message += `City: ${city}\n`;
    
    if (notes) {
        message += `\n*Order Notes:*\n${notes}\n`;
    }
    
    message += `\n*Order Items:*\n`;
    
    cart.forEach((item, index) => {
        message += `\n${index + 1}. ${item.name}`;
        message += `\n   Quantity: ${item.quantity}`;
        message += `\n   Category: ${formatCategoryName(item.category)}`;
        message += `\n   Image: ${item.image}\n`;
    });
    
    message += `\n----------------------------------------\n`;
    message += `Total Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n`;
    message += `Total Products: ${cart.length}\n`;
    message += `\n*Please send price quotation and confirm order.*`;
    
    // Get WhatsApp number from config
    const whatsappNumber = '923000841330'; // From your business details
    
    // Open WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    // Save order to localStorage for reference
    const order = {
        customer: { fullName, phone, email, address, city },
        items: cart,
        notes: notes,
        orderDate: new Date().toISOString(),
        orderId: 'ORD-' + Date.now()
    };
    
    const orders = JSON.parse(localStorage.getItem('anasPlasticOrders')) || [];
    orders.push(order);
    localStorage.setItem('anasPlasticOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('anasPlasticCart');
    updateCartCount();
    
    // Show success message
    setTimeout(() => {
        alert('Order sent successfully! You will be redirected to WhatsApp.');
        window.location.href = 'products.html';
    }, 1000);
}