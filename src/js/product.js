// Product detail page functionality
import { loadHeader } from "./components/header.js";
import { loadFooter } from "./components/footer.js";
import { initCart, addToCart, showToast } from "./components/cart.js";
import {
  updateMetaTags,
  addProductStructuredData,
  addBreadcrumbStructuredData,
} from "./utils/seo.js";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { PRODUCTS_CONFIG, REVIEWS_CONFIG } from "./config/firebase.js";

// Initialize Firebase apps
const productsApp = initializeApp(PRODUCTS_CONFIG, "products");
const productsDb = getFirestore(productsApp);

let reviewsApp, reviewsDb;
let currentProduct = null;
let currentReviews = [];

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
  loadHeader();
  loadFooter();
  initCart();

  AOS.init({ duration: 800, once: true });

  // Initialize reviews Firebase
  reviewsApp = initializeApp(REVIEWS_CONFIG, "reviews");
  reviewsDb = getFirestore(reviewsApp);

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    window.location.href = "/src/catalog.html";
    return;
  }

  await loadProduct(productId);
  await loadReviews(productId);
  await loadRelatedProducts();

  initEventListeners();
  initImageModal();
});

// Load product details
async function loadProduct(productId) {
  const galleryContainer = document.getElementById("productGallery");
  const infoContainer = document.getElementById("productInfo");
  const tabsContainer = document.getElementById("productTabs");

  try {
    const productRef = doc(productsDb, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      window.location.href = "/src/catalog.html";
      return;
    }

    currentProduct = { id: productSnap.id, ...productSnap.data() };

    // Render product gallery
    renderGallery(currentProduct);

    // Render product info
    renderProductInfo(currentProduct);

    // Show tabs
    if (tabsContainer) tabsContainer.style.display = "block";

    // Update SEO
    updateMetaTags({
      title: `${currentProduct.name} - ColorMart | Premium Beauty & Cosmetics`,
      description: currentProduct.description.substring(0, 160),
      image: currentProduct.images?.[0] || "",
    });

    addProductStructuredData(currentProduct);
    addBreadcrumbStructuredData([
      { name: "Home", url: "https://colormart.store/" },
      { name: "Catalog", url: "https://colormart.store/src/catalog.html" },
      { name: currentProduct.name, url: window.location.href },
    ]);
  } catch (error) {
    console.error("Error loading product:", error);
    if (galleryContainer)
      galleryContainer.innerHTML =
        '<p class="error">Failed to load product</p>';
    if (infoContainer)
      infoContainer.innerHTML = '<p class="error">Failed to load product</p>';
  }
}

// Render product gallery
function renderGallery(product) {
  const galleryContainer = document.getElementById("productGallery");
  if (!galleryContainer) return;

  const images = product.images || ["https://via.placeholder.com/600"];

  galleryContainer.innerHTML = `
        <img src="${images[0]}" alt="${product.name}" class="main-image" id="mainImage">
        <div class="thumbnail-grid" id="thumbnailGrid">
            ${images
              .map(
                (img, index) => `
                <img src="${img}" alt="${product.name} - image ${index + 1}" class="thumbnail ${index === 0 ? "active" : ""}" data-index="${index}">
            `,
              )
              .join("")}
        </div>
    `;

  // Thumbnail click handler
  const mainImage = document.getElementById("mainImage");
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document
        .querySelectorAll(".thumbnail")
        .forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      if (mainImage) mainImage.src = thumb.src;
    });
  });

  // Main image click for zoom
  if (mainImage) {
    mainImage.addEventListener("click", () => {
      const modal = document.getElementById("imageModal");
      const modalImg = document.getElementById("modalImage");
      if (modal && modalImg) {
        modalImg.src = mainImage.src;
        modal.style.display = "flex";
      }
    });
  }
}

