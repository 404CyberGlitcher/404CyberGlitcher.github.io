// Admin authentication using Firebase Main database
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { MAIN_CONFIG } from "../config/firebase.js";

// Initialize Firebase Main app for authentication
const mainApp = initializeApp(MAIN_CONFIG, "main");
const auth = getAuth(mainApp);

// Admin emails from environment (will be checked)
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim());

// Check if user is admin
function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(email);
}

// Login handler
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  // Check if already logged in
  onAuthStateChanged(auth, (user) => {
    if (user && isAdminEmail(user.email)) {
      // Already logged in, redirect to dashboard
      window.location.href = "/src/admin/dashboard.html";
    }
  });

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      // Validate email format
      if (!email.includes("@")) {
        showError("Please enter a valid email address with @ symbol");
        return;
      }

      // Check if email is in admin list
      if (!isAdminEmail(email)) {
        showError("Unauthorized access. Admin credentials required.");
        return;
      }

      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Logging in...";
      submitBtn.disabled = true;

      try {
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        if (user && isAdminEmail(user.email)) {
          // Store admin session
          sessionStorage.setItem("adminLoggedIn", "true");
          sessionStorage.setItem("adminEmail", user.email);

          // Redirect to dashboard
          window.location.href = "/src/admin/dashboard.html";
        } else {
          await signOut(auth);
          showError("Unauthorized access");
        }
      } catch (error) {
        console.error("Login error:", error);
        let errorMsg = "Login failed. ";

        switch (error.code) {
          case "auth/user-not-found":
            errorMsg += "User not found.";
            break;
          case "auth/wrong-password":
            errorMsg += "Incorrect password.";
            break;
          case "auth/invalid-email":
            errorMsg += "Invalid email format.";
            break;
          case "auth/too-many-requests":
            errorMsg += "Too many failed attempts. Try again later.";
            break;
          default:
            errorMsg += "Please check your credentials.";
        }

        showError(errorMsg);
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

// Show error message
function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    // Auto hide after 5 seconds
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000);
  }
}

// Export auth for use in other admin pages
export { auth, isAdminEmail, signOut };
