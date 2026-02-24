import createHttpError from "http-errors";
import env from "../utils/envalidate.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return next(createHttpError(401, "Unauthorized: No access token provided"));
  }
  const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    return next(createHttpError(401, "Unauthorized: Invalid access token"));
  }
  const userId = decoded.userId;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return next(createHttpError(401, "Unauthorized: User not found"));
  }

  req.user = user;
  next();
};

export const adminRoute = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    return next(createHttpError(403, "Access denied - Admins only"));
  }
};
