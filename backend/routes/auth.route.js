import { Router } from "express";

import { signup, logout, login } from "../controllers/auth.controller.js";

const router = Router();

// Define your auth routes here
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

export default router;
