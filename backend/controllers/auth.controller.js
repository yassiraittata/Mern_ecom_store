import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

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

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
    },
  });
};

export const login = (req, res, next) => {
  // Handle login
  res.json({ message: "Login route" });
};

export const logout = (req, res, next) => {
  // Handle logout
  res.json({ message: "Logout route" });
};
