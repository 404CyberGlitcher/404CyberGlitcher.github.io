// Main JavaScript - Anas Plastic Enterprises
// Complete Working Version with Configuration Loader

document.addEventListener("DOMContentLoaded", async function () {
  // Load configuration first
  await window.config.load();

  // Initialize AOS Animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 50,
    });
  }

  // Apply theme colors from config
  applyThemeColors();

  initializeNavigation();
  updateCartCount();
  setupSmoothScroll();
  setupActiveNavLink();
  updateFooterInfo();
  updateContactLinks();

  // Initialize galaxy buttons on all pages
  setTimeout(() => {
    if (typeof initializeAllGalaxyButtons === "function") {
      initializeAllGalaxyButtons();
    }
  }, 500);
});

// Apply theme colors from configuration
function applyThemeColors() {
  if (!window.config.isLoaded()) return;

  const theme = window.config.get("theme");
  if (!theme) return;

  const root = document.documentElement;

  if (theme.primaryColor) {
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty(
      "--primary-dark",
      adjustColor(theme.primaryColor, -20),
    );
    root.style.setProperty(
      "--primary-light",
      adjustColor(theme.primaryColor, 20),
    );
  }

  if (theme.secondaryColor) {
    root.style.setProperty("--secondary-color", theme.secondaryColor);
    root.style.setProperty(
      "--secondary-dark",
      adjustColor(theme.secondaryColor, -20),
    );
    root.style.setProperty(
      "--secondary-light",
      adjustColor(theme.secondaryColor, 20),
    );
  }

  if (theme.backgroundColor) {
    root.style.setProperty("--background", theme.backgroundColor);
  }
}

// Helper function to adjust color brightness
function adjustColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}

// Update footer with business info from config
function updateFooterInfo() {
  if (!window.config.isLoaded()) return;

  const business = window.config.get("business");
  const developer = window.config.get("developer");

  if (!business || !developer) return;

  // Update footer business name
  document.querySelectorAll(".footer-section h3").forEach((el) => {
    if (
      el.textContent.includes("Anas Plastic") ||
      el.textContent.includes("Enterprises")
    ) {
      el.textContent = business.name || "Anas Plastic Enterprises";
    }
  });

  // Update developer credit
  document.querySelectorAll(".developer-credit a").forEach((link) => {
    link.textContent = developer.name || "Asia X Network (SMC-PVT) LTD";
    link.href = developer.url || "https://asiaxnetwork.vercel.app";
  });

  // Update business email in footer
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    if (link.closest(".footer")) {
      link.href = `mailto:${business.email || ""}`;
      if (link.textContent.includes("@")) {
        link.textContent = business.email || "";
      }
    }
  });

  // Update Facebook URL
  document.querySelectorAll('a[href*="facebook.com"]').forEach((link) => {
    if (link.closest(".footer") || link.closest(".contact-info")) {
      link.href = business.facebookUrl || "#";
    }
  });
}

// Update contact links from config
function updateContactLinks() {
  if (!window.config.isLoaded()) return;

  const whatsapp = window.config.get("whatsapp");
  const business = window.config.get("business");

  if (!whatsapp || !business) return;

  // Update WhatsApp links
  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    const number = whatsapp.number || "";
    link.href = `https://wa.me/${number}`;
  });

  // Update phone links
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    if (
      link.href.includes("923000841330") ||
      link.href.includes("3000841330")
    ) {
      link.href = `tel:${whatsapp.number || ""}`;
      if (
        link.textContent.trim().startsWith("+") ||
        link.textContent.trim().match(/^\d/)
      ) {
        link.textContent = whatsapp.formattedNumber || "";
      }
    }
  });
}

// Navigation Functionality
function initializeNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active")
        ? "hidden"
        : "";
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
}

// Set active nav link based on current page
function setupActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      currentPath.includes(href.replace(".html", "")) &&
      href !== "index.html"
    ) {
      link.classList.add("active");
    } else if (
      href === "index.html" &&
      (currentPath === "/" || currentPath.endsWith("index.html"))
    ) {
      link.classList.add("active");
    }
  });
}

// Update Cart Count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("anasPlasticCart")) || [];
  const cartCountElements = document.querySelectorAll(".cart-count");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  cartCountElements.forEach((element) => {
    if (element) {
      element.textContent = totalItems;
      element.style.display = totalItems > 0 ? "flex" : "none";
    }
  });
}

// Smooth Scroll
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight =
          document.querySelector(".header")?.offsetHeight || 80;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Handle window resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768) {
      const hamburger = document.getElementById("hamburger");
      const navMenu = document.getElementById("navMenu");
      if (hamburger && navMenu) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  }, 250);
});

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Export for global use
window.updateCartCount = updateCartCount;
window.formatCurrency = formatCurrency;
