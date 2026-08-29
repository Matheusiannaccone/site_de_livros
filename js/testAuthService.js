import {
  signUp,
  signIn,
  signOut,
  getSession,
  getCurrentUser
} from "./services/authService.js";

async function testAuthService() {
  console.log("1. Sessão inicial:");
  console.log(await getSession());

  console.log("2. Login via authService:");
  console.log(
    await signIn({
      email: "teste@ewritter.com",
      password: "090909"
    })
  );

  console.log("3. Sessão após login:");
  console.log(await getSession());

  console.log("4. Usuário atual:");
  console.log(await getCurrentUser());

  console.log("5. Logout:");
  console.log(await signOut());

  console.log("6. Sessão após logout:");
  console.log(await getSession());

  console.log("7. Cadastro via authService:");
  console.log(
    await signUp({
      email: "service1@ewritter.com",
      password: "123456",
      username: "serviceuser1",
      displayName: "Service User1"
    })
  );

  console.log("8. Sessão após cadastro:");
  console.log(await getSession());
}

testAuthService();