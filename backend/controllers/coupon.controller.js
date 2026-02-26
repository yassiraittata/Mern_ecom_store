import Coupon from "../models/coupon.model";

export const getCoupon = async (req, res, next) => {
  const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

  if (!coupon) {
    return next(createHttpError(404, "No active coupon found!"));
  }

  res.status(200).json({
    success: true,
    coupon: coupon || null,
  });
};

export const validateCoupon = async (req, res, next) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({
    code,
    isActive: true,
    userId: req.user._id,
  });

  if (!coupon) {
    return next(createHttpError(404, "Invalid or expired coupon!"));
  }

  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    return next(createHttpError(400, "Coupon has expired!"));
  }

  res.status(200).json({
    success: true,
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  });
};
