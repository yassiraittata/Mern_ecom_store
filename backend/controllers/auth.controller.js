import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import env from "../utils/envalidate.js";
import { redis } from "../lib/redis.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  if (password.length < 6) {
    return next(
      createHttpError(400, "Password must be at least 6 characters long"),
    );
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    return next(createHttpError(409, "User already exists"));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  // authenticate
  const { accessToken, refreshToken } = generateTokens(user._id);
  storeRefreshToken(user._id, refreshToken);
  setCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(401, "Invalid email or password"));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(createHttpError(401, "Invalid email or password"));
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  await storeRefreshToken(user._id, refreshToken);
  setCookies(res, accessToken, refreshToken);
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const logout = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
      const userId = decoded.userId;
      redis.del(`refreshToken:${userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(createHttpError(403, "Refresh token not found"));
  }

  const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
  const userId = decoded.userId;
  const storedToken = await redis.get(`refreshToken:${userId}`);

  if (storedToken !== refreshToken) {
    return next(createHttpError(403, "Invalid refresh token"));
  }

  const newAccessToken = jwt.sign({ userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    // accessToken: newAccessToken,
  });
};

// get profile
export const getProfile = async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
