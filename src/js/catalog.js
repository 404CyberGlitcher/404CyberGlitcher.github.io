// Catalog page functionality
import { loadHeader } from "./components/header.js";
import { loadFooter } from "./components/footer.js";
import { initCart, addToCart, showToast } from "./components/cart.js";
import { updateMetaTags, addBreadcrumbStructuredData } from "./utils/seo.js";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit as firestoreLimit,
  startAfter,
} from "firebase/firestore";
import { PRODUCTS_CONFIG } from "./config/firebase.js";

// Initialize Firebase
const productsApp = initializeApp(PRODUCTS_CONFIG, "products");
const productsDb = getFirestore(productsApp);

// State variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 12;
let currentFilters = {
  categories: [],
  brands: [],
  ratings: [],
  minPrice: null,
  maxPrice: null,
  sortBy: "default",
};
let lastDoc = null;
let isLoading = false;

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
  loadHeader();
  loadFooter();
  initCart();

  // Update SEO
  updateMetaTags({
    title: "Shop All Products - ColorMart | Premium Beauty & Cosmetics",
    description:
      "Browse our complete collection of premium makeup, hair care, skincare, and beauty products. Shop online with free shipping over Rs.2500.",
  });

  addBreadcrumbStructuredData([
    { name: "Home", url: "https://colormart.store/" },
    { name: "Catalog", url: "https://colormart.store/src/catalog.html" },
  ]);

  AOS.init({ duration: 800, once: true });

  await loadProducts();
  initFilters();
  initEventListeners();
});

// Load products from Firebase
async function loadProducts() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  isLoading = true;

  try {
    const productsRef = collection(productsDb, "products");
    let q = query(productsRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    allProducts = [];
    querySnapshot.forEach((doc) => {
      allProducts.push({ id: doc.id, ...doc.data() });
    });

    applyFilters();
  } catch (error) {
    console.error("Error loading products:", error);
    grid.innerHTML =
      '<p class="error">Failed to load products. Please refresh the page.</p>';
  } finally {
    isLoading = false;
  }
}

// Apply all filters
function applyFilters() {
  let filtered = [...allProducts];

  // Category filter
  if (currentFilters.categories.length > 0) {
    filtered = filtered.filter((p) =>
      currentFilters.categories.includes(p.category),
    );
  }

  // Brand filter
  if (currentFilters.brands.length > 0) {
    filtered = filtered.filter((p) => currentFilters.brands.includes(p.brand));
  }

  // Price filter
  if (currentFilters.minPrice !== null) {
    const price = currentFilters.minPrice;
    filtered = filtered.filter((p) => (p.salePrice || p.price) >= price);
  }
  if (currentFilters.maxPrice !== null) {
    const price = currentFilters.maxPrice;
    filtered = filtered.filter((p) => (p.salePrice || p.price) <= price);
  }

  // Rating filter
  if (currentFilters.ratings.length > 0) {
    filtered = filtered.filter((p) => {
      const rating = p.averageRating || 0;
      return currentFilters.ratings.some((r) => Math.floor(rating) >= r);
    });
  }

  // Sort
  filtered = sortProducts(filtered);

  filteredProducts = filtered;
  updateResultsCount();
  renderProducts();
}

// Sort products
function sortProducts(products) {
  const sorted = [...products];

  switch (currentFilters.sortBy) {
    case "price-low":
      sorted.sort(
        (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price),
      );
      break;
    case "price-high":
      sorted.sort(
        (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price),
      );
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "rating":
      sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      break;
    default:
      // Featured - keep original order
      break;
  }

  return sorted;
}

// Update results count
function updateResultsCount() {
  const countEl = document.getElementById("resultsCount");
  if (countEl) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredProducts.length);
    countEl.textContent = `Showing ${start}-${end} of ${filteredProducts.length} products`;
  }
}

