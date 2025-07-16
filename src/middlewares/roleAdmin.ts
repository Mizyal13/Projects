import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token_user;

  if (!token) {
    res.status(401).json({ message: "token tidak ditemukan" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;

    if ((req as any).user.role !== "admin") {
      res.status(403).json({ message: "hanya admin yang boleh" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "token tidak valdi" });
  }
}
