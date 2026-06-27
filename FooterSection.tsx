import { create } from "zustand";

interface CartState {
  isOpen: boolean;
  itemCount: number;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  setItemCount: (count: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  itemCount: 0,

  setOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setItemCount: (count) => set({ itemCount: count }),
}));
