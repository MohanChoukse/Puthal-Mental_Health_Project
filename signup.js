import {
  auth,
  createUserWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
} from "./firebase.js";

const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const signupBtnText = document.getElementById("signupBtnText");
const signupBtnLoader = document.getElementById("signupBtnLoader");
const signupMessage = document.getElementById("signupMessage");
const toastContainer = document.getElementById("toastContainer");

const googleSignupBtn = document.getElementById("googleSignupBtn");
const googleSignupBtnText = document.getElementById("googleSignupBtnText");
const googleSignupBtnLoader = document.getElementById("googleSignupBtnLoader");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

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
    signupBtn.disabled = true;
    signupBtnText.style.display = "none";
    signupBtnLoader.style.display = "inline-block";
  } else {
    signupBtn.disabled = false;
    signupBtnText.style.display = "inline";
    signupBtnLoader.style.display = "none";
  }
}

function setGoogleLoading(loading) {
  if (loading) {
    googleSignupBtn.disabled = true;
    googleSignupBtnText.style.display = "none";
    googleSignupBtnLoader.style.display = "inline-block";
  } else {
    googleSignupBtn.disabled = false;
    googleSignupBtnText.style.display = "inline";
    googleSignupBtnLoader.style.display = "none";
  }
}

function validateInput(input, isValid, errorMessage) {
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

nameInput.addEventListener("input", () => {
  clearValidation(nameInput);
});

emailInput.addEventListener("input", () => {
  clearValidation(emailInput);
});

passwordInput.addEventListener("input", () => {
  clearValidation(passwordInput);
});

confirmPasswordInput.addEventListener("input", () => {
  clearValidation(confirmPasswordInput);
});

signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  signupMessage.innerHTML = "";

  let isValid = true;

  if (!name) {
    validateInput(nameInput, false);
    showMessage("Please enter your full name");
    isValid = false;
  } else if (name.length < 2) {
    validateInput(nameInput, false);
    showMessage("Name must be at least 2 characters long");
    isValid = false;
  } else {
    validateInput(nameInput, true);
  }

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
    showMessage("Please enter a password");
    isValid = false;
  } else if (password.length < 6) {
    validateInput(passwordInput, false);
    showMessage("Password must be at least 6 characters long");
    isValid = false;
  } else {
    validateInput(passwordInput, true);
  }

  if (!confirmPassword) {
    validateInput(confirmPasswordInput, false);
    showMessage("Please confirm your password");
    isValid = false;
  } else if (password !== confirmPassword) {
    validateInput(confirmPasswordInput, false);
    showMessage("Passwords do not match");
    isValid = false;
  } else {
    validateInput(confirmPasswordInput, true);
  }

  if (!isValid) {
    return;
  }

  setLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    localStorage.setItem("userName", name);

    showMessage(
      "Account created successfully! Redirecting to login...",
      "success"
    );

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    console.error("Signup error:", error);

    let errorMessage = "An error occurred during signup. Please try again.";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage =
          "This email is already registered. Please use a different email or try logging in.";
        validateInput(emailInput, false);
        break;
      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address.";
        validateInput(emailInput, false);
        break;
      case "auth/weak-password":
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
        validateInput(passwordInput, false);
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

googleSignupBtn.addEventListener("click", async () => {
  setGoogleLoading(true);
  signupMessage.innerHTML = "";

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const displayName = user.displayName || user.email.split("@")[0];
    localStorage.setItem("userName", displayName);

    showMessage(
      "Account created successfully with Google! Redirecting to home...",
      "success"
    );

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    console.error("Google signup error:", error);

    let errorMessage =
      "An error occurred during Google signup. Please try again.";

    switch (error.code) {
      case "auth/popup-closed-by-user":
        errorMessage = "Signup was cancelled. Please try again.";
        break;
      case "auth/popup-blocked":
        errorMessage =
          "Popup was blocked by browser. Please allow popups and try again.";
        break;
      case "auth/account-exists-with-different-credential":
        errorMessage =
          "An account already exists with this email using a different sign-in method.";
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
