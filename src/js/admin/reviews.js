// Admin Reviews Management
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { REVIEWS_CONFIG } from "../config/firebase.js";
import { showToast } from "../components/cart.js";

// Initialize Firebase
const reviewsApp = initializeApp(REVIEWS_CONFIG, "reviews");
const reviewsDb = getFirestore(reviewsApp);

// State
let allReviews = [];

// Initialize reviews management
export async function initReviewsManagement() {
  await loadReviews();
  initEventListeners();
}

// Load reviews from Firebase
async function loadReviews() {
  const reviewsGrid = document.getElementById("reviewsGrid");
  if (!reviewsGrid) return;

  try {
    const reviewsRef = collection(reviewsDb, "reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    allReviews = [];
    querySnapshot.forEach((doc) => {
      allReviews.push({ id: doc.id, ...doc.data() });
    });

    renderReviews();
    updateStats();
  } catch (error) {
    console.error("Error loading reviews:", error);
    reviewsGrid.innerHTML = '<p class="error">Failed to load reviews</p>';
  }
}

// Update statistics
function updateStats() {
  const statsContainer = document.getElementById("reviewsStats");
  if (!statsContainer) return;

  const pending = allReviews.filter((r) => r.status === "pending").length;
  const approved = allReviews.filter((r) => r.status === "approved").length;
  const rejected = allReviews.filter((r) => r.status === "rejected").length;
  const avgRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          allReviews.length
        ).toFixed(1)
      : 0;

  statsContainer.innerHTML = `
        <div class="average-rating-card">
            <div>Average Rating</div>
            <div class="big-rating">${avgRating} ★</div>
            <div>Based on ${allReviews.length} reviews</div>
        </div>
        <div class="stat-badge"><strong>Pending:</strong> ${pending}</div>
        <div class="stat-badge"><strong>Approved:</strong> ${approved}</div>
        <div class="stat-badge"><strong>Rejected:</strong> ${rejected}</div>
    `;
}

// Render reviews grid
function renderReviews() {
  const reviewsGrid = document.getElementById("reviewsGrid");
  if (!reviewsGrid) return;

  if (allReviews.length === 0) {
    reviewsGrid.innerHTML = '<p class="no-reviews">No reviews found</p>';
    return;
  }

  reviewsGrid.innerHTML = allReviews
    .map(
      (review) => `
        <div class="review-card" data-review-id="${review.id}">
            <div class="review-header">
                <div class="review-product-info">
                    <div class="review-product-name">${review.productName || "Product"}</div>
                </div>
                <div class="review-status status-${review.status || "pending"}">${review.status || "pending"}</div>
            </div>
            <div class="review-rating">${renderStars(review.rating || 0)}</div>
            <div class="review-title">${review.title || "No title"}</div>
            <div class="review-text">${review.comment || ""}</div>
            <div class="review-meta">
                <span>By: ${review.userName || "Anonymous"}</span>
                <span>${review.createdAt ? new Date(review.createdAt.toDate()).toLocaleDateString() : "Unknown date"}</span>
            </div>
            <div class="review-actions">
                ${review.status !== "approved" ? `<button class="approve-btn" data-id="${review.id}">Approve</button>` : ""}
                ${review.status !== "rejected" ? `<button class="reject-btn" data-id="${review.id}">Reject</button>` : ""}
                <button class="delete-review-btn" data-id="${review.id}">Delete</button>
            </div>
        </div>
    `,
    )
    .join("");

  // Add event listeners
  document.querySelectorAll(".approve-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      updateReviewStatus(btn.dataset.id, "approved"),
    );
  });

  document.querySelectorAll(".reject-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      updateReviewStatus(btn.dataset.id, "rejected"),
    );
  });

  document.querySelectorAll(".delete-review-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteReview(btn.dataset.id));
  });
}

// Update review status
async function updateReviewStatus(reviewId, status) {
  try {
    const reviewRef = doc(reviewsDb, "reviews", reviewId);
    await updateDoc(reviewRef, { status: status });
    showToast(`Review ${status} successfully`);
    await loadReviews();
  } catch (error) {
    console.error("Error updating review:", error);
    showToast("Failed to update review", "error");
  }
}

