/* ============================================
   Anas Plastic Enterprises - Product Data
   ============================================ */

const products = [
  {
    id: 1,
    name: "Premium Cream Jar 50ml",
    category: "cream-containers",
    categoryDisplay: "Cream Containers",
    description: "High-quality empty plastic jar perfect for facial creams, whitening creams, and moisturizers. Features secure screw-top lid and smooth finish for easy labeling.",
    images: ["assets/images/jar-50ml-1.jpg", "assets/images/jar-50ml-2.jpg"],
    badge: "Best Seller",
    features: ["50ml Capacity", "Screw-top Lid", "BPA Free", "Recyclable"],
    inStock: true
  },
  {
    id: 2,
    name: "Luxury Cream Jar 100ml",
    category: "cream-containers",
    categoryDisplay: "Cream Containers",
    description: "Elegant 100ml cream container with premium finish. Ideal for professional skincare brands looking for durable and stylish packaging solutions.",
    images: ["assets/images/jar-100ml-1.jpg", "assets/images/jar-100ml-2.jpg"],
    badge: "Popular",
    features: ["100ml Capacity", "Double-wall Design", "UV Protection", "Premium Finish"],
    inStock: true
  },
  {
    id: 3,
    name: "Crystal Clear Jar 30ml",
    category: "crystal-series",
    categoryDisplay: "Crystal Series",
    description: "Stunning crystal-clear jar that showcases your product beautifully. Perfect for premium cosmetic brands seeking a luxury aesthetic.",
    images: ["assets/images/crystal-jar-30ml-1.jpg", "assets/images/crystal-jar-30ml-2.jpg"],
    badge: "Premium",
    features: ["30ml Capacity", "Crystal Clear", "Heavy Base", "Luxury Look"],
    inStock: true
  },
  {
    id: 4,
    name: "Crystal Bottle 100ml",
    category: "crystal-series",
    categoryDisplay: "Crystal Series",
    description: "Premium crystal-clear bottle with pump dispenser. Perfect for serums, lotions, and liquid skincare products requiring elegant presentation.",
    images: ["assets/images/crystal-bottle-100ml-1.jpg", "assets/images/crystal-bottle-100ml-2.jpg"],
    badge: "New",
    features: ["100ml Capacity", "Pump Dispenser", "Crystal Clear", "Leak Proof"],
    inStock: true
  },
  {
    id: 5,
    name: "Facial Kit Jar Set",
    category: "facial-skincare",
    categoryDisplay: "Facial & Skincare",
    description: "Complete set of facial kit jars in multiple sizes. Perfect for beauty brands offering comprehensive skincare routines and treatments.",
    images: ["assets/images/facial-kit-1.jpg", "assets/images/facial-kit-2.jpg"],
    badge: "Set",
    features: ["Multiple Sizes", "Matching Design", "Travel Friendly", "Complete Kit"],
    inStock: true
  },
  {
    id: 6,
    name: "Serum Dropper Bottle 30ml",
    category: "facial-skincare",
    categoryDisplay: "Facial & Skincare",
    description: "Professional-grade serum bottle with glass dropper. Essential for facial serums, essential oils, and concentrated skincare treatments.",
    images: ["assets/images/serum-bottle-1.jpg", "assets/images/serum-bottle-2.jpg"],
    badge: "Professional",
    features: ["30ml Capacity", "Glass Dropper", "Amber Protection", "Precise Dosing"],
    inStock: true
  },
  {
    id: 7,
    name: "Empty Plastic Box Large",
    category: "versatile-packaging",
    categoryDisplay: "Versatile Packaging",
    description: "Versatile empty plastic box suitable for various cosmetic storage needs. Durable construction with transparent lid for easy product visibility.",
    images: ["assets/images/plastic-box-large-1.jpg", "assets/images/plastic-box-large-2.jpg"],
    badge: "Versatile",
    features: ["Large Capacity", "Transparent Lid", "Stackable", "Durable"],
    inStock: true
  },
  {
    id: 8,
    name: "Shampoo Bottle 250ml",
    category: "versatile-packaging",
    categoryDisplay: "Versatile Packaging",
    description: "Sturdy 250ml bottle designed for shampoos, conditioners, and body washes. Features flip-top cap for easy dispensing.",
    images: ["assets/images/shampoo-bottle-1.jpg", "assets/images/shampoo-bottle-2.jpg"],
    badge: "Bulk Ready",
    features: ["250ml Capacity", "Flip-top Cap", "Squeeze Design", "Chemical Resistant"],
    inStock: true
  },
  {
    id: 9,
    name: "Syrup Bottle 120ml",
    category: "versatile-packaging",
    categoryDisplay: "Versatile Packaging",
    description: "Medical-grade syrup bottle with measuring cap. Suitable for liquid medications, cough syrups, and health supplements.",
    images: ["assets/images/syrup-bottle-1.jpg", "assets/images/syrup-bottle-2.jpg"],
    badge: "Medical Grade",
    features: ["120ml Capacity", "Measuring Cap", "Child Safe", "Medical Grade"],
    inStock: true
  },
  {
    id: 10,
    name: "Compact Powder Case",
    category: "cream-containers",
    categoryDisplay: "Cream Containers",
    description: "Elegant compact case for pressed powders, blushes, and foundation. Includes mirror and applicator compartment.",
    images: ["assets/images/compact-case-1.jpg", "assets/images/compact-case-2.jpg"],
    badge: "Makeup",
    features: ["Mirror Included", "Applicator Space", "Snap Closure", "Sleek Design"],
    inStock: true
  },
  {
    id: 11,
    name: "Crystal Lotion Bottle 200ml",
    category: "crystal-series",
    categoryDisplay: "Crystal Series",
    description: "Beautiful crystal-clear lotion bottle with pump. Perfect for body lotions, hand creams, and liquid moisturizers.",
    images: ["assets/images/crystal-lotion-1.jpg", "assets/images/crystal-lotion-2.jpg"],
    badge: "Elegant",
    features: ["200ml Capacity", "Pump Dispenser", "Crystal Clear", "Stable Base"],
    inStock: true
  },
  {
    id: 12,
    name: "Eye Cream Jar 15ml",
    category: "facial-skincare",
    categoryDisplay: "Facial & Skincare",
    description: "Small precision jar perfect for eye creams, lip balms, and targeted treatments. Compact size ideal for travel and samples.",
    images: ["assets/images/eye-cream-jar-1.jpg", "assets/images/eye-cream-jar-2.jpg"],
    badge: "Mini",
    features: ["15ml Capacity", "Compact Size", "Travel Friendly", "Precision Pot"],
    inStock: true
  },
  {
    id: 13,
    name: "Storage Container Set",
    category: "versatile-packaging",
    categoryDisplay: "Versatile Packaging",
    description: "Multi-size storage container set for organizing beauty products, tools, and accessories. Stackable design saves space.",
    images: ["assets/images/storage-set-1.jpg", "assets/images/storage-set-2.jpg"],
    badge: "Organizer",
    features: ["Multiple Sizes", "Stackable", "Clear Body", "Lid Included"],
    inStock: true
  },
  {
    id: 14,
    name: "Body Butter Jar 200ml",
    category: "cream-containers",
    categoryDisplay: "Cream Containers",
    description: "Wide-mouth jar perfect for thick body butters, scrubs, and masks. Easy access design with wide opening.",
    images: ["assets/images/butter-jar-1.jpg", "assets/images/butter-jar-2.jpg"],
    badge: "Wide Mouth",
    features: ["200ml Capacity", "Wide Opening", "Thick Wall", "Easy Access"],
    inStock: true
  },
  {
    id: 15,
    name: "Crystal Serum Bottle 50ml",
    category: "crystal-series",
    categoryDisplay: "Crystal Series",
    description: "Premium crystal serum bottle with dropper cap. Showcases high-end serums and facial oils with stunning clarity.",
    images: ["assets/images/crystal-serum-1.jpg", "assets/images/crystal-serum-2.jpg"],
    badge: "Luxury",
    features: ["50ml Capacity", "Dropper Cap", "Crystal Clear", "Premium Feel"],
    inStock: true
  },
  {
    id: 16,
    name: "Face Mask Container",
    category: "facial-skincare",
    categoryDisplay: "Facial & Skincare",
    description: "Specialized container for face masks, clay treatments, and peel-off products. Wide design for easy scooping.",
    images: ["assets/images/mask-container-1.jpg", "assets/images/mask-container-2.jpg"],
    badge: "Specialized",
    features: ["150ml Capacity", "Wide Design", "Spatula Included", "Airtight Seal"],
    inStock: true
  },
  {
    id: 17,
    name: "Spray Bottle 100ml",
    category: "versatile-packaging",
    categoryDisplay: "Versatile Packaging",
    description: "Fine mist spray bottle for toners, setting sprays, and refreshing mists. Adjustable nozzle for different spray patterns.",
    images: ["assets/images/spray-bottle-1.jpg", "assets/images/spray-bottle-2.jpg"],
    badge: "Mist",
    features: ["100ml Capacity", "Fine Mist", "Adjustable Nozzle", "Travel Size"],
    inStock: true
  },
  {
    id: 18,
    name: "Nail Polish Bottle",
    category: "cream-containers",
    categoryDisplay: "Cream Containers",
    description: "Classic nail polish bottle with brush cap. Designed for nail salons and cosmetic brands producing nail care products.",
    images: ["assets/images/polish-bottle-1.jpg", "assets/images/polish-bottle-2.jpg"],
    badge: "Salon",
    features: ["15ml Capacity", "Brush Cap", "Classic Design", "Salon Grade"],
    inStock: true
  }
];

// Get unique categories
function getCategories() {
  const categories = {};
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = product.categoryDisplay;
    }
  });
  return categories;
}

// Get products by category
function getProductsByCategory(category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}

// Get product by ID
function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

// Search products
function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.categoryDisplay.toLowerCase().includes(lowerQuery)
  );
}

// Get paginated products
function getPaginatedProducts(page = 1, perPage = 12, category = 'all', searchQuery = '') {
  let filtered = searchQuery ? searchProducts(searchQuery) : getProductsByCategory(category);
  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const items = filtered.slice(start, end);
  
  return {
    items,
    total,
    totalPages,
    currentPage: page,
    perPage
  };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products, getCategories, getProductsByCategory, getProductById, searchProducts, getPaginatedProducts };
}
