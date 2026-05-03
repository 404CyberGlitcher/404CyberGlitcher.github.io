// Footer component

export const loadFooter = () => {
  const footerHTML = `
        <footer class="main-footer">
            <div class="footer-container">
                <div class="footer-section">
                    <h3>ColorMart</h3>
                    <p>Pakistan's premier destination for premium beauty and cosmetic products. Authentic brands, best prices.</p>
                    <div class="social-links">
                        <a href="https://facebook.com/colormart" target="_blank" rel="noopener noreferrer">📘</a>
                        <a href="https://instagram.com/colormart" target="_blank" rel="noopener noreferrer">📷</a>
                        <a href="https://twitter.com/colormart" target="_blank" rel="noopener noreferrer">🐦</a>
                        <a href="https://pinterest.com/colormart" target="_blank" rel="noopener noreferrer">📌</a>
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/src/catalog.html">Shop All</a></li>
                        <li><a href="/src/contact.html">Contact Us</a></li>
                        <li><a href="/pages/terms.html">Terms & Conditions</a></li>
                        <li><a href="/pages/privacy.html">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Categories</h3>
                    <ul>
                        <li><a href="/src/catalog.html?category=makeup">Makeup</a></li>
                        <li><a href="/src/catalog.html?category=hair-care">Hair Care</a></li>
                        <li><a href="/src/catalog.html?category=mens-care">Men's Care</a></li>
                        <li><a href="/src/catalog.html?category=organizers">Organizers</a></li>
                        <li><a href="/src/catalog.html?category=essentials">Essentials</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Newsletter</h3>
                    <p>Subscribe for exclusive offers and new arrivals</p>
                    <form class="newsletter-form" id="newsletterForm">
                        <input type="email" placeholder="Your email address" required>
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ColorMart. All rights reserved. | Free shipping on orders over Rs. 2500</p>
            </div>
        </footer>
    `;

  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }

  // Initialize newsletter form
  initNewsletterForm();

  return footerContainer;
};

const initNewsletterForm = () => {
  const form = document.getElementById("newsletterForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;

      // Show success message
      showToast("Thank you for subscribing!", "success");
      form.reset();

      // You can add code here to save to Firebase if needed
    });
  }
};

const showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.backgroundColor = type === "success" ? "#22c55e" : "#ef4444";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};
