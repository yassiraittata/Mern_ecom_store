import product from "../models/product.model.js";

export const getAllProducts = async (req, res, next) => {
  const products = await product.find({});

  res.status(200).json({
    success: true,
    products,
  });
};
