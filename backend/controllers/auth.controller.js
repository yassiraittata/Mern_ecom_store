import createHttpError from "http-errors";

export const signup = (req, res, next) => {
  // Handle signup
  res.json({ message: "Signup route" });
};

export const login = (req, res, next) => {
  // Handle login
  res.json({ message: "Login route" });
};

export const logout = (req, res, next) => {
  // Handle logout
  res.json({ message: "Logout route" });
};
