export const getSessionInfo = () => {
  const session = localStorage.getItem("sessionInfo");
  if (!session) return null;

  try {
    return JSON.parse(session);
  } catch (error) {
    console.error("Invalid session data:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  const session = getSessionInfo();
  return session?.token ? true : false;
};

export const getToken = () => {
  const session = getSessionInfo();
  return session?.token;
};

export const getUserInfo = () => {
  const session = getSessionInfo();
  return session?.user;
};

export const getAdminInfo = () => {
  const session = getSessionInfo();
  return session?.admin;
};

export const getSpInfo = () => {
  const session = getSessionInfo();
  return session?.user;
};

export const getUserRole = () => {
  const session = getSessionInfo();
  return session?.role || null;
};
