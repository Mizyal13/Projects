import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET as string;

export interface userPayload {
  id: number;
  role: string;
  name?: string;
  email?: string;
}

export function signIn(payload: userPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as userPayload;
}

export function createResetToken(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });
}
export function verifyResetToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { email: string };
}
