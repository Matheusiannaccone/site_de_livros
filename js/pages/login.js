import { signIn } from "../services/authService.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

const emailField = document.getElementById("emailField");
const passwordField = document.getElementById("passwordField");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnSpinner = document.getElementById("btnSpinner");

const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const passwordEyeIcon = document.getElementById("passwordEyeIcon");

const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");

function clearErrors() {
  emailField.classList.remove("has-error");
  passwordField.classList.remove("has-error");

  emailError.classList.remove("is-visible");
  passwordError.classList.remove("is-visible");
}

function showEmailError(message) {
  emailError.textContent = message;
  emailField.classList.add("has-error");
  emailError.classList.add("is-visible");
}

function showPasswordError(message) {
  passwordError.textContent = message;
  passwordField.classList.add("has-error");
  passwordError.classList.add("is-visible");
}

function validateForm() {
  clearErrors();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let isValid = true;

  if (!email) {
    showEmailError("Informe seu e-mail.");
    isValid = false;
  } else if (!emailInput.validity.valid) {
    showEmailError("Insira um e-mail válido.");
    isValid = false;
  }

  if (!password) {
    showPasswordError("Informe sua senha.");
    isValid = false;
  } else if (password.length < 6) {
    showPasswordError("Mínimo 6 caracteres.");
    isValid = false;
  }

  return isValid;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.setAttribute("aria-busy", String(isLoading));

  btnText.style.display = isLoading ? "none" : "";
  btnSpinner.classList.toggle("is-visible", isLoading);
}

function showToast(message) {
  toastMessage.textContent = message;
  toastNotification.classList.add("is-visible");

  setTimeout(() => {
    toastNotification.classList.remove("is-visible");
  }, 3000);
}

function handleLoginError(error) {
  switch (error.code) {
    case "UNAUTHENTICATED":
      showEmailError(error.message);
      showPasswordError(error.message);
      break;

    case "VALIDATION_ERROR":
      showToast(error.message);
      break;

    case "NETWORK_ERROR":
      showToast("Não foi possível conectar ao servidor. Tente novamente.");
      break;

    default:
      showToast(error.message || "Ocorreu um erro inesperado.");
      break;
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  setLoading(true);

  try {
    const result = await signIn({
      email,
      password
    });

    if (result.error) {
      handleLoginError(result.error);
      return;
    }

    showToast("Login realizado com sucesso.");

    // Redirecionamento será definido quando a página de destino existir.
    // window.location.href = "./index.html";

  } catch (error) {
    console.error("Erro inesperado durante o login:", error);
    showToast("Ocorreu um erro inesperado.");
  } finally {
    setLoading(false);
  }
});

togglePasswordBtn.addEventListener("click", () => {
  const passwordVisible = passwordInput.type === "text";

  passwordInput.type = passwordVisible ? "password" : "text";

  passwordEyeIcon.textContent = passwordVisible
    ? "visibility"
    : "visibility_off";

  togglePasswordBtn.setAttribute(
    "aria-label",
    passwordVisible ? "Mostrar senha" : "Ocultar senha"
  );
});

emailInput.addEventListener("input", () => {
  emailField.classList.remove("has-error");
  emailError.classList.remove("is-visible");
});

passwordInput.addEventListener("input", () => {
  passwordField.classList.remove("has-error");
  passwordError.classList.remove("is-visible");
});