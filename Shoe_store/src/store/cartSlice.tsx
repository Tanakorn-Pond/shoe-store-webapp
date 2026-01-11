
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "./productSlice"; 


export interface CartItem {
  productId: number; 
  name: string; 
  price: number; 
  qty: number; 
  size?: string | number; 
}


interface CartState {
  items: CartItem[]; 
}


const STORAGE_KEY = "cartItems";


function loadItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    
    return [];
  }
}


function saveItems(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    
  }
}


const initialState: CartState = {
  
  items: typeof window !== "undefined" ? loadItems() : [],
};


const cartSlice = createSlice({
  name: "cart", 
  initialState, 
  reducers: {
    
    addToCart(
      state,
      action: PayloadAction<{
        product: Product; 
        qty?: number; 
        size?: string | number; 
      }>
    ) {
      const { product, qty = 1, size } = action.payload;

      
      const keyMatch = (i: CartItem) =>
        i.productId === product.id && (i.size ?? null) === (size ?? null);

      
      const existing = state.items.find(keyMatch);

      if (existing) {
        
        existing.qty += qty;
      } else {
        
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
          size,
        });
      }

      
      saveItems(state.items);
    },

    
    updateQty(
      state,
      action: PayloadAction<{
        productId: number; 
        size?: string | number; 
        qty: number; 
      }>
    ) {
      const { productId, size, qty } = action.payload;

      
      const item = state.items.find(
        (i) => i.productId === productId && (i.size ?? null) === (size ?? null)
      );

      if (item) {
        
        item.qty = Math.max(1, qty);
        saveItems(state.items);
      }
    },

    
    removeItem(
      state,
      action: PayloadAction<{ productId: number; size?: string | number }>
    ) {
      const { productId, size } = action.payload;

      
      state.items = state.items.filter(
        (i) =>
          !(i.productId === productId && (i.size ?? null) === (size ?? null))
      );

      saveItems(state.items);
    },

    
    clearCart(state) {
      state.items = [];
      saveItems(state.items);
    },
  },
});


export const { addToCart, updateQty, removeItem, clearCart } =
  cartSlice.actions;


export default cartSlice.reducer;
