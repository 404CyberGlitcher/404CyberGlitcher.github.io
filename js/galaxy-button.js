/* ============================================
   Cosmic 3D Galaxy Button - Initialization
   ============================================ */

function initGalaxyButtons() {
  const RANDOM = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  
  document.querySelectorAll('.galaxy-button').forEach(button => {
    const stars = button.querySelectorAll('.star');
    
    stars.forEach(star => {
      star.setAttribute('style', `
        --angle: ${RANDOM(0, 360)};
        --duration: ${RANDOM(6, 20)};
        --delay: ${RANDOM(1, 10)};
        --alpha: ${RANDOM(40, 90) / 100};
        --size: ${RANDOM(2, 6)};
        --distance: ${RANDOM(40, 200)};
      `);
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGalaxyButtons);
} else {
  initGalaxyButtons();
}
