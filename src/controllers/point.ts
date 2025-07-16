import { Request, Response } from "express";
import { transferPoints } from "../services/point";
import { prisma } from "../connection/client";

export async function handleTransferPoints(req: Request, res: Response) {
  try {
    const { email, amount } = req.body;
    const sender = (req as any).user;

    const result = await transferPoints(sender.id, email, Number(amount));
    res.json({ message: "Transfer poin berhasil", ...result });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function handlePointHistory(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    const history = await prisma.pointHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ history });
  } catch (err: any) {
    res.status(500).json({ message: "Gagal mengambil riwayat poin" });
  }
}
