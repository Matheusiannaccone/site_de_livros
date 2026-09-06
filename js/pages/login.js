// Importa a função responsável pelo login.
// A página não acessa o Supabase diretamente: ela usa o authService.
import { signIn } from "../services/authService.js";

/*
  =========================================================
  REFERÊNCIAS DOS ELEMENTOS DA PÁGINA
  =========================================================
*/

// Formulário e campos principais.
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

// Containers dos campos, usados para aplicar estilos de erro.
const emailField = document.getElementById("emailField");
const passwordField = document.getElementById("passwordField");

// Mensagens de erro exibidas ao usuário.
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

// Elementos do botão de login.
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnSpinner = document.getElementById("btnSpinner");

// Elementos usados para mostrar ou ocultar a senha.
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const passwordEyeIcon = document.getElementById("passwordEyeIcon");

// Elementos da notificação temporária.
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");

/*
  =========================================================
  LIMPEZA DAS MENSAGENS DE ERRO
  =========================================================
*/

/*
  Remove os estados visuais de erro dos campos de e-mail
  e senha antes de uma nova validação.
*/
function clearErrors() {
  emailField.classList.remove("has-error");
  passwordField.classList.remove("has-error");

  emailError.classList.remove("is-visible");
  passwordError.classList.remove("is-visible");
}

/*
  Exibe uma mensagem de erro relacionada ao campo de e-mail.
*/
function showEmailError(message) {
  emailError.textContent = message;
  emailField.classList.add("has-error");
  emailError.classList.add("is-visible");
}

/*
  Exibe uma mensagem de erro relacionada ao campo de senha.
*/
function showPasswordError(message) {
  passwordError.textContent = message;
  passwordField.classList.add("has-error");
  passwordError.classList.add("is-visible");
}

/*
  =========================================================
  VALIDAÇÃO DO FORMULÁRIO
  =========================================================
*/

/*
  Verifica se os dados básicos do formulário foram preenchidos
  corretamente antes de enviar a tentativa de login ao serviço.

  Retorna:
  - true: formulário válido;
  - false: existe algum erro de preenchimento.
*/
function validateForm() {
  clearErrors();

  // Remove espaços desnecessários do início e do fim do e-mail.
  const email = emailInput.value.trim();

  // A senha não utiliza trim porque espaços podem fazer parte dela.
  const password = passwordInput.value;

  let isValid = true;

  // Verifica se o e-mail foi informado.
  if (!email) {
    showEmailError("Informe seu e-mail.");
    isValid = false;

  // Utiliza a validação nativa do input type="email".
  } else if (!emailInput.validity.valid) {
    showEmailError("Insira um e-mail válido.");
    isValid = false;
  }

  // Verifica se a senha foi informada.
  if (!password) {
    showPasswordError("Informe sua senha.");
    isValid = false;

  // O projeto utiliza senha com mínimo de 6 caracteres.
  } else if (password.length < 6) {
    showPasswordError("Mínimo 6 caracteres.");
    isValid = false;
  }

  return isValid;
}

/*
  =========================================================
  ESTADO DE CARREGAMENTO
  =========================================================
*/

/*
  Controla o estado visual do botão enquanto a autenticação
  está sendo processada.

  Durante o carregamento:
  - o botão fica desabilitado;
  - o texto "Entrar" é ocultado;
  - o spinner é exibido.
*/
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.setAttribute("aria-busy", String(isLoading));

  btnText.style.display = isLoading ? "none" : "";
  btnSpinner.classList.toggle("is-visible", isLoading);
}

/*
  =========================================================
  NOTIFICAÇÃO TEMPORÁRIA
  =========================================================
*/

/*
  Exibe uma pequena mensagem temporária na tela.

  Após 3 segundos, a notificação é escondida novamente.
*/
function showToast(message) {
  toastMessage.textContent = message;
  toastNotification.classList.add("is-visible");

  setTimeout(() => {
    toastNotification.classList.remove("is-visible");
  }, 3000);
}

/*
  =========================================================
  TRATAMENTO DOS ERROS DE AUTENTICAÇÃO
  =========================================================
*/

/*
  Recebe os erros normalizados pelo authService e decide
  como cada situação será apresentada ao usuário.

  A página não precisa conhecer erros específicos do Supabase.
  Ela trabalha apenas com os códigos padronizados pelo projeto.
*/
function handleLoginError(error) {
  switch (error.code) {

    // Credenciais incorretas ou usuário não autenticado.
    case "UNAUTHENTICATED":
      showEmailError(error.message);
      showPasswordError(error.message);
      break;

    // Dados enviados não atendem às regras esperadas.
    case "VALIDATION_ERROR":
      showToast(error.message);
      break;

    // Falha de conexão com o serviço.
    case "NETWORK_ERROR":
      showToast("Não foi possível conectar ao servidor. Tente novamente.");
      break;

    // Qualquer erro que não tenha um tratamento específico.
    default:
      showToast(error.message || "Ocorreu um erro inesperado.");
      break;
  }
}

/*
  =========================================================
  ENVIO DO FORMULÁRIO DE LOGIN
  =========================================================
*/

/*
  Intercepta o envio padrão do formulário.

  O preventDefault() impede que a página seja recarregada
  e permite que o login seja processado pelo JavaScript.
*/
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Interrompe o processo caso os campos sejam inválidos.
  if (!validateForm()) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Ativa o estado de carregamento antes de iniciar o login.
  setLoading(true);

  try {
    /*
      Solicita o login através do authService.

      O authService decide automaticamente se deve utilizar
      o ambiente Mock ou o Supabase.
    */
    const result = await signIn({
      email,
      password
    });

    /*
      O padrão de retorno do authService contém:
      - result.data quando a operação tem sucesso;
      - result.error quando ocorre algum problema.
    */
    if (result.error) {
      handleLoginError(result.error);
      return;
    }

    // Informa ao usuário que o login foi realizado corretamente.
    showToast("Login realizado com sucesso.");

    /*
      O redirecionamento será adicionado quando a página
      de destino após o login estiver definida.

      Exemplo:
      window.location.href = "./index.html";
    */

  } catch (error) {
    /*
      Este bloco funciona como uma proteção adicional para
      erros inesperados que não tenham sido tratados pelo serviço.
    */
    console.error("Erro inesperado durante o login:", error);
    showToast("Ocorreu um erro inesperado.");

  } finally {
    /*
      O finally sempre é executado, independentemente de sucesso
      ou erro, garantindo que o botão volte ao estado normal.
    */
    setLoading(false);
  }
});

/*
  =========================================================
  MOSTRAR E OCULTAR SENHA
  =========================================================
*/

/*
  Alterna o tipo do campo entre "password" e "text".

  Também altera o ícone e o texto utilizado por tecnologias
  assistivas através do aria-label.
*/
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

/*
  =========================================================
  LIMPEZA DE ERROS DURANTE A DIGITAÇÃO
  =========================================================
*/

/*
  Quando o usuário começa a corrigir o e-mail, a mensagem
  de erro anterior é removida.
*/
emailInput.addEventListener("input", () => {
  emailField.classList.remove("has-error");
  emailError.classList.remove("is-visible");
});

/*
  Quando o usuário começa a corrigir a senha, a mensagem
  de erro anterior também é removida.
*/
passwordInput.addEventListener("input", () => {
  passwordField.classList.remove("has-error");
  passwordError.classList.remove("is-visible");
});