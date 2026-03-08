import { Router } from "express";

const router = Router();

import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

router.get("/", protectRoute, getCoupon);
router.post("/", protectRoute, validateCoupon);

export default router;
