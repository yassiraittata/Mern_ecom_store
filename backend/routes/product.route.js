import { Router } from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendation", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
