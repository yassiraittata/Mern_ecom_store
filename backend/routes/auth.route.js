import { Router } from "express";

import {
  signup,
  logout,
  login,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";

const router = Router();

// Define your auth routes here
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", getProfile)

export default router;
