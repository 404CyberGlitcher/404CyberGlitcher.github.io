/* ============================================
   Product Detail Page JavaScript
   ============================================ */

function initProductDetail() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  
  if (!productId) {
    showError('Product not found');
    return;
  }
  
  const product = getProductById(productId);
  
  if (!product) {
    showError('Product not found');
    return;
  }
  
  // Update page title and meta
  document.title = `${product.name} | Anas Plastic Enterprises`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = `${product.name} - ${product.description}`;
  }
  
  // Render product detail
  renderProductDetail(product);
  
  // Render related products
  renderRelatedProducts(product);
  
  // Initialize galaxy buttons
  initGalaxyButtons();
}

function renderProductDetail(product) {
  const container = document.getElementById('product-detail-container');
  
  const mainImage = product.images[0] || 'assets/images/placeholder.jpg';
  
  let galleryHtml = '';
  if (product.images.length > 1) {
    product.images.forEach((img, index) => {
      galleryHtml += `<img src="${img}" alt="${product.name} - View ${index + 1}" class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}" onclick="changeMainImage('${img}', this)">`;
    });
  }
  
  const featuresHtml = product.features.map(f => `<li>${f}</li>`).join('');
  
  container.innerHTML = `
    <div class="product-detail-box">
      <div class="product-detail-img">
        <img src="${mainImage}" alt="${product.name}" class="main-image" id="main-image">
        ${product.images.length > 1 ? `<div class="product-gallery">${galleryHtml}</div>` : ''}
      </div>
      
      <div class="product-detail-disc">
        <span class="category">${product.categoryDisplay}</span>
        <h1>${product.name}</h1>
        <p class="description">${product.description}</p>
        
        <div class="product-detail-features">
          <h3>Features</h3>
          <ul>${featuresHtml}</ul>
        </div>
        
        <div class="product-detail-actions">
          <div class="galaxy-button galaxy-button--red" id="add-to-cart-btn">
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
          
          <button class="btn-share" id="share-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span>Share Product</span>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add to cart event
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    addToCart(product);
  });
  
  // Share event
  document.getElementById('share-btn').addEventListener('click', () => {
    shareProduct(product);
  });
}

function changeMainImage(src, thumb) {
  const mainImage = document.getElementById('main-image');
  mainImage.style.opacity = '0';
  setTimeout(() => {
    mainImage.src = src;
    mainImage.style.opacity = '1';
  }, 200);
  
  // Update active thumb
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function renderRelatedProducts(currentProduct) {
  const container = document.getElementById('related-products');
  if (!container) return;
  
  // Get products from same category, excluding current
  const related = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4);
  
  if (related.length === 0) {
    // If no same category, get any other products
    const other = products
      .filter(p => p.id !== currentProduct.id)
      .slice(0, 4);
    if (other.length === 0) {
      container.innerHTML = '<p class="text-center">No related products found.</p>';
      return;
    }
    renderProductCards(other, container);
    return;
  }
  
  renderProductCards(related, container);
}

function renderProductCards(products, container) {
  let html = '';
  products.forEach(product => {
    const imageUrl = product.images[0] || 'assets/images/placeholder.jpg';
    html += `
      <div class="product-card" data-aos="fade-up">
        <div class="product-img">
          <img src="${imageUrl}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<span class="badge product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <span class="product-category">${product.categoryDisplay}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-card-footer">
            <a href="product-detail.html?id=${product.id}" class="btn-secondary" style="padding: 10px 20px; font-size: 0.9rem;">View Details</a>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function showError(message) {
  const container = document.getElementById('product-detail-container');
  if (container) {
    container.innerHTML = `
      <div class="text-center" style="padding: 80px 20px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 60px; height: 60px; color: var(--medium-gray); margin-bottom: 20px;">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>${message}</h3>
        <a href="products.html" class="btn-primary mt-3">Browse Products</a>
      </div>
    `;
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductDetail);
} else {
  initProductDetail();
}
