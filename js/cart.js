/* ============================================
   Cart Page JavaScript
   ============================================ */

function initCartPage() {
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-container');
  const cart = getCart();
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart" data-aos="fade-up">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h3>Your cart is empty</h3>
        <p>Browse our products and add items to your cart</p>
        <a href="products.html" class="btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }
  
  let itemsHtml = '';
  let totalItems = 0;
  
  cart.forEach(item => {
    totalItems += item.quantity;
    itemsHtml += `
      <div class="cart-item" data-aos="fade-up" data-product-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <span class="category">${item.category}</span>
          <div class="quantity-control">
            <button class="qty-btn qty-decrease" data-product-id="${item.id}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn qty-increase" data-product-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-actions">
          <button class="remove-btn" data-product-id="${item.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Remove
          </button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = `
    <div class="cart-items">
      ${itemsHtml}
    </div>
    
    <div class="cart-summary" data-aos="fade-up">
      <h3>Order Summary</h3>
      <div class="summary-row">
        <span>Total Items</span>
        <span><strong>${totalItems}</strong></span>
      </div>
      <div class="summary-row">
        <span>Products</span>
        <span>${cart.length}</span>
      </div>
      
      <div class="summary-note">
        <strong>Note:</strong> Prices are not displayed online. After reviewing your selection, click "Place Order" to send your inquiry via WhatsApp. Our team will respond with pricing and availability details.
      </div>
      
      <div class="cart-actions">
        <a href="checkout.html" class="galaxy-button galaxy-button--red galaxy-button--large">
          <button type="button">
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
                <span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span>
                <span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span>
                <span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span>
                <span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span>
                <span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span>
              </span>
            </span>
            <span class="text">Proceed to Checkout</span>
          </button>
        </a>
        <a href="products.html" class="btn-secondary">Continue Shopping</a>
      </div>
    </div>
  `;
  
  // Add event listeners
  addCartEventListeners(container);
  
  // Initialize galaxy buttons
  initGalaxyButtons();
}

function addCartEventListeners(container) {
  // Quantity decrease
  container.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      const cart = getCart();
      const item = cart.find(i => i.id === productId);
      if (item && item.quantity > 1) {
        updateCartItemQuantity(productId, item.quantity - 1);
        renderCart();
      }
    });
  });
  
  // Quantity increase
  container.querySelectorAll('.qty-increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      const cart = getCart();
      const item = cart.find(i => i.id === productId);
      if (item) {
        updateCartItemQuantity(productId, item.quantity + 1);
        renderCart();
      }
    });
  });
  
  // Remove item
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      removeFromCart(productId);
      renderCart();
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCartPage);
} else {
  initCartPage();
}
