// src/lib/auth.js

const TOKEN_KEY = "auth_token";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const logout = () => {
  removeToken();
};
