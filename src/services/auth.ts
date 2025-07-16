import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../connection/client";
import { signIn } from "../utils/jwt";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string,
  profile: string
) {
  if (!email.match(/@/) || password.length < 6)
    throw new Error("email atau password tidak valid");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role, profile },
  });
  return {
    name: user.name,
    id: user.id,
    email: user.email,
    role: user.role,
    profile: user.profile,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("user tidak ditemukan");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("password salah");

  const token = signIn({ id: user.id, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      profile: user.profile,
    },
  };
}

export async function resetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User tidak ditemukan");

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: hashed,
      resetTokenExpires: expires,
    },
  });
  return rawToken;
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await prisma.user.findFirst({
    where: {
      email,
      resetToken: hashedToken,
      resetTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new Error("token tidak valid atau kadaluarsa");
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    },
  });
}

export async function changePassword(
  userId: number,
  oldPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User tidak ditemukan");

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) throw new Error("Password lama salah");

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
    },
  });

  return { message: "Password berhasil diubah" };
}
