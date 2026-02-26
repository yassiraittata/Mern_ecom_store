import stripe from "../lib/stripe.js";
import couponModel from "../models/coupon.model.js";
import env from "../utils/envalidate.js";

export const createCheckoutSession = async (req, res, next) => {
  const { products, couponCode } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return next(createHttpError(400, "No products provided for checkout!"));
  }

  let totalAmount = 0;

  const lineItems = products.map((item) => {
    const amount = Math.round(item.price * 100);
    totalAmount += amount * item.quantity;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: amount,
      },
    };
  });

  let coupon = null;
  if (couponCode) {
    coupon = await couponModel.findOne({
      code: couponCode,
      isActive: true,
      userId: req.user._id,
    });

    if (coupon) {
      totalAmount -= Math.round(
        (totalAmount * coupon.discountPercentage) / 100,
      );
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${env.FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/checkout-cancelled`,
    discounts: coupon
      ? [
          {
            coupon: await createStripeCoupon(coupon.discountPercentage),
          },
        ]
      : [],
    metadata: {
      userId: req.user._id.toString(),
      couponCode: couponCode || "",
    },
  });

  if (totalAmount >= 20000) {
    await createNewCoupon(req.user._id);
  }

  res.status(200).json({
    success: true,
    sessionId: session.id,
    totalAmount: totalAmount / 100,
  });
};

const createStripeCoupon = async (discountPercentage) => {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
};

const createNewCoupon = async (userId) => {
  const newCoupon = new couponModel({
    userId,
    code: `DISCOUNT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  await newCoupon.save();
  return newCoupon;
};
