/* ============================================
   Anas Plastic Enterprises - Utilities
   ============================================ */

// ============================================
// Cart Management
// ============================================

function getCart() {
  try {
    const cart = localStorage.getItem(CONFIG.CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (e) {
    console.error('Error reading cart:', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CONFIG.CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.images[0],
      category: product.categoryDisplay,
      quantity: 1
    });
  }
  
  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  showToast('Item removed from cart');
}

function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    item.quantity = quantity;
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.removeItem(CONFIG.CART_STORAGE_KEY);
  updateCartCount();
}

function getCartTotalItems() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const total = getCartTotalItems();
  countElements.forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ============================================
// WhatsApp Integration
// ============================================

function buildWhatsAppMessage() {
  const cart = getCart();
  
  if (cart.length === 0) {
    return CONFIG.WHATSAPP_MESSAGE_PREFIX + 'I would like to inquire about your products.' + CONFIG.WHATSAPP_MESSAGE_SUFFIX;
  }
  
  let message = CONFIG.WHATSAPP_MESSAGE_PREFIX;
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.category}) - Qty: ${item.quantity}\n`;
  });
  
  message += CONFIG.WHATSAPP_MESSAGE_SUFFIX;
  
  return message;
}

function sendOrderToWhatsApp() {
  const message = buildWhatsAppMessage();
  const whatsappUrl = getWhatsAppLink(message);
  window.open(whatsappUrl, '_blank');
}

// ============================================
// Product Sharing
// ============================================

async function shareProduct(product) {
  const shareData = {
    title: `${product.name} - ${CONFIG.BUSINESS_NAME}`,
    text: `${product.name}\n${product.description}\n\nCheck it out at ${CONFIG.BUSINESS_NAME}`,
    url: `${CONFIG.WEBSITE_URL}/product-detail.html?id=${product.id}`
  };
  
  // Try native sharing first
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (e) {
      console.log('Native share cancelled or failed');
    }
  }
  
  // Fallback: Copy to clipboard
  const textToCopy = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
  
  try {
    await navigator.clipboard.writeText(textToCopy);
    showToast('Product link copied to clipboard!');
  } catch (e) {
    // Final fallback
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Product link copied to clipboard!');
  }
}

// ============================================
// Toast Notifications
// ============================================

function showToast(message, duration = 3000) {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });
  
  // Auto remove
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// Mobile Menu
// ============================================

function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.nav-overlay');
  
  if (!menuToggle || !navMenu) return;
  
  function openMenu() {
    navMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  
  function closeMenu() {
    navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  
  menuToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }
  
  // Close on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ============================================
// Intersection Observer for Animations
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// Image Lazy Loading
// ============================================

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// Initialize Common Features
// ============================================

function initCommon() {
  updateCartCount();
  initSmoothScroll();
  initMobileMenu();
  initScrollAnimations();
  initLazyLoading();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCommon);
} else {
  initCommon();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCart, saveCart, addToCart, removeFromCart,
    updateCartItemQuantity, clearCart, getCartTotalItems,
    buildWhatsAppMessage, sendOrderToWhatsApp,
    shareProduct, showToast, initCommon
  };
}
