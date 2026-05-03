// ============================================
// COLORMART - FOOTER COMPONENT
// ============================================

class FooterComponent {
    constructor() {
        this.footerContainer = document.getElementById('footer-container');
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const currentYear = new Date().getFullYear();
        
        const footerHTML = `
            <!-- Newsletter Section -->
            <section class="footer-newsletter">
                <div class="container">
                    <div class="newsletter-content">
                        <h3>Stay in the Loop</h3>
                        <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form class="newsletter-form" id="newsletter-form">
                            <input type="email" placeholder="Enter your email" required aria-label="Email for newsletter">
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>

            <footer class="site-footer">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-column">
                            <h3>About ${ENV.SITE.name}</h3>
                            <p>Your premier destination for beauty, cosmetics, and lifestyle products. We offer premium quality products from top brands at competitive prices.</p>
                            <div class="social-links">
                                <a href="https://facebook.com/colormart" target="_blank" rel="noopener" class="social-icon" aria-label="Facebook">
                                    <span>📘</span>
                                </a>
                                <a href="https://instagram.com/colormart" target="_blank" rel="noopener" class="social-icon" aria-label="Instagram">
                                    <span>📸</span>
                                </a>
                            </div>
                        </div>
                        
                        <div class="footer-column">
                            <h3>Quick Links</h3>
                            <div class="footer-links">
                                <a href="${this.getHomePath()}" class="footer-link">Home</a>
                                <a href="${this.getPagePath('catalog.html')}" class="footer-link">Shop All</a>
                                <a href="${this.getPagePath('catalog.html')}?category=makeup" class="footer-link">Makeup</a>
                                <a href="${this.getPagePath('catalog.html')}?category=hair-care" class="footer-link">Hair Care</a>
                                <a href="${this.getPagePath('catalog.html')}?category=organizers" class="footer-link">Organizers</a>
                            </div>
                        </div>
                        
                        <div class="footer-column">
                            <h3>Customer Service</h3>
                            <div class="footer-links">
                                <a href="${this.getPagePath('contact.html')}" class="footer-link">Contact Us</a>
                                <a href="#" class="footer-link">Shipping Policy</a>
                                <a href="#" class="footer-link">Returns & Exchanges</a>
                                <a href="#" class="footer-link">FAQ</a>
                                <a href="#" class="footer-link">Privacy Policy</a>
                            </div>
                        </div>
                        
                        <div class="footer-column">
                            <h3>Contact Info</h3>
                            <div class="footer-links">
                                <p>📧 ${ENV.STAFF.email}</p>
                                <p>📞 +92 300 1234567</p>
                                <p>📍 Lahore, Pakistan</p>
                                <p>🕐 Mon-Sat: 10 AM - 8 PM</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>&copy; ${currentYear} ${ENV.SITE.name}. All rights reserved.</p>
                        <div class="payment-icons">
                            <span>💳</span>
                            <span>🏦</span>
                            <span>📱</span>
                            <span>💵</span>
                        </div>
                    </div>
                </div>
            </footer>

            <!-- Back to Top Button -->
            <button class="back-to-top" id="back-to-top" aria-label="Back to top">↑</button>
        `;

        this.footerContainer.innerHTML = footerHTML;
    }

    setupEventListeners() {
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            this.subscribeToNewsletter(email);
        });

        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop?.classList.add('active');
            } else {
                backToTop?.classList.remove('active');
            }
        });

        backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    subscribeToNewsletter(email) {
        // Here you would typically save to Firebase or email service
        console.log('Newsletter subscription:', email);
        alert('Thank you for subscribing to our newsletter!');
        document.getElementById('newsletter-form')?.reset();
    }

    getHomePath() {
        const depth = window.location.pathname.split('/').filter(Boolean).length;
        if (depth === 0) return './';
        if (depth === 1 && window.location.pathname.includes('src/')) return '../index.html';
        if (depth === 2) return '../../index.html';
        return '../index.html';
    }

    getPagePath(page) {
        const depth = window.location.pathname.split('/').filter(Boolean).length;
        if (depth === 0) return `src/${page}`;
        if (depth === 1 && window.location.pathname.includes('src/')) return page;
        return `../${page}`;
    }
}

// Initialize footer
const footer = new FooterComponent();
export default footer;