import { api } from "./api";

export const getMyOrders = async () => {
  const res = await api.get("/order/me");
  return res.data.data;
};
