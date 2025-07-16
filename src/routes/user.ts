import { Router } from "express";
import { prisma } from "../connection/client";
import {
  handleRegist,
  handleLogin,
  resetTokenRequest,
  handleResetPassword,
  handleChangePassword,
} from "../controllers/auth";
import { upload } from "../utils/multer";
import { authenticate } from "../middlewares/authenticate";
import type { userPayload } from "../utils/jwt";
import type { Request } from "express";

interface AuthRequest extends Request {
  user: userPayload;
}

const router = Router();

router.get("/me", authenticate, async (req, res) => {
  const { id } = (req as AuthRequest).user;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      points: true,
      profile: true,
    },
  });

  res.json({ user });
});

router.post("/register", upload.single("profile"), handleRegist);
router.post("/login", handleLogin);
router.post("/reset-token", resetTokenRequest);
router.post("/reset-password", handleResetPassword);
router.post("/change-password", authenticate, handleChangePassword);

export default router;
