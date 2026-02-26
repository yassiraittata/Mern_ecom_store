import Product from "../models/product.model";

export const getCartProducts = async (req, res, next) => {
  const products = await Product.find({
    _id: { $in: req.user.cartItems.map((item) => item.product) },
  });

  const items = products.map((product) => {
    const item = req.user.cartItems.find(
      (cartItem) => cartItem.product.toString() === product._id.toString(),
    );
    return {
      ...product.toJSON(),
      quantity: item ? item.quantity : 0,
    };
  });

  res.json({
    success: true,
    cart: items,
  });
};

export const addToCart = async (req, res, next) => {
  const { productId } = req.body;

  const user = req.user;

  const existingProduct = user.cartItems.find(
    (item) => item.product === productId,
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    user.cartItems.push({ product: productId, quantity: 1 });
  }

  await user.save();

  res.json({
    success: true,
    message: "Product added to cart",
    cart: user.cartItems,
  });
};

export const removeAllFromCart = async (req, res, next) => {
  const user = req.user;
  const { productId } = req.body;

  user.cartItems = user.cartItems.filter((item) => item.product !== productId);

  await user.save();
  res.json({
    success: true,
    message: "Product removed from cart",
    cart: user.cartItems,
  });
};

export const updateQuantity = async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const user = req.user;

  const existingItem = user.cartItems.find(
    (item) => item.product.toString() === id,
  );

  if (existingItem) {
    if (quantity === 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== id,
      );
      await user.save();
      return res.json({
        success: true,
        message: "Product removed from cart",
        cart: user.cartItems,
      });
    } else {
      existingItem.quantity = quantity;
      await user.save();
      return res.json({
        success: true,
        message: "Cart updated",
        cart: user.cartItems,
      });
    }
  }
};
