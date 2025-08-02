import { auth, onAuthStateChanged, signOut } from "./firebase.js";

const authButtons = document.querySelector(".auth-buttons");
const navMenu = document.querySelector(".nav-menu");
const navRight = document.querySelector(".nav-right");

function createUserInfo(user) {
  const userInfo = document.createElement("div");
  userInfo.className = "user-info";

  const displayName = user.displayName || user.email;
  const firstLetter = displayName.charAt(0).toUpperCase();

  userInfo.innerHTML = `
    <div class="user-avatar">${firstLetter}</div>
    <span class="welcome-text"><strong>${displayName}</strong></span>
    <button class="logout-nav-btn" onclick="handleLogout()">Logout</button>
  `;
  return userInfo;
}

window.handleLogout = async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
};

function updateNavbar(user) {
  if (user) {
    const userInfo = createUserInfo(user);
    authButtons.style.display = "none";
    navRight.appendChild(userInfo);
  } else {
    const userInfo = document.querySelector(".user-info");
    if (userInfo) {
      userInfo.remove();
    }
    authButtons.style.display = "flex";
  }
}

onAuthStateChanged(auth, (user) => {
  updateNavbar(user);
});
