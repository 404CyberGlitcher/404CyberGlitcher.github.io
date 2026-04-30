// Galaxy Button Animation - Anas Plastic Enterprises

const RANDOM = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

document.addEventListener('DOMContentLoaded', function() {
    initializeGalaxyButtons();
});

function initializeGalaxyButtons() {
    const PARTICLES = document.querySelectorAll('.galaxy-button .star');
    
    PARTICLES.forEach(P => {
        P.setAttribute('style', `
            --angle: ${RANDOM(0, 360)};
            --duration: ${RANDOM(6, 20)};
            --delay: ${RANDOM(1, 10)};
            --alpha: ${RANDOM(40, 90) / 100};
            --size: ${RANDOM(2, 6)};
            --distance: ${RANDOM(40, 200)};
        `);
    });
}