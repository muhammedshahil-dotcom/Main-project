import api from "./api";

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const registerUser = async (payload) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email }, { skipGlobalLoader: true });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await api.post(
    `/auth/reset-password/${token}`,
    { password },
    { skipGlobalLoader: true }
  );
  return res.data;
};
