let currentUser = null;
let currentSession = null;

const mockUsers = [
    {
        id: "mock-user-1",
        email: "teste@ewritter.com",
        password: "090909",
        username: "teste",
        displayName: "Usuário Teste",
    }
]

export const mockAuthAdapter = {
  async signUp({ email, password, username, displayName }) {
    const emailExists = mockUsers.some(
        (user) => user.email === email
    );

    if (emailExists) {
        return {
            data: null,
            error: {
                code: "EMAIL_EXISTS",
                message: "E-mail já cadastrado"
            }
        };
    }

    const userNameExists = mockUsers.some(
        (user) => user.username === username
    );

    if (userNameExists) {
        return {
            data: null,
            error: {
                code: "USERNAME_EXISTS",
                message: "Nome de usuário já cadastrado"
            }
        };
    }

    const newUser = {
        id: `mock-user-${mockUsers.length + 1}`,
        email,
        password,
        username,
        displayName
    };

    mockUsers.push(newUser);

    currentUser = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName
    };

    currentSession = {
        user: currentUser
    };

    return {
        data: currentSession,
        error: null
    };
  },

  async signIn({ email, password }) {
    const user = mockUsers.find(
        (item) => item.email === email && item.password === password
    );

    if (!user) {
        return {
            data: null,
            error: {
                code: "UNAUTHENTICATED",
                message: "E-mail ou senha inválidos"
            }
        };
    }

    currentUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName
    };

    currentSession = {
        user: currentUser
    };

    return {
        data: currentSession,
        error: null
    };
},

  async signOut() {
    currentUser = null;
    currentSession = null;

    return {
        data: null,
        error: null
    };
  },

  async getSession() {
    return {
        data: currentSession,
        error: null
    }
  },

  async getCurrentUser() {
    return {
        data: currentUser,
        error: null
    }
  },

  onAuthStateChange(callback) {
    throw new Error("Not implemented");
  }
};