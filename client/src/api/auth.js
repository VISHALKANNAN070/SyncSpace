import api from "./client";

export const fetchHome = async () => {
  const response = await api.get("/api/home");
  return response.data;
};
export const logout = () => api.get("/api/auth/logout");
export const getGitHubLoginUrl = () =>
  import.meta.env.VITE_BACKEND_URL + "/api/auth/github";
