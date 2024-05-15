import $api, { setHeader } from "../axios-setup";
import { credentials } from "./auth-types";
export default new (class AuthService {
  async SignUp(credentials: credentials) {
    const userData = (await $api.post("/signup", { ...credentials })).data.user;
    const token = await this.login({
      email: credentials.email,
      username: credentials.username,
      password: credentials.password,
      passwordSub: credentials.password
    });
    console.log(token)
    localStorage.setItem("token", token);
    setHeader();
  }

  async login(inputValue: credentials) {
    const token = (await $api.post("/login", inputValue)).data;
    return token;
  }
})();
