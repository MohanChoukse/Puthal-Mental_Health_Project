import { auth, onAuthStateChanged } from "./firebase.js";

const welcomeMessage = document.getElementById("welcomeMessage");

// Array of motivational quotes
const motivationalQuotes = [
  "Today is a new day to take care of your mental health.",
  "Every small step leads to better mental wellbeing.",
  "You are stronger than you think.",
  "What you do today can change your tomorrow.",
  "Believe in yourself, you're doing amazing work.",
];

// Get random quote from array
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}

// Update welcome message with user info and motivational quote
function updateWelcomeMessage(user) {
  if (!welcomeMessage) return;

  if (user) {
    const displayName =
      user.displayName ||
      localStorage.getItem("userName") ||
      user.email.split("@")[0];
    const quote = getRandomQuote();

    welcomeMessage.innerHTML = `
      <h2>Welcome, ${displayName}!</h2>
      <p class="quote">${quote}</p>
    `;
    welcomeMessage.style.display = "block";
  } else {
    welcomeMessage.style.display = "none";
  }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  updateWelcomeMessage(user);
});

// Coming Soon Modal Logic
const comingSoonModal = document.getElementById("comingSoonModal");
const closeButton = comingSoonModal.querySelector(".close-button");
const dashboardBtns = document.querySelectorAll(".dashboard-btn");

dashboardBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    comingSoonModal.style.display = "flex"; // Show the modal
  });
});

closeButton.addEventListener("click", () => {
  comingSoonModal.style.display = "none"; // Hide the modal
});

// Close modal if user clicks outside of it
window.addEventListener("click", (e) => {
  if (e.target === comingSoonModal) {
    comingSoonModal.style.display = "none";
  }
});
