const authStorageKeys = new Set([
  "username",
  "name",
  "role",
  "email",
  "user",
  "userid",
  "token",
  "authtoken",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "jwt",
  "rememberme",
]);

let currentUser = null;

export function getStoredUser() {
  return currentUser;
}

export function setCurrentUser(user) {
  currentUser = user;
}

export function getHomePath(role) {
  if (role === "ADMIN") {
    return "/dashboard";
  }

  if (role === "USER") {
    return "/user-dashboard";
  }

  return "/login";
}

export function clearAuthStorage() {
  currentUser = null;

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    const normalizedKey = key?.toLowerCase();

    if (
      normalizedKey &&
      (authStorageKeys.has(normalizedKey) || /auth|token|session|login/i.test(key))
    ) {
      localStorage.removeItem(key);
    }
  }
}