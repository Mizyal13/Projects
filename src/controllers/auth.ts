import { Request, Response } from "express";
import { registerS, loginS } from "../validation/auth";
import {
  registerUser,
  loginUser,
  resetToken,
  resetPassword,
  changePassword,
} from "../services/auth";

export async function handleRegist(req: Request, res: Response) {
  try {
    const { error } = registerS.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: "gambar tidak diunggah" });
      return;
    }

    const { name, email, password, role } = req.body;
    const profile = req.file.filename;

    const user = await registerUser(name, email, password, role, profile);
    res.status(201).json({ message: "berhasil register", user });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: err?.message || "terjadi kesalahan saat register" });
  }
}

export async function handleLogin(req: Request, res: Response) {
  try {
    const { error } = loginS.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.cookie("token_user", result.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "berhasil login", ...result });
  } catch (err: any) {
    res
      .status(401)
      .json({ message: err?.message || "terjadi kesalahan pada saat login" });
  }
}

export async function resetTokenRequest(req: Request, res: Response) {
  const { email } = req.body;
  const token = await resetToken(email);
  res.json({ message: "token reset dikirim", token });
  console.log(token);
}
export async function handleResetPassword(req: Request, res: Response) {
  const { email, token, newPassword } = req.body;
  await resetPassword(email, token, newPassword);
  res.json({ message: "password berhasil di reset" });
  console.log(resetPassword);
}

export async function handleChangePassword(req: Request, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = (req as any).user;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: "Harap isi semua field" });
      return;
    }

    const result = await changePassword(user.id, oldPassword, newPassword);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
