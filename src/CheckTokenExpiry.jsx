import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (error) {
    return true; // Return expired in case of an error (invalid token)
  }
}

export function getToken() {
  const token = Cookies.get('jwt');
  return token && !isTokenExpired(token) ? token : null;
}