import { api } from "./api";

export const getAllProducts = async (
  page = 1,
  limit = 10,
  sort: "asc" | "desc" = "desc"
) => {
  const res = await api.get("/product", {
    params: { page, limit, sort },
  });
  return res.data;
};

export const getAllProductsAdmin = async (
  page = 1,
  limit = 10,
  sort: "asc" | "desc" = "desc",
  includeDeleted = true
) => {
  const res = await api.get("/product", {
    params: { page, limit, sort, includeDeleted },
  });
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/product/${id}`);
  return res.data.product;
};

export const createProduct = async (formData: FormData) => {
  const res = await api.post("/product/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (
  id: string | number,
  formData: FormData
) => {
  const res = await api.put(`/product/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const softDeleteProduct = async (id: number) => {
  return await api.delete(`/product/${id}`);
};

export const restoreProduct = async (id: number) => {
  return await api.patch(`/product/${id}/restore`);
};

export const hardDeleteProduct = async (id: number) => {
  return await api.delete(`/product/${id}/hard`);
};
