// ============================================
// Checkout Functionality - Anas Plastic Enterprises
// With Validations and Image Sharing
// ============================================

document.addEventListener('DOMContentLoaded', function() {
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
    
    // Initialize galaxy buttons
    setTimeout(() => {
        initializeAllGalaxyButtons();
    }, 500);
});

function initializeCheckout() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    
    if (cart.length === 0) {
        renderEmptyCartState();
        return;
    }
    
    renderCheckoutForm(cart);
}

function renderEmptyCartState() {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    checkoutContent.innerHTML = `
        <div class="empty-cart-state" style="text-align: center; padding: 80px 20px;">
            <i class="fas fa-shopping-cart" style="font-size: 5rem; color: #D1D5DB; margin-bottom: 20px; display: block;"></i>
            <h2 style="font-size: 2rem; color: #1F2937; margin-bottom: 10px;">Your cart is empty</h2>
            <p style="color: #6B7280; font-size: 1.1rem; margin-bottom: 30px;">Please add products to your cart before checking out.</p>
            <div class="galaxy-button-wrapper">
                <div class="galaxy-button">
                    <button onclick="window.location.href='products.html'" type="button">
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
                        <span class="text">Browse Products</span>
                    </button>
                    <div class="bodydrop"></div>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => initializeAllGalaxyButtons(), 300);
}

function renderCheckoutForm(cart) {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const uniqueProducts = cart.length;
    
    checkoutContent.innerHTML = `
        <div class="checkout-container" data-aos="fade-up">
            <form id="checkoutForm" class="checkout-form" novalidate>
                <!-- Contact Information -->
                <div class="form-section">
                    <h3><i class="fas fa-user"></i> Contact Information</h3>
                    <div class="form-group">
                        <label for="fullName">Full Name <span class="required">*</span></label>
                        <input type="text" id="fullName" name="fullName" required 
                               placeholder="Enter your full name" minlength="3">
                        <span class="error-message" id="fullNameError"></span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone">Phone Number <span class="required">*</span></label>
                            <input type="tel" id="phone" name="phone" required 
                                   placeholder="03XX-XXXXXXX" pattern="^03[0-9]{2}[0-9]{7}$">
                            <span class="error-message" id="phoneError"></span>
                            <small style="color: #6B7280;">Format: 03XX-XXXXXXX (11 digits)</small>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" 
                                   placeholder="example@email.com">
                            <span class="error-message" id="emailError"></span>
                        </div>
                    </div>
                </div>
                
                <!-- Shipping Address -->
                <div class="form-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Shipping Address</h3>
                    <div class="form-group">
                        <label for="address">Complete Address <span class="required">*</span></label>
                        <textarea id="address" name="address" rows="3" required 
                                  placeholder="Enter your complete shipping address" minlength="10"></textarea>
                        <span class="error-message" id="addressError"></span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City <span class="required">*</span></label>
                            <input type="text" id="city" name="city" required 
                                   placeholder="Enter your city" minlength="2">
                            <span class="error-message" id="cityError"></span>
                        </div>
                        <div class="form-group">
                            <label for="postalCode">Postal Code</label>
                            <input type="text" id="postalCode" name="postalCode" 
                                   placeholder="Enter postal code">
                        </div>
                    </div>
                </div>
                
                <!-- Order Summary -->
                <div class="form-section">
                    <h3><i class="fas fa-box"></i> Order Summary</h3>
                    <div id="orderSummary" class="order-summary-checkout">
                        <div class="order-items-checkout">
                            ${cart.map(item => `
                                <div class="order-item-checkout">
                                    <div class="order-item-image-checkout">
                                        <img src="${item.image || 'https://via.placeholder.com/60x60?text=Product'}" 
                                             alt="${item.name}" 
                                             onerror="this.src='https://via.placeholder.com/60x60?text=Product'">
                                    </div>
                                    <div class="order-item-details-checkout">
                                        <span class="order-item-name-checkout">${item.name}</span>
                                        <span class="order-item-qty-checkout">Quantity: ${item.quantity.toLocaleString()}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-totals">
                            <div class="total-row">
                                <span>Total Products:</span>
                                <strong>${uniqueProducts}</strong>
                            </div>
                            <div class="total-row">
                                <span>Total Items:</span>
                                <strong>${totalItems.toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>
                    <p class="order-note">
                        <i class="fas fa-info-circle"></i>
                        Prices and final quotation will be discussed via WhatsApp after order submission.
                    </p>
                </div>
                
                <!-- Additional Notes -->
                <div class="form-section">
                    <h3><i class="fas fa-sticky-note"></i> Additional Notes (Optional)</h3>
                    <div class="form-group">
                        <textarea id="notes" name="notes" rows="3" 
                                  placeholder="Any special requirements, custom packaging needs, or additional notes..."></textarea>
                    </div>
                </div>
                
                <!-- Submit Button -->
                <div class="form-submit">
                    <div class="galaxy-button-wrapper">
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
                                <span class="text"><i class="fab fa-whatsapp"></i> Send Order via WhatsApp</span>
                            </button>
                            <div class="bodydrop"></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `;
    
    // Initialize galaxy buttons
    setTimeout(() => initializeAllGalaxyButtons(), 300);
    
    // Setup form validation and submission
    setupCheckoutForm(cart);
    
    // Add real-time validation
    setupRealTimeValidation();
}

function setupCheckoutForm(cart) {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            sendOrderViaWhatsApp(cart);
        }
    });
}

