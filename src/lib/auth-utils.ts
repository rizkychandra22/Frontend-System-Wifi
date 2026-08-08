export const setToken = (token: string, user: any) => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem("auth_token");
};

export const removeToken = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserData = () => {
  const user = localStorage.getItem("auth_user");
  return user ? JSON.parse(user) : null;
};

export interface DecodedUser {
  id: number;
  phone: string;
  role: string;
  exp: number;
}

export const getUser = (): DecodedUser | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};
