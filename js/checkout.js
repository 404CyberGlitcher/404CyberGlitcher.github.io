// ============================================
// Checkout Functionality - Anas Plastic Enterprises
// Complete Version with Date-Based Order IDs
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
                                   placeholder="e.g., +92 300 0841330 or 03000841330" autocomplete="tel">
                            <span class="error-message" id="phoneError"></span>
                            <small style="color: #6B7280; font-size: 0.8rem; display: block; margin-top: 5px;">
                                <i class="fas fa-info-circle"></i> 
                                Enter with or without country code
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
                            <div class="custom-select-wrapper">
                                <select id="country" name="country" required autocomplete="country" class="custom-select">
                                    <option value="">Select your country</option>
                                    <option value="Pakistan">🇵🇰 Pakistan</option>
                                    <option value="India">🇮🇳 India</option>
                                    <option value="Bangladesh">🇧🇩 Bangladesh</option>
                                    <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                                    <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                                    <option value="Qatar">🇶🇦 Qatar</option>
                                    <option value="Kuwait">🇰🇼 Kuwait</option>
                                    <option value="Oman">🇴🇲 Oman</option>
                                    <option value="Bahrain">🇧🇭 Bahrain</option>
                                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                                    <option value="United States">🇺🇸 United States</option>
                                    <option value="Canada">🇨🇦 Canada</option>
                                    <option value="Australia">🇦🇺 Australia</option>
                                    <option value="Malaysia">🇲🇾 Malaysia</option>
                                    <option value="Indonesia">🇮🇩 Indonesia</option>
                                    <option value="Turkey">🇹🇷 Turkey</option>
                                    <option value="Afghanistan">🇦🇫 Afghanistan</option>
                                    <option value="Sri Lanka">🇱🇰 Sri Lanka</option>
                                    <option value="Nepal">🇳🇵 Nepal</option>
                                    <option value="Other">🌍 Other</option>
                                </select>
                                <div class="custom-select-arrow">
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
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
                                        <span class="order-item-qty-checkout">Quantity: ${(item.quantity || 0).toLocaleString()} units</span>
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
                                <strong>${totalItems.toLocaleString()} units</strong>
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
    
    setTimeout(() => initializeAllGalaxyButtons(), 300);
    setupCheckoutForm(cart);
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
    
    Object.entries(inputs).forEach(([field, input]) => {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    validateField(field, this.value);
                }
            });
            
            input.addEventListener('input', function() {
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
            showFieldError('email', 'Please enter a valid email address');
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
    let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    
    if (cleaned.startsWith('+')) {
        const intlRegex = /^\+[1-9]\d{1,3}\d{6,14}$/;
        if (intlRegex.test(cleaned)) {
            return { isValid: true, cleaned: cleaned, message: '' };
        }
        return { 
            isValid: false, 
            cleaned: cleaned, 
            message: 'Please enter a valid international number (e.g., +923000841330)' 
        };
    }
    
    if (/^\d+$/.test(cleaned)) {
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
        message: 'Please enter a valid phone number' 
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

// ============================================
// DATE-BASED ORDER ID GENERATOR
// Format: ANAS-YYYYMMDD-XXXX
// Where XXXX resets to 0001 each day
// ============================================
function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    
    // Get today's orders to determine the next sequence number
    const sequenceNumber = getNextSequenceNumber(dateString);
    
    return `ANAS-${dateString}-${sequenceNumber}`;
}

function getNextSequenceNumber(dateString) {
    // Get all orders from localStorage
    const orders = JSON.parse(localStorage.getItem('anasPlasticOrders')) || [];
    
    // Filter orders from today only
    const todayOrders = orders.filter(order => {
        if (!order.orderId) return false;
        // Extract date part from order ID (ANAS-YYYYMMDD-XXXX)
        const orderDatePart = order.orderId.substring(5, 13); // Gets YYYYMMDD
        return orderDatePart === dateString;
    });
    
    // Find the highest sequence number for today
    let maxSequence = 0;
    todayOrders.forEach(order => {
        const sequencePart = order.orderId.substring(14); // Gets XXXX
        const sequenceNum = parseInt(sequencePart, 10);
        if (!isNaN(sequenceNum) && sequenceNum > maxSequence) {
            maxSequence = sequenceNum;
        }
    });
    
    // Increment and format as 4-digit number
    const nextSequence = maxSequence + 1;
    return String(nextSequence).padStart(4, '0');
}

function formatPhoneForDisplay(phone) {
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
    
    // Generate unique order ID based on date
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
    
    // Calculate today's order count
    const todayDateString = `${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}`;
    const sequenceNum = orderId.substring(14);
    const todaysOrderNumber = parseInt(sequenceNum, 10);
    
    // Build WhatsApp message
    let message = `🛍️ *NEW ORDER - ANAS PLASTIC ENTERPRISES*\n\n`;
    
    message += `📋 *ORDER ID: ${orderId}*\n`;
    message += `📅 Order #${todaysOrderNumber} of Today\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📛 Name: ${fullName}\n`;
    message += `📱 Phone: ${phone}\n`;
    if (email) message += `📧 Email: ${email}\n`;
    message += `\n`;
    
    message += `📍 *SHIPPING ADDRESS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏠 Address: ${address}\n`;
    message += `🏙️ City: ${city}\n`;
    if (country) message += `🌍 Country: ${country}\n`;
    message += `\n`;
    
    if (notes) {
        message += `📝 *ORDER NOTES*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `${notes}\n\n`;
    }
    
    message += `📦 *ORDER ITEMS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        message += `\n${i + 1}. *${item.name}*\n`;
        message += `   ├ 📦 Quantity: ${(item.quantity || 0).toLocaleString()} units\n`;
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
    
    // Extract sequence number for display
    const sequenceNum = order.orderId.substring(14);
    const todaysOrderNumber = parseInt(sequenceNum, 10);
    
    checkoutContent.innerHTML = `
        <div class="order-success" data-aos="fade-up" style="text-align: center; padding: 60px 30px; background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); max-width: 600px; margin: 0 auto;">
            <div style="font-size: 5rem; color: #10B981; margin-bottom: 20px; animation: scaleIn 0.5s ease;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="font-size: 2rem; color: #1F2937; margin-bottom: 10px;">Order Sent Successfully!</h2>
            <p style="color: #6B7280; font-size: 1.1rem; margin-bottom: 25px;">
                Your order has been sent to our WhatsApp. We will get back to you shortly.
            </p>
            
            <!-- Order ID Card -->
            <div style="background: linear-gradient(135deg, #1E3A8A, #3B5CB8); color: white; padding: 30px; border-radius: 16px; margin-bottom: 25px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -30px; left: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
                <p style="font-size: 0.8rem; opacity: 0.9; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; position: relative;">Your Order ID</p>
                <h3 style="font-size: 2rem; font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; position: relative;">${order.orderId}</h3>
                <p style="font-size: 0.9rem; opacity: 0.95; position: relative; background: rgba(255,255,255,0.2); display: inline-block; padding: 5px 15px; border-radius: 20px;">
                    Order #${todaysOrderNumber} of Today
                </p>
                <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 10px; position: relative;">
                    <i class="far fa-clock"></i> ${formattedDate}
                </p>
            </div>
            
            <!-- Order Summary -->
            <div style="background: #F9FAFB; border-radius: 12px; padding: 25px; margin-bottom: 25px; text-align: left;">
                <h4 style="color: #1F2937; margin-bottom: 20px; font-size: 1.15rem; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-box" style="color: #1E3A8A;"></i> Order Summary
                </h4>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #6B7280;">Total Products</span>
                    <strong style="color: #1F2937;">${order.totalProducts}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #6B7280;">Total Items</span>
                    <strong style="color: #1F2937;">${order.totalItems.toLocaleString()} units</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                    <span style="color: #6B7280;">Customer</span>
                    <strong style="color: #1F2937;">${order.customer.fullName}</strong>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="products.html" style="display: inline-flex; align-items: center; gap: 10px; padding: 15px 30px; background: #1E3A8A; color: white; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; font-size: 1rem;">
                    <i class="fas fa-shopping-bag"></i> Continue Shopping
                </a>
                <a href="https://wa.me/923000841330" target="_blank" style="display: inline-flex; align-items: center; gap: 10px; padding: 15px 30px; background: #25D366; color: white; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; font-size: 1rem;">
                    <i class="fab fa-whatsapp"></i> Open WhatsApp
                </a>
            </div>
            
            <p style="color: #9CA3AF; font-size: 0.85rem; margin-top: 20px;">
                <i class="fas fa-info-circle"></i> 
                Please save your Order ID for future reference.
            </p>
        </div>
    `;
    
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
    
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