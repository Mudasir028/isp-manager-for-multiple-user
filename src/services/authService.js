// import jwtDecode from "jwt-decode";
import http from "./httpService";

const apiEndpoint = {
  login: "/check_login",
  logout: "/logout",
  register: "/register",
};

const tokenKey = "token";
const tokenKey1 = "tokenAI";

http.setJwt(getJwt());

async function login(username, password) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const { data: user } = await http.post(apiEndpoint.login, formData);
  const jwt = user.user[0].token;
  localStorage.setItem(tokenKey, jwt);
  localStorage.setItem(tokenKey1, user.user[0].id);
  return user;
}

async function register(name, username, password) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  // const { data: user } =
  const { data } = await http.post(apiEndpoint.register, formData);
  return data;
}

async function logout(username) {
  try {
    await http.post(apiEndpoint.logout, { username });
  } catch (ex) {}
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(tokenKey1);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwt;
    // return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}
export function getCurrentUserId() {
  try {
    const admin_id = localStorage.getItem(tokenKey1);
    return admin_id;
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  register,
  logout,
  getCurrentUser,
  getCurrentUserId,
  getJwt,
};