// Delete review
async function deleteReview(reviewId) {
  if (
    !confirm(
      "Are you sure you want to delete this review? This action cannot be undone.",
    )
  )
    return;

  try {
    await deleteDoc(doc(reviewsDb, "reviews", reviewId));
    showToast("Review deleted successfully");
    await loadReviews();
  } catch (error) {
    console.error("Error deleting review:", error);
    showToast("Failed to delete review", "error");
  }
}

// Render stars
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

// Initialize event listeners for filters
function initEventListeners() {
  // Rating filter
  const ratingFilter = document.getElementById("filterRating");
  if (ratingFilter) {
    ratingFilter.addEventListener("change", (e) => {
      const rating = parseInt(e.target.value);
      if (rating === "all") {
        renderReviews();
      } else {
        const filtered = allReviews.filter(
          (r) => Math.floor(r.rating || 0) === rating,
        );
        const reviewsGrid = document.getElementById("reviewsGrid");
        if (reviewsGrid) {
          if (filtered.length === 0) {
            reviewsGrid.innerHTML =
              '<p class="no-reviews">No reviews found</p>';
          } else {
            renderFilteredReviews(filtered);
          }
        }
      }
    });
  }

  // Sort filter
  const sortFilter = document.getElementById("sortReviews");
  if (sortFilter) {
    sortFilter.addEventListener("change", (e) => {
      const sortBy = e.target.value;
      let sorted = [...allReviews];

      switch (sortBy) {
        case "newest":
          sorted.sort(
            (a, b) =>
              new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate()),
          );
          break;
        case "oldest":
          sorted.sort(
            (a, b) =>
              new Date(a.createdAt?.toDate()) - new Date(b.createdAt?.toDate()),
          );
          break;
        case "highest":
          sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "lowest":
          sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
          break;
      }

      renderFilteredReviews(sorted);
    });
  }

  // Status filter
  const statusFilter = document.getElementById("filterReviewStatus");
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      const status = e.target.value;
      if (status === "all") {
        renderReviews();
      } else {
        const filtered = allReviews.filter((r) => r.status === status);
        renderFilteredReviews(filtered);
      }
    });
  }
}

// Render filtered reviews
function renderFilteredReviews(reviews) {
  const reviewsGrid = document.getElementById("reviewsGrid");
  if (!reviewsGrid) return;

  if (reviews.length === 0) {
    reviewsGrid.innerHTML = '<p class="no-reviews">No reviews found</p>';
    return;
  }

  reviewsGrid.innerHTML = reviews
    .map(
      (review) => `
        <div class="review-card" data-review-id="${review.id}">
            <div class="review-header">
                <div class="review-product-info">
                    <div class="review-product-name">${review.productName || "Product"}</div>
                </div>
                <div class="review-status status-${review.status || "pending"}">${review.status || "pending"}</div>
            </div>
            <div class="review-rating">${renderStars(review.rating || 0)}</div>
            <div class="review-title">${review.title || "No title"}</div>
            <div class="review-text">${review.comment || ""}</div>
            <div class="review-meta">
                <span>By: ${review.userName || "Anonymous"}</span>
                <span>${review.createdAt ? new Date(review.createdAt.toDate()).toLocaleDateString() : "Unknown date"}</span>
            </div>
            <div class="review-actions">
                ${review.status !== "approved" ? `<button class="approve-btn" data-id="${review.id}">Approve</button>` : ""}
                ${review.status !== "rejected" ? `<button class="reject-btn" data-id="${review.id}">Reject</button>` : ""}
                <button class="delete-review-btn" data-id="${review.id}">Delete</button>
            </div>
        </div>
    `,
    )
    .join("");

  // Reattach event listeners
  document.querySelectorAll(".approve-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      updateReviewStatus(btn.dataset.id, "approved"),
    );
  });
  document.querySelectorAll(".reject-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      updateReviewStatus(btn.dataset.id, "rejected"),
    );
  });
  document.querySelectorAll(".delete-review-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteReview(btn.dataset.id));
  });
}
