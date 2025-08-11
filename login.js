import {
  auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  googleProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "./firebase.js";

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginBtnText = document.getElementById("loginBtnText");
const loginBtnLoader = document.getElementById("loginBtnLoader");
const loginMessage = document.getElementById("loginMessage");
const toastContainer = document.getElementById("toastContainer");

const googleLoginBtn = document.getElementById("googleLoginBtn");
const googleLoginBtnText = document.getElementById("googleLoginBtnText");
const googleLoginBtnLoader = document.getElementById("googleLoginBtnLoader");

const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const rememberMeCheckbox = document.getElementById("rememberMe");

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

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

function showMessage(message, type = "error") {
  showToast(message, type);
}

function setLoading(loading) {
  if (loading) {
    loginBtn.disabled = true;
    loginBtnText.style.display = "none";
    loginBtnLoader.style.display = "inline-block";
  } else {
    loginBtn.disabled = false;
    loginBtnText.style.display = "inline";
    loginBtnLoader.style.display = "none";
  }
}

function setGoogleLoading(loading) {
  if (loading) {
    googleLoginBtn.disabled = true;
    googleLoginBtnText.style.display = "none";
    googleLoginBtnLoader.style.display = "inline-block";
  } else {
    googleLoginBtn.disabled = false;
    googleLoginBtnText.style.display = "inline";
    googleLoginBtnLoader.style.display = "none";
  }
}

function validateInput(input, isValid) {
  if (isValid) {
    input.classList.remove("error");
    input.classList.add("success");
    return true;
  } else {
    input.classList.remove("success");
    input.classList.add("error");
    return false;
  }
}

function clearValidation(input) {
  input.classList.remove("error", "success");
}

function saveLoginCredentials(email, password, rememberMe) {
  if (rememberMe) {
    localStorage.setItem("rememberedEmail", email);
    localStorage.setItem("rememberedPassword", password);
    localStorage.setItem("rememberMe", "true");
  } else {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
    localStorage.removeItem("rememberMe");
  }
}

function loadLoginCredentials() {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  const rememberedPassword = localStorage.getItem("rememberedPassword");
  const rememberMe = localStorage.getItem("rememberMe");

  if (rememberedEmail && rememberedPassword && rememberMe === "true") {
    emailInput.value = rememberedEmail;
    passwordInput.value = rememberedPassword;
    rememberMeCheckbox.checked = true;
  }
}

document.addEventListener("DOMContentLoaded", loadLoginCredentials);

emailInput.addEventListener("input", () => {
  clearValidation(emailInput);
});

passwordInput.addEventListener("input", () => {
  clearValidation(passwordInput);
});

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox.checked;

  loginMessage.innerHTML = "";

  let isValid = true;

  if (!email) {
    validateInput(emailInput, false);
    showMessage("Please enter your email address");
    isValid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    validateInput(emailInput, false);
    showMessage("Please enter a valid email address");
    isValid = false;
  } else {
    validateInput(emailInput, true);
  }

  if (!password) {
    validateInput(passwordInput, false);
    showMessage("Please enter your password");
    isValid = false;
  } else {
    validateInput(passwordInput, true);
  }

  if (!isValid) {
    return;
  }

  setLoading(true);

  try {
    const persistence = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;
    console.log("Setting persistence:", rememberMe ? "LOCAL" : "SESSION");
    await setPersistence(auth, persistence);
    console.log("Persistence set successfully");

    console.log("Attempting to sign in with email/password...");
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    saveLoginCredentials(email, password, rememberMe);

    const userName =
      localStorage.getItem("userName") || user.email.split("@")[0];

    const persistenceType = rememberMe ? "LOCAL" : "SESSION";
    showMessage(
      `Welcome back, ${userName}! (Persistence: ${persistenceType}) Redirecting to home...`,
      "success"
    );

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "An error occurred during login. Please try again.";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage =
          "No account found with this email address. Please check your email or sign up.";
        validateInput(emailInput, false);
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password. Please try again.";
        validateInput(passwordInput, false);
        break;
      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address.";
        validateInput(emailInput, false);
        break;
      case "auth/user-disabled":
        errorMessage =
          "This account has been disabled. Please contact support.";
        break;
      case "auth/too-many-requests":
        errorMessage =
          "Too many failed login attempts. Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage =
          "Network error. Please check your internet connection and try again.";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    showMessage(errorMessage);
  } finally {
    setLoading(false);
  }
});

