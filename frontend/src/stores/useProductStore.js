import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  featuredProducts: [],

  fetchFeaturedProducts: async () => {},

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      if (!res.data.success) {
        set({ loading: false });
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }
      set((state) => ({
        products: [...state.products, res.data.product],
        loading: false,
      }));
      toast.success(res.data.message || "Product created successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  },
}));