// Render products with pagination
function renderProducts() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageProducts = filteredProducts.slice(start, end);

  if (pageProducts.length === 0) {
    grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1;">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </div>
        `;
    renderPagination();
    return;
  }

  grid.innerHTML = pageProducts
    .map((product) => {
      const displayPrice = product.salePrice || product.price;
      const originalPrice = product.salePrice ? product.price : null;
      const discount = product.salePrice
        ? Math.round(
            ((product.price - product.salePrice) / product.price) * 100,
          )
        : 0;

      return `
            <div class="product-card" data-product-id="${product.id}">
                ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ""}
                <div class="product-image">
                    <img src="${product.images?.[0] || "https://via.placeholder.com/300"}" alt="${product.name}" loading="lazy">
                    <div class="quick-add" data-id="${product.id}" data-name="${product.name}" data-price="${displayPrice}" data-image="${product.images?.[0]}">Quick Add</div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">Rs. ${displayPrice.toLocaleString()}</span>
                        ${originalPrice ? `<span class="original-price">Rs. ${originalPrice.toLocaleString()}</span>` : ""}
                    </div>
                    <div class="product-rating">
                        <div class="stars">${renderStars(product.averageRating || 0)}</div>
                        <span>(${product.reviewCount || 0})</span>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  // Add event listeners
  document.querySelectorAll(".quick-add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
      };
      addToCart(product, 1);
    });
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("quick-add")) return;
      const productId = card.dataset.productId;
      window.location.href = `/src/product.html?id=${productId}`;
    });
  });

  renderPagination();
}

// Render pagination
function renderPagination() {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let pagesHTML = "";

  // Previous button
  pagesHTML += `<button class="page-btn prev-page" ${currentPage === 1 ? "disabled" : ""}>« Prev</button>`;

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    pagesHTML += `<button class="page-btn" data-page="1">1</button>`;
    if (startPage > 2) pagesHTML += `<span class="page-dots">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    pagesHTML += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1)
      pagesHTML += `<span class="page-dots">...</span>`;
    pagesHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
  }

  // Next button
  pagesHTML += `<button class="page-btn next-page" ${currentPage === totalPages ? "disabled" : ""}>Next »</button>`;

  paginationContainer.innerHTML = pagesHTML;

  // Add event listeners
  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      if (btn.classList.contains("prev-page")) {
        if (currentPage > 1) currentPage--;
      } else if (btn.classList.contains("next-page")) {
        if (currentPage < totalPages) currentPage++;
      } else {
        currentPage = parseInt(btn.dataset.page);
      }
      renderProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// Render stars
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let stars = "";
  for (let i = 0; i < fullStars; i++) stars += "★";
  if (halfStar) stars += "½";
  for (let i = 0; i < emptyStars; i++) stars += "☆";

  return stars;
}

// Initialize filters from URL parameters
function initFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const search = urlParams.get("search");

  if (category) {
    currentFilters.categories = [category];
    // Update category filter checkboxes if they exist
    const categoryCheckbox = document.querySelector(
      `.filter-options input[value="${category}"]`,
    );
    if (categoryCheckbox) categoryCheckbox.checked = true;
  }

  if (search) {
    // Implement search filter
    const searchInput = document.getElementById("searchProducts");
    if (searchInput) searchInput.value = search;
    filterBySearch(search);
  }
}

// Filter by search
function filterBySearch(searchTerm) {
  if (!searchTerm) return;
  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  filteredProducts = filtered;
  currentPage = 1;
  renderProducts();
}

// Initialize event listeners
function initEventListeners() {
  // Sort selector
  const sortSelector = document.getElementById("sortSelector");
  if (sortSelector) {
    sortSelector.addEventListener("change", (e) => {
      currentFilters.sortBy = e.target.value;
      currentPage = 1;
      applyFilters();
    });
  }

  // Price filters
  const applyPriceBtn = document.getElementById("applyPriceFilter");
  const resetPriceBtn = document.getElementById("resetPriceFilter");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");

  if (applyPriceBtn) {
    applyPriceBtn.addEventListener("click", () => {
      currentFilters.minPrice = minPriceInput?.value
        ? parseFloat(minPriceInput.value)
        : null;
      currentFilters.maxPrice = maxPriceInput?.value
        ? parseFloat(maxPriceInput.value)
        : null;
      currentPage = 1;
      applyFilters();
    });
  }

  if (resetPriceBtn) {
    resetPriceBtn.addEventListener("click", () => {
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";
      currentFilters.minPrice = null;
      currentFilters.maxPrice = null;
      currentPage = 1;
      applyFilters();
    });
  }

  // Mobile filter toggle
  const filterToggle = document.getElementById("filterToggle");
  const filtersSidebar = document.getElementById("filtersSidebar");
  if (filterToggle && filtersSidebar) {
    filterToggle.addEventListener("click", () => {
      filtersSidebar.classList.toggle("active");
    });
  }
}

// Export for use in other files
export { loadProducts, applyFilters, renderProducts };
