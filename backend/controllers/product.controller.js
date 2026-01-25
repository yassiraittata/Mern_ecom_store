import createHttpError from "http-errors";
import product from "../models/product.model.js";
import redis from "../lib/redis.js";

export const getAllProducts = async (req, res, next) => {
  const products = await product.find({});

  res.status(200).json({
    success: true,
    products,
  });
};

export const getFeaturedProducts = async (req, res, next) => {
  // get data from redis cache
  let featuredProducts = await redis.get("featured_products");
  if (featuredProducts) {
    return res.status(200).json({
      success: true,
      featuredProducts: JSON.parse(featuredProducts),
    });
  }
  // get data from mongo db
  featuredProducts = await product.find({ isFeatured: true }).lean();
  if (!featuredProducts) {
    return next(createHttpError(404, "No featured products found"));
  }

  // store data in redis cache
  await redis.set("featured_products", JSON.stringify(featuredProducts));
  res.status(200).json({
    success: true,
    featuredProducts,
  });
};
