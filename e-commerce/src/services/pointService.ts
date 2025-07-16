import { api } from "./api";

export const transferPoint = async (email: string, amount: number) => {
  const res = await api.post("/point/transfer", {
    email,
    amount,
  });
  return res.data;
};
export const getPointHistory = async () => {
  const res = await api.get("/point/history");
  return res.data.history;
};
