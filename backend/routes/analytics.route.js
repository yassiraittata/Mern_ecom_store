import { Router } from "express";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";
import { getAnalyticsData } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", protectRoute, adminRoute, async (req, res, next) => {
  const analyticsData = await getAnalyticsData();

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  const dailySalesData = getDailySalesData(startDate, endDate);

  res.json({
    success: true,
    analyticsData,
    dailySalesData,
  });
});

export default router;
