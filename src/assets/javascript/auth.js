// 存 token
export function setToken(token) {
  localStorage.setItem('token', token);
}

// 取 token
export function getToken() {
  return localStorage.getItem('token');
}

// 登出用
export function removeToken() {
  localStorage.removeItem('token');
}
