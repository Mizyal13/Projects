import { api } from "./api";

export const getAdminSummary = async () => {
  const res = await api.get("/admin/summary");
  return res.data;
};