function setupRealTimeValidation() {
    const inputs = {
        fullName: document.getElementById('fullName'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        address: document.getElementById('address'),
        city: document.getElementById('city')
    };
    
    // Real-time validation on blur
    Object.entries(inputs).forEach(([field, input]) => {
        if (input) {
            input.addEventListener('blur', function() {
                validateField(field, this.value);
            });
            
            input.addEventListener('input', function() {
                // Clear error when user starts typing
                const errorElement = document.getElementById(`${field}Error`);
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.style.display = 'none';
                }
                input.classList.remove('invalid');
            });
        }
    });
    
    // Phone number formatting
    if (inputs.phone) {
        inputs.phone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 4) {
                value = value.slice(0, 4) + '-' + value.slice(4);
            }
            e.target.value = value;
        });
    }
}

function validateForm() {
    let isValid = true;
    
    // Validate Full Name
    const fullName = document.getElementById('fullName')?.value?.trim();
    if (!fullName || fullName.length < 3) {
        showFieldError('fullName', 'Please enter your full name (minimum 3 characters)');
        isValid = false;
    }
    
    // Validate Phone
    const phone = document.getElementById('phone')?.value?.replace(/[^0-9]/g, '');
    const phoneRegex = /^03[0-9]{2}[0-9]{7}$/;
    if (!phone || !phoneRegex.test(phone)) {
        showFieldError('phone', 'Please enter a valid 11-digit Pakistani phone number (03XX-XXXXXXX)');
        isValid = false;
    }
    
    // Validate Email (optional but must be valid if provided)
    const email = document.getElementById('email')?.value?.trim();
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Validate Address
    const address = document.getElementById('address')?.value?.trim();
    if (!address || address.length < 10) {
        showFieldError('address', 'Please enter your complete address (minimum 10 characters)');
        isValid = false;
    }
    
    // Validate City
    const city = document.getElementById('city')?.value?.trim();
    if (!city || city.length < 2) {
        showFieldError('city', 'Please enter your city name');
        isValid = false;
    }
    
    // Scroll to first error
    if (!isValid) {
        const firstError = document.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
    
    return isValid;
}

function validateField(field, value) {
    switch(field) {
        case 'fullName':
            if (!value || value.length < 3) {
                showFieldError('fullName', 'Name must be at least 3 characters');
                return false;
            }
            break;
        case 'phone':
            const cleanPhone = value.replace(/[^0-9]/g, '');
            if (!/^03[0-9]{2}[0-9]{7}$/.test(cleanPhone)) {
                showFieldError('phone', 'Enter a valid 11-digit phone number (03XX-XXXXXXX)');
                return false;
            }
            break;
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError('email', 'Enter a valid email address');
                return false;
            }
            break;
        case 'address':
            if (!value || value.length < 10) {
                showFieldError('address', 'Address must be at least 10 characters');
                return false;
            }
            break;
        case 'city':
            if (!value || value.length < 2) {
                showFieldError('city', 'Enter your city name');
                return false;
            }
            break;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (input) {
        input.classList.add('invalid');
        input.style.borderColor = '#DC2626';
        input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (input) {
        input.classList.remove('invalid');
        input.style.borderColor = '#E5E7EB';
        input.style.boxShadow = 'none';
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

async function sendOrderViaWhatsApp(cart) {
    const fullName = document.getElementById('fullName')?.value?.trim();
    const phone = document.getElementById('phone')?.value?.replace(/[^0-9]/g, '');
    const email = document.getElementById('email')?.value?.trim();
    const address = document.getElementById('address')?.value?.trim();
    const city = document.getElementById('city')?.value?.trim();
    const postalCode = document.getElementById('postalCode')?.value?.trim();
    const notes = document.getElementById('notes')?.value?.trim();
    
    const baseUrl = window.location.origin;
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    // Build WhatsApp message
    let message = `🛍️ *New Order - Anas Plastic Enterprises*\n\n`;
    
    message += `👤 *Customer Details*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `📛 Name: ${fullName}\n`;
    message += `📱 Phone: ${phone}\n`;
    if (email) message += `📧 Email: ${email}\n`;
    message += `📍 Address: ${address}\n`;
    message += `🏙️ City: ${city}\n`;
    if (postalCode) message += `📮 Postal Code: ${postalCode}\n`;
    
    if (notes) {
        message += `\n📝 *Order Notes:*\n`;
        message += `━━━━━━━━━━━━━━━━━━\n`;
        message += `${notes}\n`;
    }
    
    message += `\n📦 *Order Items:*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n`;
    
    // Add product details with images
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        message += `\n${i + 1}. *${item.name}*\n`;
        message += `   📦 Quantity: ${item.quantity.toLocaleString()}\n`;
        message += `   🏷️ Category: ${formatCategoryName(item.category)}\n`;
        message += `   🔗 Link: ${baseUrl}/product-detail.html?id=${item.id}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 *Order Summary:*\n`;
    message += `📦 Products: ${cart.length}\n`;
    message += `🔢 Total Items: ${totalItems.toLocaleString()}\n`;
    message += `\n💰 *Please send price quotation and confirm order.*\n`;
    message += `📅 Order Date: ${new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    
    // Save order
    const order = {
        orderId: 'ORD-' + Date.now(),
        customer: { fullName, phone, email: email || '', address, city, postalCode: postalCode || '' },
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
    
    // Open WhatsApp
    const whatsappNumber = '923000841330';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    // Show success
    showOrderSuccess(order);
}

function showOrderSuccess(order) {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    checkoutContent.innerHTML = `
        <div class="order-success" data-aos="fade-up" style="text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
            <div style="font-size: 5rem; color: #10B981; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="font-size: 2rem; color: #1F2937; margin-bottom: 10px;">Order Sent Successfully!</h2>
            <p style="color: #6B7280; font-size: 1.1rem; margin-bottom: 10px;">
                Your order has been sent to our WhatsApp. We will get back to you shortly.
            </p>
            <p style="color: #6B7280; margin-bottom: 30px;">
                Order ID: <strong style="color: #1E3A8A;">${order.orderId}</strong>
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="products.html" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: #1E3A8A; color: white; border-radius: 50px; text-decoration: none; font-weight: 600;">
                    <i class="fas fa-shopping-bag"></i> Continue Shopping
                </a>
                <a href="https://wa.me/923000841330" target="_blank" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: #25D366; color: white; border-radius: 50px; text-decoration: none; font-weight: 600;">
                    <i class="fab fa-whatsapp"></i> Open WhatsApp
                </a>
            </div>
        </div>
    `;
    
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
}

function updateCartCountDisplay() {
    const cart = JSON.parse(localStorage.getItem('anasPlasticCart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

// Make functions globally available
window.initializeAllGalaxyButtons = initializeAllGalaxyButtons;