/* ============================================
   Checkout Page JavaScript
   ============================================ */

function initCheckout() {
  const cart = getCart();
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  renderOrderItems(cart);
  setupPlaceOrderButton(cart);
}

function renderOrderItems(cart) {
  const container = document.getElementById('order-items');
  const totalEl = document.getElementById('total-items');
  
  if (!container) return;
  
  let html = '';
  let totalItems = 0;
  
  cart.forEach(item => {
    totalItems += item.quantity;
    html += `
      <div class="order-item" data-aos="fade-up">
        <div class="order-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="order-item-details">
          <h4>${item.name}</h4>
          <span class="category">${item.category}</span>
        </div>
        <span class="order-item-qty">x${item.quantity}</span>
      </div>
    `;
  });
  
  container.innerHTML = html;
  if (totalEl) totalEl.textContent = totalItems;
}

function setupPlaceOrderButton(cart) {
  const btn = document.getElementById('place-order-btn');
  
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    // Build comprehensive WhatsApp message
    let message = `*Order Inquiry - Anas Plastic Enterprises*\n\n`;
    message += `Hello, I would like to inquire about the following products:\n\n`;
    
    cart.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      message += `   Category: ${item.category}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Link: ${CONFIG.WEBSITE_URL}/product-detail.html?id=${item.id}\n\n`;
    });
    
    message += `\nPlease provide:\n`;
    message += `- Pricing details\n`;
    message += `- Availability\n`;
    message += `- Delivery options\n`;
    message += `- Minimum order quantities\n\n`;
    message += `Thank you!`;
    
    // Open WhatsApp
    const whatsappUrl = getWhatsAppLink(message);
    window.open(whatsappUrl, '_blank');
    
    // Show confirmation
    showToast('Redirecting to WhatsApp with your order details...');
    
    // Optional: Clear cart after a delay
    setTimeout(() => {
      if (confirm('Would you like to clear your cart?')) {
        clearCart();
      }
    }, 2000);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckout);
} else {
  initCheckout();
}
