import { Router } from "express";
import { handleTransferPoints, handlePointHistory } from "../controllers/point";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/transfer", authenticate, handleTransferPoints);
router.get("/history", authenticate, handlePointHistory);

export default router;
