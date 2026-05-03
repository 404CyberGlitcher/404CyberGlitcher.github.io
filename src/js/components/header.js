// Header component with dynamic navigation and cart
import { getCart, updateCartCount } from "./cart.js";

let cart = getCart();

export const loadHeader = () => {
  const headerHTML = `
        <header class="main-header">
            <div class="header-container">
                <button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>
                <a href="/" class="logo">Color<span>Mart</span></a>
                <nav class="main-nav" id="mainNav">
                    <a href="/" class="${window.location.pathname === "/" ? "active" : ""}">Home</a>
                    <a href="/src/catalog.html" class="${window.location.pathname.includes("catalog") ? "active" : ""}">Catalog</a>
                    <a href="/src/contact.html" class="${window.location.pathname.includes("contact") ? "active" : ""}">Contact</a>
                </nav>
                <div class="header-actions">
                    <button id="searchBtn" aria-label="Search">🔍</button>
                    <a href="/src/admin/login.html" id="adminLink" aria-label="Admin">👤</a>
                    <button id="cartBtn" aria-label="Cart">
                        🛒
                        <span class="cart-count" id="cartCount">${cart.length}</span>
                    </button>
                </div>
            </div>
        </header>
    `;

  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;
  }

  // Initialize mobile menu
  initMobileMenu();

  // Initialize search
  initSearch();

  // Initialize admin link check
  checkAdminAccess();

  // Update cart count listener
  window.addEventListener("cartUpdated", () => {
    const updatedCart = getCart();
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
      cartCountEl.textContent = updatedCart.length;
    }
  });

  return headerContainer;
};

const initMobileMenu = () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("active");
      });
    });
  }
};

const initSearch = () => {
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const searchQuery = prompt("Search products...");
      if (searchQuery && searchQuery.trim()) {
        window.location.href = `/src/catalog.html?search=${encodeURIComponent(searchQuery.trim())}`;
      }
    });
  }
};

const checkAdminAccess = async () => {
  const adminLink = document.getElementById("adminLink");
  if (!adminLink) return;

  // Check if user is logged in as admin (session storage)
  const adminSession = sessionStorage.getItem("adminLoggedIn");
  if (adminSession === "true") {
    adminLink.href = "/src/admin/dashboard.html";
  } else {
    adminLink.href = "/src/admin/login.html";
  }
};

// Export for use in other files
export const updateHeaderCartCount = (count) => {
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
};
