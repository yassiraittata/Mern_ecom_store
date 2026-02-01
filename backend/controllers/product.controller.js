import createHttpError from "http-errors";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res, next) => {
  const products = await Product.find({});

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

export const createProduct = async (req, res, next) => {
  const { name, description, price, image, category } = req.body;

  let cloudinaryRes = null;

  if (image) {
    const cloudinaryRes = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
  }

  const newProduct = await Product.create({
    name,
    description,
    price,
    image: cloudinaryRes?.secure_url || "",
    category,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: newProduct,
  });
};
