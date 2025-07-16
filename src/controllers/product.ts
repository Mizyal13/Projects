import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
  getProductDetail,
  deleteProductHard,
} from "../services/product";

export async function handleCreateProduct(req: Request, res: Response) {
  try {
    const { name, description, price, stock } = req.body;
    const image = String(req.file?.filename);

    const product = await createProduct({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
    });
    res.status(201).json({ message: "product ditambahkan", product });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function handleProducts(req: Request, res: Response) {
  try {
    const includeDeleted = req.query.includeDeleted === "true";
    const { search, sort, page, limit } = req.query;
    const result = await getAllProducts({
      search: search as string,
      sort: sort as "asc" | "desc",
      page: Number(page),
      limit: Number(limit),
      includeDeleted,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function handleUpdateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    await updateProduct(id, data);
    res.json({ message: "product di update" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function handleSoftDelete(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await softDeleteProduct(id);
    res.json({ message: "product di sembunyikan" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function handleRestore(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await restoreProduct(id);
    res.json({ message: "product di pulihkan" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export const handleDetailProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "id tidak valid" });
      return;
    }
    const product = await getProductDetail(id);
    res.json({ product });
  } catch (err: any) {
    res
      .status(404)
      .json({ message: err.message || "gagal mengambil data product" });
  }
};

export async function handleHardDelete(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await deleteProductHard(id);
    res.json({ message: "Produk berhasil dihapus permanen" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Gagal menghapus produk" });
  }
}
