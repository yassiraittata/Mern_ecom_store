import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  isLoading: false,

  fetchProducts: async (category = null) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(
        `/products${category ? `?category=${category}` : ""}`,
      );
      set({ products: res.data.products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/products/featured");
      set({ featuredProducts: res.data.products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Failed to fetch featured products",
      );
    }
  },
}));
