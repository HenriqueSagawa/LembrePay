import { create } from "zustand";
import { subscriptionsAPI } from "../services/api";

export interface Subscription {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  billingCycle: "MONTHLY" | "YEARLY" | "CUSTOM";
  customIntervalDays: number | null;
  startDate: string;
  nextBillingDate: string;
  reminderDaysBefore: number;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  pagination: Pagination | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;

  fetchSubscriptions: (page?: number, pageSize?: number) => Promise<void>;
  createSubscription: (data: {
    name: string;
    description?: string;
    price: string;
    currency?: string;
    billingCycle: "MONTHLY" | "YEARLY" | "CUSTOM";
    customIntervalDays?: number;
    startDate: string;
    reminderDaysBefore?: number;
  }) => Promise<void>;
  deactivateSubscription: (id: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  pagination: null,
  isLoading: false,
  isCreating: false,
  error: null,

  fetchSubscriptions: async (page = 1, pageSize = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await subscriptionsAPI.list(page, pageSize);
      const { data, pagination } = response.data;

      if (page === 1) {
        set({ subscriptions: data, pagination, isLoading: false });
      } else {
        set((state) => ({
          subscriptions: [...state.subscriptions, ...data],
          pagination,
          isLoading: false,
        }));
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Erro ao carregar assinaturas.";
      set({ error: message, isLoading: false });
    }
  },

  createSubscription: async (data) => {
    set({ isCreating: true, error: null });
    try {
      await subscriptionsAPI.create(data);
      await get().fetchSubscriptions(1);
      set({ isCreating: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Erro ao criar assinatura.";
      set({ error: message, isCreating: false });
      throw new Error(message);
    }
  },

  deactivateSubscription: async (id: string) => {
    try {
      await subscriptionsAPI.deactivate(id);
      set((state) => ({
        subscriptions: state.subscriptions.filter((s) => s.id !== id),
      }));
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Erro ao desativar assinatura.";
      set({ error: message });
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      subscriptions: [],
      pagination: null,
      isLoading: false,
      isCreating: false,
      error: null,
    }),
}));
