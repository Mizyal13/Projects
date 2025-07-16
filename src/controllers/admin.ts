import { Request, Response } from "express";
import { getAdminSummary } from "../services/admin";

export async function handleGetSummary(req: Request, res: Response) {
  try {
    const data = await getAdminSummary();
    res.json(data);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Gagal mengambil data summary" });
  }
}
