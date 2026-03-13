import { create } from 'zustand';
import api from '@/lib/api';

interface CartItem {
  _id: string;
  medicine: {
    _id: string;
    name: string;
    image: string;
    brand: string;
    mrp: number;
  };
  pharmacy: {
    _id: string;
    name: string;
    address: string;
  };
  qty: number;
}

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  fetchCart: (token: string) => Promise<void>;
  addItem: (token: string, medicine: string, pharmacy: string, qty: number) => Promise<void>;
  updateQty: (token: string, id: string, qty: number) => Promise<void>;
  removeItem: (token: string, id: string) => Promise<void>;
  clearCart: (token: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  loading: false,

  fetchCart: async (token) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ cartItems: data.cartItems || [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (token, medicine, pharmacy, qty) => {
    try {
      await api.post(`/cart`, { medicine, pharmacy, qty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      get().fetchCart(token);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  },

  updateQty: async (token, id, qty) => {
    try {
      await api.put(`/cart/${id}`, { qty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      get().fetchCart(token);
    } catch (error) {
      console.error('Error updating cart qty:', error);
    }
  },

  removeItem: async (token, id) => {
    try {
      await api.delete(`/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      get().fetchCart(token);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  },

  clearCart: async (token) => {
    try {
      await api.delete(`/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ cartItems: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
}));
