export const INACTIVITY_TIMEOUT_MS = 3 * 60 * 60 * 1000; // 3 Jam

let lastThrottleTime = 0;
export const updateLastActivity = (force = false) => {
  const now = Date.now();
  if (force || now - lastThrottleTime > 15000) { // Throttle tiap 15 detik
    lastThrottleTime = now;
    localStorage.setItem("last_activity_time", now.toString());
  }
};

export const getLastActivity = (): number => {
  const val = localStorage.getItem("last_activity_time");
  if (!val) {
    const now = Date.now();
    localStorage.setItem("last_activity_time", now.toString());
    return now;
  }
  return parseInt(val, 10) || Date.now();
};

export const isSessionInactive = (): boolean => {
  const lastActivity = getLastActivity();
  return Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS;
};

export const setToken = (token: string, user: unknown) => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
  updateLastActivity(true);
};

export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

export const getToken = () => {
  return localStorage.getItem("auth_token");
};

export const removeToken = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  localStorage.removeItem("last_activity_time");
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const user = getUser();
  if (!user || !user.exp) {
    removeToken();
    return false;
  }

  // Cek apakah token JWT sudah kadaluarsa (exp dalam detik)
  if (Date.now() >= user.exp * 1000) {
    removeToken();
    return false;
  }

  // Cek apakah tidak ada aktivitas selama 3 jam
  if (isSessionInactive()) {
    removeToken();
    return false;
  }

  return true;
};

export const getUserData = (): Record<string, string> | null => {
  const user = localStorage.getItem("auth_user");
  return user ? JSON.parse(user) : null;
};

export interface DecodedUser {
  id: number;
  name: string;
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
