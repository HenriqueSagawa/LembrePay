import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem("@lembrepay:token");
      const userStr = await AsyncStorage.getItem("@lembrepay:user");
      const user = userStr ? JSON.parse(userStr) : null;

      set({
        token,
        user,
        isAuthenticated: !!token,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { token } = response.data;

      const payload = JSON.parse(atob(token.split(".")[1]));

      const user: User = {
        id: payload.userId,
        name: email.split("@")[0],
        email,
      };

      await AsyncStorage.setItem("@lembrepay:token", token);
      await AsyncStorage.setItem("@lembrepay:user", JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Erro ao fazer login. Tente novamente.";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({ name, email, password });
      const user = response.data;

      const loginResponse = await authAPI.login({ email, password });
      const { token } = loginResponse.data;

      const fullUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      await AsyncStorage.setItem("@lembrepay:token", token);
      await AsyncStorage.setItem("@lembrepay:user", JSON.stringify(fullUser));

      set({
        token,
        user: fullUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Erro ao criar conta. Tente novamente.";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("@lembrepay:token");
    await AsyncStorage.removeItem("@lembrepay:user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  clearError: () => set({ error: null }),
}));
