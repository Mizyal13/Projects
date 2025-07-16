import { Router } from "express";
import {
  handleCreateProduct,
  handleProducts,
  handleRestore,
  handleSoftDelete,
  handleUpdateProduct,
  handleDetailProduct,
  handleHardDelete,
} from "../controllers/product";
import { isAdmin } from "../middlewares/roleAdmin";
import { upload } from "../utils/multer";

const router = Router();

router.get("/", handleProducts);
router.post("/create", isAdmin, upload.single("image"), handleCreateProduct);
router.put("/:id", isAdmin, upload.single("image"), handleUpdateProduct);
router.delete("/:id", isAdmin, handleSoftDelete);
router.patch("/:id/restore", isAdmin, handleRestore);
router.get("/:id", handleDetailProduct);
router.delete("/:id/hard", isAdmin, handleHardDelete);

export default router;
