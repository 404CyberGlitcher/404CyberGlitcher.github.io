// ============================================
// Checkout Functionality - Anas Plastic Enterprises
// Complete Version with Order ID & Global Phone Support
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
                               placeholder="Enter your full name" minlength="3" autocomplete="name">
                        <span class="error-message" id="fullNameError"></span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone">Phone Number <span class="required">*</span></label>
                            <input type="tel" id="phone" name="phone" required 
                                   placeholder="+92 300 0841330 or 0300 0841330" autocomplete="tel">
                            <span class="error-message" id="phoneError"></span>
                            <small style="color: #6B7280; font-size: 0.8rem;">
                                <i class="fas fa-info-circle"></i> 
                                Enter with or without country code (e.g., +923000841330, 03000841330, +1 555 123 4567)
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" 
                                   placeholder="example@email.com" autocomplete="email">
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
                                  placeholder="Enter your complete shipping address" minlength="10" autocomplete="street-address"></textarea>
                        <span class="error-message" id="addressError"></span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City <span class="required">*</span></label>
                            <input type="text" id="city" name="city" required 
                                   placeholder="Enter your city" minlength="2" autocomplete="address-level2">
                            <span class="error-message" id="cityError"></span>
                        </div>
                        <div class="form-group">
                            <label for="country">Country <span class="required">*</span></label>
                            <select id="country" name="country" required autocomplete="country">
                                <option value="">Select Country</option>
                                <option value="Pakistan" selected>Pakistan</option>
                                <option value="India">India</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="UAE">UAE</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="UK">United Kingdom</option>
                                <option value="USA">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Other">Other</option>
                            </select>
                            <span class="error-message" id="countryError"></span>
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
        city: document.getElementById('city'),
        country: document.getElementById('country')
    };
    
    // Real-time validation on blur
    Object.entries(inputs).forEach(([field, input]) => {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    validateField(field, this.value);
                }
            });
            
            input.addEventListener('input', function() {
                // Clear error when user starts typing
                const errorElement = document.getElementById(`${field}Error`);
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.style.display = 'none';
                }
                input.classList.remove('invalid');
                input.style.borderColor = '#E5E7EB';
                input.style.boxShadow = 'none';
            });
        }
    });
}

