import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });

      if (!res.data.success) {
        set({ loading: false });
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }

      set({ user: res.data.user, loading: false });
      toast.success("Account created successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to create account");
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      if (!res.data.success) {
        set({ loading: false });
        return toast.error(
          res.data.message || "Something went wrong. Please try again.",
        );
      }

      set({ user: res.data.user, loading: false });
      toast.success("Logged in successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to login");
    }
  },
}));
