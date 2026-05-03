// Main entry point for homepage
import { loadHeader } from "./components/header.js";
import { loadFooter } from "./components/footer.js";
import { initCart, addToCart, showToast } from "./components/cart.js";
import { updateMetaTags, addOrganizationStructuredData } from "./utils/seo.js";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { PRODUCTS_CONFIG } from "./config/firebase.js";

// Initialize AOS
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
});

// Initialize Firebase for products
const productsApp = initializeApp(PRODUCTS_CONFIG, "products");
const productsDb = getFirestore(productsApp);

// Load components
loadHeader();
loadFooter();
initCart();

// Update SEO
updateMetaTags({
  title: "ColorMart - Premium Beauty & Cosmetics | Makeup, Hair Care & More",
  description:
    "Shop authentic makeup, cosmetics, and beauty products at ColorMart. Free shipping on orders over Rs.2500. Best prices in Pakistan.",
});
addOrganizationStructuredData();

// Hero Slider
function initHeroSlider() {
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".slider-dots");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let currentSlide = 0;
  let slideInterval;

  if (!slides.length) return;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[currentSlide].classList.remove("active");
    document.querySelectorAll(".dot")[currentSlide].classList.remove("active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    document.querySelectorAll(".dot")[currentSlide].classList.add("active");
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(slideInterval);
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevSlide();
      stopAutoSlide();
      startAutoSlide();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextSlide();
      stopAutoSlide();
      startAutoSlide();
    });

  startAutoSlide();
}

// Load New Arrivals
async function loadNewArrivals() {
  const container = document.getElementById("new-arrivals-grid");
  if (!container) return;

  try {
    const productsRef = collection(productsDb, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"), limit(4));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = '<p class="no-products">No products found</p>';
      return;
    }

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    renderProducts(container, products);
  } catch (error) {
    console.error("Error loading new arrivals:", error);
    container.innerHTML = '<p class="error">Failed to load products</p>';
  }
}

// Load Best Sellers
async function loadBestSellers() {
  const container = document.getElementById("best-sellers-grid");
  if (!container) return;

  try {
    const productsRef = collection(productsDb, "products");
    const q = query(productsRef, orderBy("salesCount", "desc"), limit(4));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = '<p class="no-products">No products found</p>';
      return;
    }

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    renderProducts(container, products);
  } catch (error) {
    console.error("Error loading best sellers:", error);
    container.innerHTML = '<p class="error">Failed to load products</p>';
  }
}

// Render products in grid
function renderProducts(container, products) {
  container.innerHTML = products
    .map((product) => {
      const discount = product.salePrice
        ? Math.round(
            ((product.price - product.salePrice) / product.price) * 100,
          )
        : 0;
      const displayPrice = product.salePrice || product.price;
      const originalPrice = product.salePrice ? product.price : null;

      return `
            <div class="product-card" data-product-id="${product.id}">
                ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ""}
                <div class="product-image">
                    <img src="${product.images?.[0] || "https://via.placeholder.com/300"}" alt="${product.name}" loading="lazy">
                    <div class="quick-add" data-id="${product.id}" data-name="${product.name}" data-price="${displayPrice}" data-image="${product.images?.[0]}">Quick Add</div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">Rs. ${displayPrice.toLocaleString()}</span>
                        ${originalPrice ? `<span class="original-price">Rs. ${originalPrice.toLocaleString()}</span>` : ""}
                    </div>
                    <div class="product-rating">
                        <div class="stars">${renderStars(product.averageRating || 0)}</div>
                        <span>(${product.reviewCount || 0})</span>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  // Add event listeners for quick add
  document.querySelectorAll(".quick-add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
      };
      addToCart(product, 1);
    });
  });

  // Add click event for product detail navigation
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("quick-add")) return;
      const productId = card.dataset.productId;
      window.location.href = `/src/product.html?id=${productId}`;
    });
  });
}

// Render star rating
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let stars = "";
  for (let i = 0; i < fullStars; i++) stars += "★";
  if (halfStar) stars += "½";
  for (let i = 0; i < emptyStars; i++) stars += "☆";

  return stars;
}

// Load testimonials from reviews database
async function loadTestimonials() {
  const container = document.getElementById("testimonials-grid");
  if (!container) return;

  try {
    // Import reviews Firebase dynamically
    const { initializeApp: initReviewsApp } = await import("firebase/app");
    const {
      getFirestore: getReviewsDb,
      collection: getReviewsCollection,
      query: getReviewsQuery,
      where: whereReview,
      orderBy: orderByReview,
      limit: limitReviews,
      getDocs: getReviewDocs,
    } = await import("firebase/firestore");
    const { REVIEWS_CONFIG } = await import("./config/firebase.js");

    const reviewsApp = initReviewsApp(REVIEWS_CONFIG, "reviews");
    const reviewsDb = getReviewsDb(reviewsApp);
    const reviewsRef = getReviewsCollection(reviewsDb, "reviews");
    const q = getReviewsQuery(
      reviewsRef,
      whereReview("status", "==", "approved"),
      orderByReview("createdAt", "desc"),
      limitReviews(3),
    );
    const querySnapshot = await getReviewDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = '<p class="no-reviews">No reviews yet</p>';
      return;
    }

    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    container.innerHTML = reviews
      .map(
        (review) => `
            <div class="testimonial-card">
                <div class="testimonial-stars">${renderStars(review.rating)}</div>
                <p class="testimonial-text">"${review.comment.substring(0, 150)}${review.comment.length > 150 ? "..." : ""}"</p>
                <p class="testimonial-author">${review.userName}</p>
                <p class="testimonial-product">${review.productName}</p>
            </div>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading testimonials:", error);
    container.innerHTML = '<p class="error">Failed to load reviews</p>';
  }
}

// Category card click handlers
function initCategoryCards() {
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const href = card.getAttribute("href");
      if (href) {
        window.location.href = href;
      }
    });
  });
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initHeroSlider();
  loadNewArrivals();
  loadBestSellers();
  loadTestimonials();
  initCategoryCards();
});
