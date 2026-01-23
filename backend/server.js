import express from "express";
import env from "./utils/envalidate.js";
import createHttpError from "http-errors";
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./lib/db.js";

const app = express();
const PORT = env.PORT || 5000;

// Middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

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
