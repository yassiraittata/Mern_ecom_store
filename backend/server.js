import express from "express";
import env from "./utils/envalidate.js";

const app = express();
const PORT = env.PORT || 5000;

// Middleware
app.use(express.json());

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
