import {
  signUp,
  signIn,
  signOut,
  getCurrentUser
} from "./services/authService.js";

async function testAuthErrors() {
  console.log("1. Login com senha errada:");

  console.log(
    await signIn({
      email: "teste1@gmail.com",
      password: "senhaerrada"
    })
  );

  console.log("2. Cadastro com e-mail repetido:");

  console.log(
    await signUp({
      email: "teste1@gmail.com",
      password: "123456",
      username: "outroteste",
      displayName: "Outro Teste"
    })
  );

  console.log("3. Logout:");

  console.log(await signOut());

  console.log("4. getCurrentUser sem sessão:");

  console.log(await getCurrentUser());
}

testAuthErrors();