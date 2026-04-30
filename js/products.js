/* ============================================
   Products Page JavaScript
   ============================================ */

let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';

function initProductsPage() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  if (categoryParam) {
    currentCategory = categoryParam;
  }
  
  // Populate category filter
  populateCategoryFilter();
  
  // Set initial values
  const categorySelect = document.getElementById('category-select');
  if (categorySelect && currentCategory !== 'all') {
    categorySelect.value = currentCategory;
  }
  
  // Load products
  loadProducts();
  
  // Event listeners
  setupEventListeners();
}

function populateCategoryFilter() {
  const select = document.getElementById('category-select');
  if (!select) return;
  
  const categories = getCategories();
  
  Object.entries(categories).forEach(([key, name]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = name;
    select.appendChild(option);
  });
}

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearch = e.target.value.trim();
        currentPage = 1;
        loadProducts();
      }, 300);
    });
  }
  
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      currentPage = 1;
      loadProducts();
      
      // Update URL without reload
      const url = new URL(window.location);
      if (currentCategory === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', currentCategory);
      }
      window.history.replaceState({}, '', url);
    });
  }
}

function loadProducts() {
  const result = getPaginatedProducts(currentPage, CONFIG.PRODUCTS_PER_PAGE, currentCategory, currentSearch);
  const container = document.getElementById('products-grid');
  const paginationContainer = document.getElementById('pagination');
  const noResults = document.getElementById('no-results');
  
  if (!container) return;
  
  if (result.items.length === 0) {
    container.innerHTML = '';
    if (paginationContainer) paginationContainer.innerHTML = '';
    if (noResults) noResults.classList.remove('hidden');
    return;
  }
  
  if (noResults) noResults.classList.add('hidden');
  
  // Render products
  let html = '';
  result.items.forEach(product => {
    html += createProductCard(product);
  });
  
  container.innerHTML = html;
  
  // Render pagination
  renderPagination(result);
  
  // Add event listeners
  addProductEventListeners(container);
  
  // Initialize galaxy buttons
  initGalaxyButtons();
}

function createProductCard(product) {
  const imageUrl = product.images[0] || 'assets/images/placeholder.jpg';
  
  return `
    <div class="product-card" data-aos="fade-up">
      <div class="product-img">
        <img src="${imageUrl}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="badge product-badge">${product.badge}</span>` : ''}
        <div class="product-actions-overlay">
          <button class="product-action-btn share-product-btn" data-product-id="${product.id}" aria-label="Share product">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.categoryDisplay}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-card-footer">
          <a href="product-detail.html?id=${product.id}" class="btn-secondary" style="padding: 10px 20px; font-size: 0.9rem;">View Details</a>
          <div class="galaxy-button galaxy-button--blue galaxy-button--small add-to-cart-btn" data-product-id="${product.id}">
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
              <span class="text">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPagination(result) {
  const container = document.getElementById('pagination');
  if (!container || result.totalPages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous button
  html += `
    <button class="page-btn" ${result.currentPage === 1 ? 'disabled' : ''} data-page="${result.currentPage - 1}" aria-label="Previous page">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
  `;
  
  // Page numbers
  const maxVisible = 5;
  let startPage = Math.max(1, result.currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(result.totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  if (startPage > 1) {
    html += `<button class="page-btn" data-page="1">1</button>`;
    if (startPage > 2) {
      html += `<span class="page-btn" style="cursor: default; border: none;">...</span>`;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === result.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  if (endPage < result.totalPages) {
    if (endPage < result.totalPages - 1) {
      html += `<span class="page-btn" style="cursor: default; border: none;">...</span>`;
    }
    html += `<button class="page-btn" data-page="${result.totalPages}">${result.totalPages}</button>`;
  }
  
  // Next button
  html += `
    <button class="page-btn" ${result.currentPage === result.totalPages ? 'disabled' : ''} data-page="${result.currentPage + 1}" aria-label="Next page">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  `;
  
  container.innerHTML = html;
  
  // Add click listeners
  container.querySelectorAll('button[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (page && page !== currentPage) {
        currentPage = page;
        loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

function addProductEventListeners(container) {
  // Add to cart buttons
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = parseInt(btn.dataset.productId);
      const product = getProductById(productId);
      if (product) {
        addToCart(product);
      }
    });
  });
  
  // Share buttons
  container.querySelectorAll('.share-product-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = parseInt(btn.dataset.productId);
      const product = getProductById(productId);
      if (product) {
        shareProduct(product);
      }
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsPage);
} else {
  initProductsPage();
}
