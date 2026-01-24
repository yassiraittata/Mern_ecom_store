import express from "express";
import cookieParser from "cookie-parser";
import createHttpError from "http-errors";

import env from "./utils/envalidate.js";
import connectDB from "./lib/db.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";

const app = express();
const PORT = env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint was not Found"));
});
app.use(errorHandler);

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
