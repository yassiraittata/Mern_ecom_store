import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotoal: 0,
  isCouponApplied: false,
  setCart: (cart) => set({ cart }),

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      console.log("Cart Items Response:", res.data);
      set({ cart: res.data.cart });
      get().calculateTotals();
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch cart items !!!",
      );
    }
  },

  addToCart: async (product) => {
    try {
      const res = await axios.post("/cart", { productId: product._id });
      if (!res.data.success) {
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      toast.success(res.data.message || "Product added to cart");
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart",
      );
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity;
    }, 0);
    let total = subtotal;
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },

  removeFromCart: async (productId) => {
    try {
      const res = await axios.delete("/cart", { data: { productId } });

      if (!res.data.success) {
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }
      set((state) => ({
        cart: state.cart.filter((item) => item._id.toString() !== productId),
      }));
      get().calculateTotals();
      toast.success(res.data.message || "Product removed from cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove product from cart",
      );
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    try {
      const res = await axios.put(`/cart/${productId}`, { quantity });
      set((state) => ({
        cart: state.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item,
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  },
}));
