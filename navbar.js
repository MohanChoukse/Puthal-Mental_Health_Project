import { auth, onAuthStateChanged, signOut } from "./firebase.js";

const authButtons = document.querySelector(".auth-buttons");
const navMenu = document.querySelector(".nav-menu");
const navRight = document.querySelector(".nav-right");

function createUserInfo(user) {
  const userInfo = document.createElement("div");
  userInfo.className = "user-info";

  // Get user display name or email
  const displayName =
    user.displayName ||
    localStorage.getItem("userName") ||
    user.email.split("@")[0];
  const firstLetter = displayName.charAt(0).toUpperCase();

  // Get time of day for personalized greeting
  const greeting = getTimeBasedGreeting();

  userInfo.innerHTML = `
    <div class="user-avatar">${firstLetter}</div>
    <span class="welcome-text">${greeting}, <br> <strong>${displayName}</strong></span>
    <button class="logout-nav-btn" onclick="handleLogout()">Logout</button>
  `;
  return userInfo;
}

// Get greeting based on time of day
function getTimeBasedGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 17) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

window.handleLogout = async () => {
  try {
    await signOut(auth);
    showLogoutToast();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Show logout success toast
function showLogoutToast() {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = "toast success";
  toast.textContent = "You have been successfully logged out.";

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

function updateNavbar(user) {
  if (user) {
    const userInfo = createUserInfo(user);
    authButtons.style.display = "none";
    navRight.appendChild(userInfo);

    // Add Dashboard link
    const dashboardLink = document.createElement("li");
    dashboardLink.innerHTML = `<a href="dashboard.html">Dashboard</a>`;
    dashboardLink.id = "dashboard-nav-link"; // Add an ID for easy removal
    navMenu.appendChild(dashboardLink);
  } else {
    const userInfo = document.querySelector(".user-info");
    if (userInfo) {
      userInfo.remove();
    }
    // Remove Dashboard link if it exists
    const dashboardLink = document.getElementById("dashboard-nav-link");
    if (dashboardLink) {
      dashboardLink.remove();
    }
    authButtons.style.display = "flex";
  }
}

onAuthStateChanged(auth, (user) => {
  updateNavbar(user);
});

// Search Modal functionality
const searchModal = document.getElementById("searchModal");
const searchBtn = document.querySelector(".search-btn");
const searchCloseBtn = searchModal.querySelector(".close-button");
const searchInput = document.getElementById("searchInput");
const searchButton = searchModal.querySelector("#searchButton");
const searchResults = document.getElementById("searchResults");
const hamburger = document.querySelector(".hamburger");
const navOverlay = document.querySelector(".nav-overlay");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  navOverlay.classList.toggle("active");
});

navOverlay.addEventListener("click", () => {
  navMenu.classList.remove("active");
  navOverlay.classList.remove("active");
});

// Open search modal and focus input
searchBtn.addEventListener("click", () => {
  searchModal.style.display = "block";
  searchInput.focus();
});

// Close modal functions
function closeSearchModal() {
  searchModal.style.display = "none";
  searchInput.value = "";
  searchResults.innerHTML = "";
}

searchCloseBtn.addEventListener("click", closeSearchModal);

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === searchModal) {
    closeSearchModal();
  }

  // Close navbar when clicking outside on mobile
  const isMobile = window.innerWidth <= 768;
  if (
    isMobile &&
    !navMenu.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    navMenu.classList.remove("active");
  }
});

// Handle search input
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

searchButton.addEventListener("click", performSearch);

// Mock search function - replace with actual search implementation
function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  // Mock search results
  const mockResults = [
    "Mood Analytics Dashboard",
    "Daily Meditation Sessions",
    "Journal Writing Tips",
    "Wellness Goals Setting",
    "Community Support Groups",
  ];

  searchResults.innerHTML = mockResults
    .filter((result) => result.toLowerCase().includes(query.toLowerCase()))
    .map((result) => `<li>${result}</li>`)
    .join("");

  if (!searchResults.innerHTML) {
    searchResults.innerHTML = "<li>No results found</li>";
  }
}