googleLoginBtn.addEventListener("click", async () => {
  setGoogleLoading(true);
  loginMessage.innerHTML = "";

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const displayName =
      user.displayName ||
      localStorage.getItem("userName") ||
      user.email.split("@")[0];
    localStorage.setItem("userName", displayName);

    showMessage(
      `Welcome back, ${displayName}! Redirecting to home...`,
      "success"
    );

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    console.error("Google login error:", error);

    let errorMessage =
      "An error occurred during Google login. Please try again.";

    switch (error.code) {
      case "auth/popup-closed-by-user":
        errorMessage = "Login was cancelled. Please try again.";
        break;
      case "auth/popup-blocked":
        errorMessage =
          "Popup was blocked by browser. Please allow popups and try again.";
        break;
      case "auth/user-not-found":
        errorMessage =
          "No account found with this Google account. Please sign up first.";
        break;
      case "auth/network-request-failed":
        errorMessage =
          "Network error. Please check your internet connection and try again.";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    showMessage(errorMessage);
  } finally {
    setGoogleLoading(false);
  }
});

const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const closeModal = document.querySelector(".close-modal");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const resetEmail = document.getElementById("resetEmail");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const resetBtnText = document.getElementById("resetBtnText");
const resetBtnLoader = document.getElementById("resetBtnLoader");
const resetMessage = document.getElementById("resetMessage");
const backToLoginBtn = document.getElementById("backToLoginBtn");

// Function to set loading state for reset password button
function setResetLoading(loading) {
  if (loading) {
    resetPasswordBtn.disabled = true;
    resetBtnText.style.display = "none";
    resetBtnLoader.style.display = "inline-block";
  } else {
    resetPasswordBtn.disabled = false;
    resetBtnText.style.display = "inline";
    resetBtnLoader.style.display = "none";
  }
}

// Open forgot password modal
forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  forgotPasswordModal.style.display = "block";
  resetEmail.value = emailInput.value; // Pre-fill with login email if available
});

// Close modal when clicking on X
closeModal.addEventListener("click", () => {
  forgotPasswordModal.style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", (e) => {
  if (e.target === forgotPasswordModal) {
    forgotPasswordModal.style.display = "none";
  }
});

// Back to login button
backToLoginBtn.addEventListener("click", () => {
  forgotPasswordModal.style.display = "none";
});

// Handle forgot password form submission
forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = resetEmail.value.trim();
  resetMessage.innerHTML = "";

  let isValid = true;

  if (!email) {
    validateInput(resetEmail, false);
    showMessage("Please enter your email address", "error");
    isValid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    validateInput(resetEmail, false);
    showMessage("Please enter a valid email address", "error");
    isValid = false;
  } else {
    validateInput(resetEmail, true);
  }

  if (!isValid) {
    return;
  }

  setResetLoading(true);

  try {
    await sendPasswordResetEmail(auth, email);
    showMessage(
      "Reset link has been sent! Please check your email.",
      "success"
    );
    setTimeout(() => {
      forgotPasswordModal.style.display = "none";
    }, 3000);
  } catch (error) {
    console.error("Password reset error:", error);

    let errorMessage =
      "An error occurred during password reset. Please try again.";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage =
          "If this email is registered, you will receive a reset link.";
        break;
      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address.";
        validateInput(resetEmail, false);
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many requests. Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage =
          "Network error. Please check your internet connection and try again.";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    showMessage(errorMessage, "error");
  } finally {
    setResetLoading(false);
  }
});