// Render product info
function renderProductInfo(product) {
  const infoContainer = document.getElementById("productInfo");
  if (!infoContainer) return;

  const displayPrice = product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  infoContainer.innerHTML = `
        <div class="product-category">${product.category?.toUpperCase() || "BEAUTY"}</div>
        <h1 class="product-detail-title">${product.name}</h1>
        <div class="product-detail-price">
            <span class="product-detail-current-price">Rs. ${displayPrice.toLocaleString()}</span>
            ${originalPrice ? `<span class="product-detail-original-price">Rs. ${originalPrice.toLocaleString()}</span>` : ""}
            ${discount > 0 ? `<span class="product-detail-discount">-${discount}%</span>` : ""}
        </div>
        <div class="product-rating-section">
            <div class="stars">${renderStars(product.averageRating || 0)}</div>
            <span>${product.reviewCount || 0} reviews</span>
            <span>|</span>
            <span>${product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
        </div>
        <div class="product-description">
            <p>${product.description || "No description available."}</p>
        </div>
        <div class="product-meta">
            ${product.brand ? `<p><strong>Brand:</strong> ${product.brand}</p>` : ""}
            <p><strong>SKU:</strong> ${product.id}</p>
        </div>
        <div class="quantity-selector">
            <span class="quantity-label">Quantity:</span>
            <div class="quantity-controls">
                <button class="quantity-btn" id="decreaseQty">-</button>
                <input type="number" class="quantity-input" id="quantityInput" value="1" min="1" max="${product.stock || 999}">
                <button class="quantity-btn" id="increaseQty">+</button>
            </div>
        </div>
        <div class="product-actions">
            <button class="btn-primary" id="addToCartBtn">Add to Cart</button>
            <button class="btn-secondary" id="buyNowBtn">Buy It Now</button>
        </div>
        <div class="product-shipping-info">
            <p>🚚 Free shipping on orders over Rs. 2500</p>
            <p>🔄 30-day return policy</p>
        </div>
    `;

  // Quantity controls
  const decreaseBtn = document.getElementById("decreaseQty");
  const increaseBtn = document.getElementById("increaseQty");
  const quantityInput = document.getElementById("quantityInput");

  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      let val = parseInt(quantityInput.value) || 1;
      if (val > 1) {
        quantityInput.value = val - 1;
      }
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
      let val = parseInt(quantityInput.value) || 1;
      if (val < (product.stock || 999)) {
        quantityInput.value = val + 1;
      } else {
        showToast("Maximum stock reached", "error");
      }
    });
  }

  if (quantityInput) {
    quantityInput.addEventListener("change", () => {
      let val = parseInt(quantityInput.value) || 1;
      val = Math.max(1, Math.min(val, product.stock || 999));
      quantityInput.value = val;
    });
  }

  // Add to cart button
  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = parseInt(quantityInput.value) || 1;
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: displayPrice,
          image: product.images?.[0],
        },
        quantity,
      );
    });
  }

  // Buy now button
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      const quantity = parseInt(quantityInput.value) || 1;
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: displayPrice,
          image: product.images?.[0],
        },
        quantity,
      );
      window.location.href = "/src/checkout.html";
    });
  }
}

// Load product reviews
async function loadReviews(productId) {
  const reviewsSection = document.getElementById("reviewsSection");
  const reviewCountSpan = document.getElementById("reviewCount");

  if (!reviewsSection) return;

  try {
    const reviewsRef = collection(reviewsDb, "reviews");
    const q = query(
      reviewsRef,
      where("productId", "==", productId),
      where("status", "==", "approved"),
      limit(50),
    );
    const querySnapshot = await getDocs(q);

    currentReviews = [];
    querySnapshot.forEach((doc) => {
      currentReviews.push({ id: doc.id, ...doc.data() });
    });

    if (reviewCountSpan) reviewCountSpan.textContent = currentReviews.length;

    renderReviewsSection();
  } catch (error) {
    console.error("Error loading reviews:", error);
    reviewsSection.innerHTML = '<p class="error">Failed to load reviews</p>';
  }
}

// Render reviews section
function renderReviewsSection() {
  const reviewsSection = document.getElementById("reviewsSection");
  if (!reviewsSection) return;

  const averageRating = calculateAverageRating();
  const ratingDistribution = calculateRatingDistribution();

  reviewsSection.innerHTML = `
        <div class="reviews-summary">
            <div class="average-rating">
                <div class="big-rating">${averageRating.toFixed(1)}</div>
                <div class="stars">${renderStars(averageRating)}</div>
                <div>Based on ${currentReviews.length} reviews</div>
            </div>
            <div class="rating-bars">
                ${[5, 4, 3, 2, 1]
                  .map((rating) => {
                    const count = ratingDistribution[rating] || 0;
                    const percentage =
                      currentReviews.length > 0
                        ? (count / currentReviews.length) * 100
                        : 0;
                    return `
                        <div class="rating-bar-item">
                            <span class="rating-bar-label">${rating} ★</span>
                            <div class="rating-bar">
                                <div class="rating-bar-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span class="rating-bar-count">${count}</span>
                        </div>
                    `;
                  })
                  .join("")}
            </div>
        </div>
        <div class="write-review-btn">
            <button class="btn-secondary" id="writeReviewBtn">Write a Review</button>
        </div>
        <div class="review-form" id="reviewForm" style="display: none;">
            <h4>Write Your Review</h4>
            <div class="rating-input" id="ratingInput">
                ${[1, 2, 3, 4, 5]
                  .map(
                    (r) => `
                    <span class="rating-star" data-rating="${r}">☆</span>
                `,
                  )
                  .join("")}
            </div>
            <input type="text" id="reviewTitle" placeholder="Review Title">
            <textarea id="reviewComment" placeholder="Write your review here..." rows="4"></textarea>
            <input type="text" id="reviewerName" placeholder="Your Name">
            <button class="btn-primary" id="submitReviewBtn">Submit Review</button>
            <button class="btn-secondary" id="cancelReviewBtn">Cancel</button>
        </div>
        <div class="reviews-list" id="reviewsList">
            ${currentReviews
              .map(
                (review) => `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${review.userName}</span>
                        <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="review-stars">${renderStars(review.rating)}</div>
                    <div class="review-title">${review.title || ""}</div>
                    <div class="review-text">${review.comment}</div>
                </div>
            `,
              )
              .join("")}
            ${currentReviews.length === 0 ? '<p class="no-reviews">No reviews yet. Be the first to review this product!</p>' : ""}
        </div>
    `;

  // Initialize review form
  initReviewForm();
}

