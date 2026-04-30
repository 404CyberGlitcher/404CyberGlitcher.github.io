// Earth Animation - Anas Plastic Enterprises

document.addEventListener('DOMContentLoaded', function() {
    const earthContainer = document.getElementById('earthAnimation');
    if (earthContainer) {
        createEarthAnimation(earthContainer);
    }
});

function createEarthAnimation(container) {
    container.innerHTML = `
        <div class="earth"></div>
    `;
}