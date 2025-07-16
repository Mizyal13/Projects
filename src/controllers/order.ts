import { Request, Response } from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUserId,
  updateUserPoints,
  getUserOrders,
} from "../services/order";

export async function handleCreateOrder(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { items } = req.body;

    const order = await createOrder(user.id, items);

    await updateUserPoints(user.id, order.totalPrice);

    await res.status(201).json({ message: "order berhasil dibuat", order });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function handleGetAllOrders(req: Request, res: Response) {
  try {
    const { userId, search, sort, page, limit } = req.query;

    const result = await getAllOrders({
      userId: Number(userId),
      sort: sort === "asc" || sort === "desc" ? sort : undefined,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function handleGetMyOrders(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const orders = await getOrdersByUserId(user.id);

    res.status(200).json({ message: "order kamu", data: orders });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getOrderUser(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const orders = await getUserOrders(user.id);
    res.status(200).json({ message: "order kamu", data: orders });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
