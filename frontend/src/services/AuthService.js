import requests from "./httpRequest";

const AuthService = {
  createAccount: async (body) => requests.post("/auth/create-account", body),
  login: async (body) => requests.post("/auth/login", body),
  me: async () => requests.get("/auth/me"),
};

export default AuthService;
