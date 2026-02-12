import api from "./api";

export const createBooking = async (payload, token) => {
  const res = await api.post("/bookings", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getMyBookings = async (token) => {
  const res = await api.get("/bookings/my", {
    headers: { Authorization: `Bearer ${token}` },
    skipGlobalLoader: true,
  });
  return res.data.data || [];
};

export const cancelBooking = async (bookingId, token) => {
  const res = await api.put(
    `/bookings/${bookingId}/cancel`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
