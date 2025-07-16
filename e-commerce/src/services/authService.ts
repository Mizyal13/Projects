import { api } from "./api";

export const registerUser = async (data: FormData) => {
  const res = await api.post("/user/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const res = await api.post("/user/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data;
};
