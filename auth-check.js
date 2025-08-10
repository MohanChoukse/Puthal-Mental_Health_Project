import { auth, onAuthStateChanged } from "./firebase.js";

// Protected pages that require authentication
const protectedPages = [
  "/dashboard.html",
  "/journal.html",
  "/mood-tracker.html",
];

// Check if current page is protected
function isProtectedPage() {
  const currentPath = window.location.pathname;
  return protectedPages.some((page) => currentPath.endsWith(page));
}

// Redirect to login if not authenticated on protected pages
function checkAuth() {
  if (isProtectedPage()) {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not logged in, redirect to login page
        console.log("User not authenticated, redirecting to login");
        showAuthToast();
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        console.log("User is authenticated, access granted");
      }
    });
  }
}

// Show authentication required toast
function showAuthToast() {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = "toast warning";
  toast.textContent =
    "Login required to view this page. Redirecting to login page.";

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// Run auth check when the page loads
document.addEventListener("DOMContentLoaded", checkAuth);
