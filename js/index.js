/* ============================================
   Homepage JavaScript
   ============================================ */

function renderCategories() {
  const categories = getCategories();
  const container = document.getElementById('categories-grid');
  
  if (!container) return;
  
  const categoryIcons = {
    'cream-containers': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>',
    'crystal-series': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/><polyline points="2 15.5 12 8.5 22 15.5"/><line x1="12" y1="8.5" x2="12" y2="2"/></svg>',
    'facial-skincare': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    'versatile-packaging': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'
  };
  
  const categoryDescriptions = {
    'cream-containers': 'Jars for facial creams, moisturizers & more',
    'crystal-series': 'Premium crystal-clear luxury containers',
    'facial-skincare': 'Serum bottles, facial kits & treatments',
    'versatile-packaging': 'Boxes, bottles & storage solutions'
  };
  
  let html = '';
  Object.entries(categories).forEach(([key, name]) => {
    html += `
      <a href="products.html?category=${key}" class="category-card" data-aos="fade-up">
        <div class="category-icon">
          ${categoryIcons[key] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'}
        </div>
        <h3>${name}</h3>
        <p>${categoryDescriptions[key] || 'Quality packaging solutions'}</p>
      </a>
    `;
  });
  
  container.innerHTML = html;
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  
  if (!container) return;
  
  // Show first 6 products as featured
  const featuredProducts = products.slice(0, 6);
  
  let html = '';
  featuredProducts.forEach(product => {
    html += createProductCard(product);
  });
  
  container.innerHTML = html;
  
  // Add event listeners to add to cart buttons
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.productId);
      const product = getProductById(productId);
      if (product) {
        addToCart(product);
      }
    });
  });
  
  // Add event listeners to share buttons
  container.querySelectorAll('.share-product-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.productId);
      const product = getProductById(productId);
      if (product) {
        shareProduct(product);
      }
    });
  });
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
          <button class="galaxy-button galaxy-button--blue galaxy-button--small add-to-cart-btn" data-product-id="${product.id}">
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
          </button>
        </div>
      </div>
    </div>
  `;
}

// Initialize homepage
function initHomepage() {
  renderCategories();
  renderFeaturedProducts();
  initGalaxyButtons();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomepage);
} else {
  initHomepage();
}
