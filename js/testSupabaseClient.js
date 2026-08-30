import {
  signUp,
  getSession,
  getCurrentUser
} from "./services/authService.js";

async function testRealSignUp() {
  console.log("1. Cadastro real:");

  const result = await signUp({
    email: "teste1@gmail.com",
    password: "090909",
    username: "teste1",
    displayName: "Usuário Teste 1"
  });

  console.log(result);

  console.log("2. Sessão:");
  console.log(await getSession());

  console.log("3. Usuário atual:");
  console.log(await getCurrentUser());
}

testRealSignUp();