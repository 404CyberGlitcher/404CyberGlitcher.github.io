/* ============================================
   About Us Page JavaScript
   ============================================ */

function initAboutPage() {
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize AOS
  initAOS();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutPage);
} else {
  initAboutPage();
}