function validateForm() {
    let isValid = true;
    
    // Validate Full Name
    const fullName = document.getElementById('fullName')?.value?.trim();
    if (!fullName || fullName.length < 3) {
        showFieldError('fullName', 'Please enter your full name (minimum 3 characters)');
        isValid = false;
    } else {
        clearFieldError('fullName');
    }
    
    // Validate Phone (Global format)
    const phoneRaw = document.getElementById('phone')?.value?.trim();
    if (!phoneRaw) {
        showFieldError('phone', 'Please enter your phone number');
        isValid = false;
    } else {
        const phoneValidation = validateGlobalPhone(phoneRaw);
        if (!phoneValidation.isValid) {
            showFieldError('phone', phoneValidation.message);
            isValid = false;
        } else {
            clearFieldError('phone');
        }
    }
    
    // Validate Email (optional but must be valid if provided)
    const email = document.getElementById('email')?.value?.trim();
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFieldError('email', 'Please enter a valid email address (e.g., example@email.com)');
            isValid = false;
        } else {
            clearFieldError('email');
        }
    }
    
    // Validate Address
    const address = document.getElementById('address')?.value?.trim();
    if (!address || address.length < 10) {
        showFieldError('address', 'Please enter your complete address (minimum 10 characters)');
        isValid = false;
    } else {
        clearFieldError('address');
    }
    
    // Validate City
    const city = document.getElementById('city')?.value?.trim();
    if (!city || city.length < 2) {
        showFieldError('city', 'Please enter your city name');
        isValid = false;
    } else {
        clearFieldError('city');
    }
    
    // Validate Country
    const country = document.getElementById('country')?.value;
    if (!country) {
        showFieldError('country', 'Please select your country');
        isValid = false;
    } else {
        clearFieldError('country');
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

function validateGlobalPhone(phone) {
    // Remove all whitespace and special characters except +
    let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    
    // Check if it starts with +
    if (cleaned.startsWith('+')) {
        // International format: +[country code][number]
        const intlRegex = /^\+[1-9]\d{1,3}\d{6,14}$/;
        if (intlRegex.test(cleaned)) {
            return { isValid: true, cleaned: cleaned, message: '' };
        }
        return { 
            isValid: false, 
            cleaned: cleaned, 
            message: 'International format should be like: +923000841330 or +15551234567' 
        };
    }
    
    // Without country code - just digits
    if (/^\d+$/.test(cleaned)) {
        // Must be at least 7 digits and max 15 digits
        if (cleaned.length >= 7 && cleaned.length <= 15) {
            return { isValid: true, cleaned: cleaned, message: '' };
        }
        return { 
            isValid: false, 
            cleaned: cleaned, 
            message: 'Phone number should be between 7 and 15 digits' 
        };
    }
    
    return { 
        isValid: false, 
        cleaned: cleaned, 
        message: 'Enter a valid phone number (e.g., +923000841330 or 03000841330)' 
    };
}

function validateField(field, value) {
    switch(field) {
        case 'fullName':
            if (!value || value.length < 3) {
                showFieldError('fullName', 'Name must be at least 3 characters');
                return false;
            }
            clearFieldError('fullName');
            break;
            
        case 'phone':
            const phoneValidation = validateGlobalPhone(value);
            if (!phoneValidation.isValid) {
                showFieldError('phone', phoneValidation.message);
                return false;
            }
            clearFieldError('phone');
            break;
            
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError('email', 'Enter a valid email address');
                return false;
            }
            clearFieldError('email');
            break;
            
        case 'address':
            if (!value || value.length < 10) {
                showFieldError('address', 'Address must be at least 10 characters');
                return false;
            }
            clearFieldError('address');
            break;
            
        case 'city':
            if (!value || value.length < 2) {
                showFieldError('city', 'Enter your city name');
                return false;
            }
            clearFieldError('city');
            break;
            
        case 'country':
            if (!value) {
                showFieldError('country', 'Select your country');
                return false;
            }
            clearFieldError('country');
            break;
    }
    
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

function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ANAS-${timestamp}-${random}`;
}

function formatPhoneForDisplay(phone) {
    // Just return the phone as entered by user
    return phone.trim();
}

async function sendOrderViaWhatsApp(cart) {
    const fullName = document.getElementById('fullName')?.value?.trim();
    const phone = formatPhoneForDisplay(document.getElementById('phone')?.value || '');
    const email = document.getElementById('email')?.value?.trim();
    const address = document.getElementById('address')?.value?.trim();
    const city = document.getElementById('city')?.value?.trim();
    const country = document.getElementById('country')?.value || '';
    const notes = document.getElementById('notes')?.value?.trim();
    
    // Generate unique order ID
    const orderId = generateOrderId();
    
    const baseUrl = window.location.origin;
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const orderDate = new Date();
    const formattedDate = orderDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // Build WhatsApp message with Order ID prominently displayed
    let message = `🛍️ *NEW ORDER - ANAS PLASTIC ENTERPRISES*\n\n`;
    
    // Order ID Section (Highlighted)
    message += `📋 *ORDER ID: ${orderId}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Customer Details
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📛 Name: ${fullName}\n`;
    message += `📱 Phone: ${phone}\n`;
    if (email) message += `📧 Email: ${email}\n`;
    message += `\n`;
    
    // Shipping Address
    message += `📍 *SHIPPING ADDRESS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏠 Address: ${address}\n`;
    message += `🏙️ City: ${city}\n`;
    if (country) message += `🌍 Country: ${country}\n`;
    message += `\n`;
    
    // Order Notes
    if (notes) {
        message += `📝 *ORDER NOTES*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `${notes}\n\n`;
    }
    
    // Order Items
    message += `📦 *ORDER ITEMS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        message += `\n${i + 1}. *${item.name}*\n`;
        message += `   ├ 📦 Quantity: ${item.quantity.toLocaleString()} units\n`;
        message += `   ├ 🏷️ Category: ${formatCategoryName(item.category)}\n`;
        message += `   └ 🔗 Link: ${baseUrl}/product-detail.html?id=${item.id}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 *ORDER SUMMARY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 Order ID: *${orderId}*\n`;
    message += `📦 Total Products: ${cart.length}\n`;
    message += `🔢 Total Items: ${totalItems.toLocaleString()} units\n`;
    message += `📅 Order Date: ${formattedDate}\n`;
    message += `\n`;
    message += `💰 *Please send price quotation for Order #${orderId}*\n`;
    message += `✅ *Confirm order availability and delivery timeline*\n\n`;
    message += `🙏 Thank you!\n`;
    message += `_This order was placed via Anas Plastic Enterprises Website_`;
    
    // Save order to localStorage
    const order = {
        orderId: orderId,
        customer: { 
            fullName, 
            phone, 
            email: email || '', 
            address, 
            city, 
            country 
        },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            category: item.category,
            image: item.image
        })),
        notes: notes || '',
        totalItems: totalItems,
        totalProducts: cart.length,
        orderDate: orderDate.toISOString()
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
    
    // Show success page
    showOrderSuccess(order);
}

