import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  featuredProducts: [],
  totalPages: 0,
  totalItems: 0,

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

  fetchAllProducts: async (page, limit) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products?page=${page}&limit=${limit}`);
      if (!res.data.success) {
        set({ loading: false });
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }
      set({
        products: res.data.products,
        loading: false,
        totalPages: res.data.totalPages,
        totalItems: res.data.totalItems,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      if (!res.data.success) {
        set({ loading: false });
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Failed to fetch products by category",
      );
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/products/${productId}`);
      if (!res.data.success) {
        set({ loading: false });
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success(res.data.message || "Product deleted successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/products/${productId}`);
      if (!res.data.success) {
        set({ loading: false });
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? res.data.product : product,
        ),
        loading: false,
      }));
      toast.success(
        res.data.message || "Product featured status toggled successfully!",
      );
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Failed to toggle featured status",
      );
    }
  },
}));
