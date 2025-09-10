import { create } from 'zustand';

type CartItem = {
  product_id: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (product_id: number, quantity?: number) => void;
  removeFromCart: (product_id: number) => void;
  clearCart: () => void;
  updateQuantity: (product_id: number, quantity: number) => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product_id, quantity = 1) => {
    const existing = get().items.find((item) => item.product_id === product_id);
    if (existing) {
      // update quantity if product already in cart
      set({
        items: get().items.map((item) =>
          item.product_id === product_id ? { ...item, quantity: item.quantity + quantity } : item
        ),
      });
    } else {
      set({
        items: [...get().items, { product_id, quantity }],
      });
    }
  },

  removeFromCart: (product_id) =>
    set({
      items: get().items.filter((item) => item.product_id !== product_id),
    }),

  updateQuantity: (product_id, quantity) =>
    set({
      items: get().items.map((item) =>
        item.product_id === product_id ? { ...item, quantity } : item
      ),
    }),

  clearCart: () => set({ items: [] }),
}));
