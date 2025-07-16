import { Router } from "express";
import { handleGetSummary } from "../controllers/admin";
import { authenticate } from "../middlewares/authenticate";
import { isAdmin } from "../middlewares/roleAdmin";

const router = Router();

router.get("/summary", authenticate, isAdmin, handleGetSummary);

export default router;
