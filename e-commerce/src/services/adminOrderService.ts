import { api } from "./api";

export const getAllOrders = async (
  page = 1,
  limit = 5,
  sort: "asc" | "desc" = "desc"
) => {
  const res = await api.get("/order", {
    params: { page, limit, sort },
  });
  return res.data;
};
