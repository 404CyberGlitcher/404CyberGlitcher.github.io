// Admin Dashboard - Main controller
import { auth, signOut, isAdminEmail } from "./auth.js";
import { onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  PRODUCTS_CONFIG,
  REVIEWS_CONFIG,
  CONTACTS_CONFIG,
} from "../config/firebase.js";

// Initialize Firebase for different databases
const productsApp = initializeApp(PRODUCTS_CONFIG, "products");
const productsDb = getFirestore(productsApp);

const reviewsApp = initializeApp(REVIEWS_CONFIG, "reviews");
const reviewsDb = getFirestore(reviewsApp);

const contactsApp = initializeApp(CONTACTS_CONFIG, "contacts");
const contactsDb = getFirestore(contactsApp);

// State
let currentPage = "dashboard";
let stats = {
  products: 0,
  orders: 0,
  revenue: 0,
  reviews: 0,
};

// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (!user || !isAdminEmail(user.email)) {
      window.location.href = "/src/admin/login.html";
      return;
    }

    // Display admin email
    const adminEmailSpan = document.getElementById("adminEmail");
    if (adminEmailSpan) {
      adminEmailSpan.textContent = user.email;
    }

    // Initialize dashboard
    await loadDashboard();
    initNavigation();
    initLogout();
  });
});

// Load dashboard data
async function loadDashboard() {
  await loadStats();
  await loadRecentOrders();
}

// Load statistics
async function loadStats() {
  try {
    // Get total products
    const productsRef = collection(productsDb, "products");
    const productsSnap = await getDocs(productsRef);
    stats.products = productsSnap.size;

    // Get reviews count
    const reviewsRef = collection(reviewsDb, "reviews");
    const reviewsSnap = await getDocs(reviewsRef);
    stats.reviews = reviewsSnap.size;

    // Get contacts count
    const contactsRef = collection(contactsDb, "contacts");
    const contactsSnap = await getDocs(contactsRef);
    const unreadContacts = contactsSnap.docs.filter(
      (doc) => doc.data().status === "unread",
    ).length;

    // Update stats display
    updateStatsDisplay();

    // Store unread count for sidebar badge
    sessionStorage.setItem("unreadContacts", unreadContacts);
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

// Update stats display
function updateStatsDisplay() {
  const totalProductsEl = document.getElementById("totalProducts");
  const totalOrdersEl = document.getElementById("totalOrders");
  const totalRevenueEl = document.getElementById("totalRevenue");
  const totalReviewsEl = document.getElementById("totalReviews");

  if (totalProductsEl) totalProductsEl.textContent = stats.products;
  if (totalOrdersEl) totalOrdersEl.textContent = stats.orders;
  if (totalRevenueEl)
    totalRevenueEl.textContent = `Rs. ${stats.revenue.toLocaleString()}`;
  if (totalReviewsEl) totalReviewsEl.textContent = stats.reviews;
}

// Load recent orders (from localStorage for demo, would be from Firestore in production)
function loadRecentOrders() {
  const ordersTable = document.getElementById("recentOrdersTable");
  if (!ordersTable) return;

  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem("colormart_orders") || "[]");
  const recentOrders = orders.slice(0, 5);

  if (recentOrders.length === 0) {
    ordersTable.innerHTML = '<p class="no-data">No orders yet</p>';
    return;
  }

  ordersTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${recentOrders
                  .map(
                    (order) => `
                    <tr>
                        <td>${order.orderId}</td>
                        <td>${order.customerName}</td>
                        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>Rs. ${order.totalAmount.toLocaleString()}</td>
                        <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

// Initialize navigation between admin pages
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");

  navItems.forEach((item) => {
    item.addEventListener("click", async () => {
      const page = item.dataset.page;
      if (!page || page === "dashboard") {
        currentPage = "dashboard";
        await showDashboard();
      } else {
        currentPage = page;
        await loadPage(page);
      }

      // Update active state
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      // Update title
      if (pageTitle) {
        const titles = {
          dashboard: "Dashboard",
          products: "Products Management",
          orders: "Orders Management",
          reviews: "Reviews Management",
          contacts: "Contact Messages",
        };
        pageTitle.textContent = titles[page] || "Dashboard";
      }

      if (pageSubtitle) {
        const subtitles = {
          dashboard: "Welcome back, Admin",
          products: "Manage your product catalog",
          orders: "Track and manage customer orders",
          reviews: "Moderate customer reviews",
          contacts: "Respond to customer inquiries",
        };
        pageSubtitle.textContent = subtitles[page] || "Management Portal";
      }
    });
  });
}

// Show dashboard (hide other pages)
async function showDashboard() {
  const pages = ["productsPage", "ordersPage", "reviewsPage", "contactsPage"];
  pages.forEach((pageId) => {
    const page = document.getElementById(pageId);
    if (page) page.style.display = "none";
  });

  const dashboardPage = document.getElementById("dashboardPage");
  if (dashboardPage) dashboardPage.style.display = "block";

  // Refresh stats
  await loadStats();
  await loadRecentOrders();
}

// Load page content dynamically
async function loadPage(pageName) {
  // Hide all pages
  const dashboardPage = document.getElementById("dashboardPage");
  if (dashboardPage) dashboardPage.style.display = "none";

  const pages = ["productsPage", "ordersPage", "reviewsPage", "contactsPage"];
  pages.forEach((pageId) => {
    const page = document.getElementById(pageId);
    if (page) page.style.display = "none";
  });

  // Show selected page
  const selectedPage = document.getElementById(`${pageName}Page`);
  if (selectedPage) {
    selectedPage.style.display = "block";

    // Load page content if not already loaded
    if (selectedPage.innerHTML.trim() === "") {
      await fetchPageContent(pageName, selectedPage);
    }
  }
}

// Fetch page content from HTML files
async function fetchPageContent(pageName, container) {
  try {
    const response = await fetch(`/src/admin/${pageName}.html`);
    if (response.ok) {
      const html = await response.text();
      // Extract body content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;
      container.innerHTML = bodyContent;

      // Initialize page-specific scripts
      if (pageName === "products") {
        const { initProductsManagement } = await import("./products.js");
        if (typeof initProductsManagement === "function")
          initProductsManagement();
      } else if (pageName === "orders") {
        const { initOrdersManagement } = await import("./orders.js");
        // Load orders from localStorage
        const orders = JSON.parse(
          localStorage.getItem("colormart_orders") || "[]",
        );
        if (typeof initOrdersManagement === "function")
          initOrdersManagement(orders);
      } else if (pageName === "reviews") {
        const { initReviewsManagement } = await import("./reviews.js");
        if (typeof initReviewsManagement === "function")
          initReviewsManagement();
      } else if (pageName === "contacts") {
        const { initContactsManagement } = await import("./contacts.js");
        if (typeof initContactsManagement === "function")
          initContactsManagement();
      }
    } else {
      container.innerHTML = '<p class="error">Failed to load page content</p>';
    }
  } catch (error) {
    console.error(`Error loading ${pageName}:`, error);
    container.innerHTML = '<p class="error">Failed to load page content</p>';
  }
}

// Initialize logout
function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        sessionStorage.removeItem("adminLoggedIn");
        sessionStorage.removeItem("adminEmail");
        window.location.href = "/src/admin/login.html";
      } catch (error) {
        console.error("Logout error:", error);
      }
    });
  }
}
