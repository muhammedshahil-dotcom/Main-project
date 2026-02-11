import api from "./api";

export const getAllUsers = async (token) => {
  const res = await api.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || [];
};

export const deleteUser = async (id, token) => {
  const res = await api.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
