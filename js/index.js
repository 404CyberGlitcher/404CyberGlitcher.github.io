// Index Page - Anas Plastic Enterprises

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadHomeCategories();
    }
});

function loadHomeCategories() {
    const homeCategories = document.getElementById('homeCategories');
    if (!homeCategories) return;
    
    const categories = [
        {
            name: 'Cream Containers',
            icon: 'fas fa-flask',
            description: 'Specialized jars for facial creams, whitening creams, and moisturizers',
            link: 'products.html?category=cream-containers'
        },
        {
            name: 'Crystal Series',
            icon: 'fas fa-gem',
            description: 'Premium crystal-clear jars and bottles for a luxury aesthetic',
            link: 'products.html?category=crystal-series'
        },
        {
            name: 'Facial & Skincare',
            icon: 'fas fa-spa',
            description: 'Diverse range of facial kit jars and serum bottles',
            link: 'products.html?category=facial-skincare'
        },
        {
            name: 'Versatile Packaging',
            icon: 'fas fa-box',
            description: 'Empty plastic boxes, bottles for shampoos, syrups, and storage solutions',
            link: 'products.html?category=versatile-packaging'
        }
    ];
    
    homeCategories.innerHTML = categories.map((category, index) => `
        <div class="category-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <a href="${category.link}" class="category-link">View Products <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');
}aboutus.js