// Calculate average rating
function calculateAverageRating() {
  if (currentReviews.length === 0) return 0;
  const sum = currentReviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / currentReviews.length;
}

// Calculate rating distribution
function calculateRatingDistribution() {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  currentReviews.forEach((review) => {
    distribution[review.rating] = (distribution[review.rating] || 0) + 1;
  });
  return distribution;
}

// Initialize review form
function initReviewForm() {
  const writeReviewBtn = document.getElementById("writeReviewBtn");
  const reviewForm = document.getElementById("reviewForm");
  const cancelReviewBtn = document.getElementById("cancelReviewBtn");
  const submitReviewBtn = document.getElementById("submitReviewBtn");
  const ratingStars = document.querySelectorAll(".rating-star");
  let selectedRating = 0;

  if (writeReviewBtn) {
    writeReviewBtn.addEventListener("click", () => {
      if (reviewForm) reviewForm.style.display = "block";
    });
  }

  if (cancelReviewBtn) {
    cancelReviewBtn.addEventListener("click", () => {
      if (reviewForm) reviewForm.style.display = "none";
    });
  }

  // Rating star interaction
  ratingStars.forEach((star) => {
    star.addEventListener("mouseenter", () => {
      const rating = parseInt(star.dataset.rating);
      ratingStars.forEach((s, i) => {
        if (i < rating) {
          s.textContent = "★";
          s.style.color = "#ffc107";
        } else {
          s.textContent = "☆";
          s.style.color = "var(--color-gray-300)";
        }
      });
    });

    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.rating);
    });
  });

  // Submit review
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", async () => {
      const title = document.getElementById("reviewTitle")?.value || "";
      const comment = document.getElementById("reviewComment")?.value;
      const userName = document.getElementById("reviewerName")?.value;

      if (!selectedRating || selectedRating === 0) {
        showToast("Please select a rating", "error");
        return;
      }

      if (!comment) {
        showToast("Please write a review", "error");
        return;
      }

      if (!userName) {
        showToast("Please enter your name", "error");
        return;
      }

      // Save review to Firebase
      const {
        addDoc,
        collection: addCollection,
        serverTimestamp,
      } = await import("firebase/firestore");

      try {
        const reviewData = {
          productId: currentProduct.id,
          productName: currentProduct.name,
          rating: selectedRating,
          title: title,
          comment: comment,
          userName: userName,
          status: "pending",
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(reviewsDb, "reviews"), reviewData);
        showToast("Thank you for your review! It will appear after approval.");

        // Reset form
        if (reviewForm) reviewForm.style.display = "none";
        document.getElementById("reviewTitle").value = "";
        document.getElementById("reviewComment").value = "";
        document.getElementById("reviewerName").value = "";

        // Reset stars
        ratingStars.forEach((star) => {
          star.textContent = "☆";
          star.style.color = "var(--color-gray-300)";
        });
        selectedRating = 0;
      } catch (error) {
        console.error("Error submitting review:", error);
        showToast("Failed to submit review. Please try again.", "error");
      }
    });
  }
}

// Load related products
async function loadRelatedProducts() {
  const container = document.getElementById("relatedProductsGrid");
  const section = document.getElementById("relatedProducts");

  if (!container || !currentProduct) return;

  try {
    const productsRef = collection(productsDb, "products");
    const q = query(
      productsRef,
      where("category", "==", currentProduct.category),
      limit(4),
    );
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== currentProduct.id) {
        products.push({ id: doc.id, ...doc.data() });
      }
    });

    if (products.length > 0) {
      if (section) section.style.display = "block";
      renderRelatedProducts(container, products);
    }
  } catch (error) {
    console.error("Error loading related products:", error);
  }
}

// Render related products
function renderRelatedProducts(container, products) {
  container.innerHTML = products
    .map((product) => {
      const displayPrice = product.salePrice || product.price;
      const discount = product.salePrice
        ? Math.round(
            ((product.price - product.salePrice) / product.price) * 100,
          )
        : 0;

      return `
            <div class="product-card" data-product-id="${product.id}">
                ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ""}
                <div class="product-image">
                    <img src="${product.images?.[0] || "https://via.placeholder.com/300"}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">Rs. ${displayPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  container.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
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

// Initialize event listeners
function initEventListeners() {
  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));
      btn.classList.add("active");
      const activePane = document.getElementById(`${tabId}Tab`);
      if (activePane) activePane.classList.add("active");
    });
  });
}

// Initialize image modal
function initImageModal() {
  const modal = document.getElementById("imageModal");
  const closeBtn = document.querySelector(".close-modal");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.backgroundColor = type === "success" ? "#22c55e" : "#ef4444";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
