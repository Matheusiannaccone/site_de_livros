import { mockAuthAdapter } from "./services/adapters/mock/authAdapter.js";

async function testSignUp() {
  console.log("1. Cadastro válido:");

  const validSignUp = await mockAuthAdapter.signUp({
    email: "novo@ewritter.com",
    password: "123456",
    username: "novousuario",
    displayName: "Novo Usuário"
  });

  console.log(validSignUp);

  console.log("2. Sessão após cadastro:");
  console.log(await mockAuthAdapter.getSession());

  console.log("3. Cadastro com e-mail repetido:");

  const repeatedEmail = await mockAuthAdapter.signUp({
    email: "novo@ewritter.com",
    password: "123456",
    username: "outroUsuario",
    displayName: "Outro Usuário"
  });

  console.log(repeatedEmail);

  console.log("4. Cadastro com username repetido:");

  const repeatedUsername = await mockAuthAdapter.signUp({
    email: "outro@ewritter.com",
    password: "123456",
    username: "novousuario",
    displayName: "Outro Usuário"
  });

  console.log(repeatedUsername);
}

testSignUp();