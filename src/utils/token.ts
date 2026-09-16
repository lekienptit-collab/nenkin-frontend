import { parseJson } from './json';

const TOKEN_KEY = 'auth_nenkin';

export const getToken = (): TOKEN.Auth => {
  const data = localStorage.getItem(TOKEN_KEY);
  return parseJson<TOKEN.Auth>(data) || {};
};

export const setToken = (t: TOKEN.Auth) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
};

export const logoutToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
