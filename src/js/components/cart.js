// Shopping cart functionality

// Cart storage key
const CART_KEY = "colormart_cart";

// Get cart from localStorage
export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

// Save cart to localStorage
export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Dispatch event for header update
  window.dispatchEvent(new Event("cartUpdated"));
  return cart;
};

// Add item to cart
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      originalPrice: product.price,
      image: product.images?.[0] || product.image,
      quantity: quantity,
      maxStock: product.stock || 999,
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart!`);
  return cart;
};

// Remove item from cart
export const removeFromCart = (productId) => {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  showToast("Item removed from cart");
  return cart;
};

// Update item quantity
export const updateQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
};

// Clear entire cart
export const clearCart = () => {
  saveCart([]);
  showToast("Cart cleared");
  return [];
};

// Get cart total
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Get cart item count
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Show toast notification
export const showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.backgroundColor = type === "success" ? "#22c55e" : "#ef4444";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Load cart sidebar
export const loadCartSidebar = () => {
  // Check if cart sidebar already exists
  if (document.getElementById("cartSidebar")) return;

  const cartSidebarHTML = `
        <div class="cart-overlay" id="cartOverlay"></div>
        <div class="cart-sidebar" id="cartSidebar">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="close-cart" id="closeCartBtn">&times;</button>
            </div>
            <div class="cart-items" id="cartItems">
                <div class="empty-cart-message" style="text-align: center; padding: 2rem;">
                    Your cart is empty
                </div>
            </div>
            <div class="cart-footer" id="cartFooter" style="display: none;">
                <div class="cart-total">
                    <span>Total:</span>
                    <span id="cartTotalAmount">Rs. 0</span>
                </div>
                <div class="cart-actions">
                    <button class="btn-primary" id="checkoutBtn">Checkout</button>
                    <button class="btn-secondary" id="clearCartBtn">Clear</button>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", cartSidebarHTML);

  // Initialize cart sidebar functionality
  initCartSidebar();

  return document.getElementById("cartSidebar");
};

const initCartSidebar = () => {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartBtn = document.getElementById("cartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");

  // Open cart
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      renderCartItems();
      cartSidebar.classList.add("open");
      cartOverlay.classList.add("open");
    });
  }

  // Close cart
  const closeCart = () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
  };

  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Clear cart
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      clearCart();
      renderCartItems();
      showToast("Cart cleared");
    });
  }

  // Checkout
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast("Your cart is empty", "error");
        return;
      }
      // Redirect to checkout page
      window.location.href = "/src/checkout.html";
    });
  }
};

const renderCartItems = () => {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotalAmount = document.getElementById("cartTotalAmount");

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<div class="empty-cart-message" style="text-align: center; padding: 2rem;">Your cart is empty</div>';
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }

  const itemsHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image || "https://via.placeholder.com/80"}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}">+</button>
                    <span class="remove-item" data-id="${item.id}">Remove</span>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  cartItemsContainer.innerHTML = itemsHTML;
  if (cartFooter) cartFooter.style.display = "block";

  const total = getCartTotal();
  if (cartTotalAmount)
    cartTotalAmount.textContent = `Rs. ${total.toLocaleString()}`;

  // Add event listeners
  document.querySelectorAll(".decrease-qty").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      const item = cart.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        updateQuantity(id, item.quantity - 1);
        renderCartItems();
      } else if (item) {
        removeFromCart(id);
        renderCartItems();
      }
    });
  });

  document.querySelectorAll(".increase-qty").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      const item = cart.find((i) => i.id === id);
      if (item && item.quantity < item.maxStock) {
        updateQuantity(id, item.quantity + 1);
        renderCartItems();
      } else {
        showToast("Maximum stock reached", "error");
      }
    });
  });

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      removeFromCart(id);
      renderCartItems();
    });
  });
};

// Update cart count in header
export const updateCartCount = () => {
  const count = getCartCount();
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
};

// Initialize cart on page load
export const initCart = () => {
  loadCartSidebar();
  updateCartCount();

  // Listen for cart updates
  window.addEventListener("cartUpdated", () => {
    updateCartCount();
  });
};
