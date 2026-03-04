import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  coupon: null,
  total: 0,
  subtotoal: 0,
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

  addToCart: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.post("/cart", { productId });
      if (!res.data.success) {
        set({ loading: false });
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }
      set({ cart: res.data.cart, loading: false });
      toast.success(res.data.message || "Product added to cart");
      get().calculateTotals();
    } catch (error) {
      set({ loading: false });
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
}));
