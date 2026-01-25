import { Router } from "express";
import {
  getAllProducts,
  getFeaturedProducts,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protectRoute,adminRoute,  getAllProducts);
router.get("/featured",  getFeaturedProducts);

export default router;
