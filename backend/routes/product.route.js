import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protectRoute,adminRoute,  getAllProducts);

export default router;
