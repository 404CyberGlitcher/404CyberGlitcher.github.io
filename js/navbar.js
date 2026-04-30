/* ============================================
   Anas Plastic Enterprises - Navigation
   ============================================ */

function createNavbar() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  const navHTML = `
    <header class="main-header" data-aos="fade-down">
      <div class="container">
        <nav class="navbar" role="navigation" aria-label="Main navigation">
          <a href="index.html" class="logo" aria-label="Anas Plastic Enterprises Home">
            <div class="logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="32" height="24" rx="4" stroke="currentColor" stroke-width="2.5" fill="none"/>
                <path d="M12 16L20 24L28 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="logo-text">
              <span class="logo-main">Anas Plastic</span>
              <span class="logo-sub">Enterprises</span>
            </div>
          </a>
          
          <div class="nav-overlay" aria-hidden="true"></div>
          
          <ul class="nav-menu" role="menubar">
            <li role="none">
              <a href="index.html" class="nav-link ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}" role="menuitem">
                <span>Home</span>
              </a>
            </li>
            <li role="none">
              <a href="products.html" class="nav-link ${currentPage === 'products.html' ? 'active' : ''}" role="menuitem">
                <span>Products</span>
              </a>
            </li>
            <li role="none">
              <a href="aboutus.html" class="nav-link ${currentPage === 'aboutus.html' ? 'active' : ''}" role="menuitem">
                <span>About Us</span>
              </a>
            </li>
            <li role="none">
              <a href="contact.html" class="nav-link ${currentPage === 'contact.html' ? 'active' : ''}" role="menuitem">
                <span>Contact</span>
              </a>
            </li>
          </ul>
          
          <div class="nav-actions">
            <a href="cart.html" class="cart-btn" aria-label="Shopping cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span class="cart-count" style="display: none;">0</span>
            </a>
            
            <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}" target="_blank" class="whatsapp-btn" aria-label="Chat on WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
            
            <button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false">
              <span class="hamburger"></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  `;
  
  // Insert at the beginning of body
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = navHTML;
  document.body.insertBefore(tempDiv.firstElementChild, document.body.firstChild);
  
  // Add scroll behavior
  let lastScroll = 0;
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// Initialize navbar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createNavbar);
} else {
  createNavbar();
}
