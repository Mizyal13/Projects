import { Router } from "express";
import {
  handleCreateOrder,
  handleGetAllOrders,
  handleGetMyOrders,
  getOrderUser,
} from "../controllers/order";
import { authenticate } from "../middlewares/authenticate";
import { isAdmin } from "../middlewares/roleAdmin";

const router = Router();
router.post("/", authenticate, handleCreateOrder);
router.get("/", authenticate, isAdmin, handleGetAllOrders);
router.get("/me", authenticate, handleGetMyOrders);
router.get("/myorder", authenticate, getOrderUser);

export default router;
