// Contact page functionality
import { loadHeader } from "./components/header.js";
import { loadFooter } from "./components/footer.js";
import { initCart } from "./components/cart.js";
import { updateMetaTags } from "./utils/seo.js";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { CONTACTS_CONFIG } from "./config/firebase.js";
import {
  sendContactAutoReply,
  sendContactStaffNotification,
} from "./utils/emailjs.js";

// Initialize Firebase
const contactsApp = initializeApp(CONTACTS_CONFIG, "contacts");
const contactsDb = getFirestore(contactsApp);

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();
  initCart();

  updateMetaTags({
    title: "Contact Us - ColorMart | Get in Touch with Our Beauty Experts",
    description:
      "Have questions about our products or need assistance? Contact ColorMart customer support. We're here to help you with makeup, skincare, and beauty product inquiries.",
  });

  AOS.init({ duration: 800, once: true });

  initContactForm();
  initFAQ();
});

// Initialize contact form
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Get form data
    const formData = {
      name: document.getElementById("name")?.value,
      email: document.getElementById("email")?.value,
      phone: document.getElementById("phone")?.value,
      subject: document.getElementById("subject")?.value,
      message: document.getElementById("message")?.value,
      createdAt: serverTimestamp(),
      status: "unread",
      ip: await getClientIP(),
    };

    // Validate
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      showMessage("Please fill in all required fields", "error");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    if (!isValidEmail(formData.email)) {
      showMessage("Please enter a valid email address", "error");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      // Save to Firebase
      await addDoc(collection(contactsDb, "contacts"), formData);

      // Send auto-reply to customer
      await sendContactAutoReply({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      // Send notification to staff
      await sendContactStaffNotification({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      // Show success message
      showMessage(
        "Thank you for your message! We'll get back to you within 24 hours.",
        "success",
      );
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      showMessage(
        "Failed to send message. Please try again or email us directly.",
        "error",
      );
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Initialize FAQ accordion
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector("h3");
    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close all items
        faqItems.forEach((faq) => faq.classList.remove("active"));

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });
}

// Show message to user
function showMessage(message, type = "success") {
  const container = document.querySelector(".contact-form-container");
  if (!container) return;

  // Remove existing message
  const existingMessage = container.querySelector(
    ".success-message, .error-message",
  );
  if (existingMessage) existingMessage.remove();

  const messageDiv = document.createElement("div");
  messageDiv.className =
    type === "success" ? "success-message" : "error-message";
  messageDiv.textContent = message;

  container.insertBefore(messageDiv, container.firstChild);

  // Auto remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get client IP (for analytics)
async function getClientIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error getting IP:", error);
    return null;
  }
}
