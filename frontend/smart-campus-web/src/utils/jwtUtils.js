export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  return decoded ? decoded.role : null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Check expiration (exp is in seconds)
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};