function showOrderSuccess(order) {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    const formattedDate = new Date(order.orderDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    checkoutContent.innerHTML = `
        <div class="order-success" data-aos="fade-up" style="text-align: center; padding: 60px 30px; background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); max-width: 600px; margin: 0 auto;">
            <div style="font-size: 5rem; color: #10B981; margin-bottom: 20px; animation: scaleIn 0.5s ease;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="font-size: 2rem; color: #1F2937; margin-bottom: 10px;">Order Sent Successfully!</h2>
            <p style="color: #6B7280; font-size: 1.1rem; margin-bottom: 25px;">
                Your order has been sent to our WhatsApp. We will get back to you shortly with pricing details.
            </p>
            
            <!-- Order ID Card -->
            <div style="background: linear-gradient(135deg, #1E3A8A, #3B5CB8); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                <p style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">YOUR ORDER ID</p>
                <h3 style="font-size: 1.8rem; font-weight: 800; letter-spacing: 2px; margin-bottom: 10px;">${order.orderId}</h3>
                <p style="font-size: 0.85rem; opacity: 0.9;">
                    <i class="far fa-clock"></i> ${formattedDate}
                </p>
            </div>
            
            <!-- Order Summary -->
            <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 25px; text-align: left;">
                <h4 style="color: #1F2937; margin-bottom: 15px; font-size: 1.1rem;">
                    <i class="fas fa-box"></i> Order Summary
                </h4>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #6B7280;">Total Products</span>
                    <strong style="color: #1F2937;">${order.totalProducts}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #6B7280;">Total Items</span>
                    <strong style="color: #1F2937;">${order.totalItems.toLocaleString()} units</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                    <span style="color: #6B7280;">Customer</span>
                    <strong style="color: #1F2937;">${order.customer.fullName}</strong>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="products.html" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: #1E3A8A; color: white; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                    <i class="fas fa-shopping-bag"></i> Continue Shopping
                </a>
                <a href="https://wa.me/923000841330" target="_blank" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: #25D366; color: white; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                    <i class="fab fa-whatsapp"></i> Open WhatsApp
                </a>
            </div>
            
            <p style="color: #9CA3AF; font-size: 0.85rem; margin-top: 20px;">
                <i class="fas fa-info-circle"></i> 
                Please save your Order ID for future reference. You can also find it in your WhatsApp messages.
            </p>
        </div>
    `;
    
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
    
    // Scroll to top of success message
    setTimeout(() => {
        document.querySelector('.order-success')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
}

// ============================================
// Galaxy Button Initialization
// ============================================
function initializeAllGalaxyButtons() {
    const PARTICLES = document.querySelectorAll('.galaxy-button .star');
    
    PARTICLES.forEach(P => {
        const angle = Math.floor(Math.random() * 360);
        const duration = Math.floor(Math.random() * 14) + 6;
        const delay = Math.floor(Math.random() * 9) + 1;
        const alpha = (Math.floor(Math.random() * 50) + 40) / 100;
        const size = Math.floor(Math.random() * 4) + 2;
        const distance = Math.floor(Math.random() * 160) + 40;
        
        P.setAttribute('style', `
            --angle: ${angle};
            --duration: ${duration};
            --delay: ${delay};
            --alpha: ${alpha};
            --size: ${size};
            --distance: ${distance};
        `);
    });
}

// ============================================
// Utility Functions
// ============================================
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

// ============================================
// Global Exports
// ============================================
window.initializeAllGalaxyButtons = initializeAllGalaxyButtons;
window.updateCartCountDisplay = updateCartCountDisplay;