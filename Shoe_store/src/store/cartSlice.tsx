// ใช้ Redux Toolkit เพื่อสร้าง slice สำหรับตะกร้าสินค้า
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "./productSlice"; // ใช้ type ของสินค้า

// โครงสร้างข้อมูลของสินค้าแต่ละชิ้นในตะกร้า
export interface CartItem {
  productId: number; // id ของสินค้า
  name: string; // ชื่อสินค้า
  price: number; // ราคาต่อชิ้น
  qty: number; // จำนวนที่เพิ่มเข้าตะกร้า
  size?: string | number; // ไซซ์ที่เลือก (เช่น 39, 40)
}

// โครงสร้าง state หลักของ cart
interface CartState {
  items: CartItem[]; // รายการสินค้าในตะกร้า
}

// ชื่อ key ที่ใช้เก็บข้อมูลใน localStorage
const STORAGE_KEY = "cartItems";

// ฟังก์ชันโหลดข้อมูลจาก localStorage (ตอนเปิดเว็บ)
function loadItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // ถ้ามีข้อมูล → แปลงจาก JSON เป็น array
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    // ถ้า error (ข้อมูลเสียหรือ JSON พัง) → คืน array ว่าง
    return [];
  }
}

// ฟังก์ชันบันทึกข้อมูล cart ลงใน localStorage
function saveItems(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ถ้า storage เต็ม หรือถูกปิดการใช้งาน → ไม่ต้องทำอะไร
  }
}

// สถานะเริ่มต้น (initial state)
const initialState: CartState = {
  // โหลดจาก localStorage ถ้าอยู่ฝั่ง browser
  items: typeof window !== "undefined" ? loadItems() : [],
};

// เริ่มสร้าง slice ของ cart
const cartSlice = createSlice({
  name: "cart", // ชื่อของ slice
  initialState, // ค่าตั้งต้น
  reducers: {
    // เพิ่มสินค้าลงตะกร้า
    addToCart(
      state,
      action: PayloadAction<{
        product: Product; // ข้อมูลสินค้าเต็ม
        qty?: number; // จำนวน (ถ้าไม่ส่ง → = 1)
        size?: string | number; // ไซซ์ (optional)
      }>
    ) {
      const { product, qty = 1, size } = action.payload;

      // ฟังก์ชันเช็คว่าสินค้าชิ้นนี้ (id+size) มีอยู่ในตะกร้าแล้วหรือไม่
      const keyMatch = (i: CartItem) =>
        i.productId === product.id && (i.size ?? null) === (size ?? null);

      // หาสินค้าชิ้นเดิมในตะกร้า (ถ้ามี)
      const existing = state.items.find(keyMatch);

      if (existing) {
        // ถ้ามีอยู่แล้ว → เพิ่มจำนวน
        existing.qty += qty;
      } else {
        // ถ้ายังไม่มี → เพิ่มสินค้าใหม่ในตะกร้า
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
          size,
        });
      }

      // บันทึกลง localStorage ทุกครั้งหลังเปลี่ยนแปลง
      saveItems(state.items);
    },

    // อัปเดตจำนวนสินค้าในตะกร้า
    updateQty(
      state,
      action: PayloadAction<{
        productId: number; // id ของสินค้า
        size?: string | number; // ไซซ์ (ถ้ามี)
        qty: number; // จำนวนใหม่
      }>
    ) {
      const { productId, size, qty } = action.payload;

      // หาสินค้าที่ต้องการอัปเดต
      const item = state.items.find(
        (i) => i.productId === productId && (i.size ?? null) === (size ?? null)
      );

      if (item) {
        // ป้องกันไม่ให้จำนวนต่ำกว่า 1
        item.qty = Math.max(1, qty);
        saveItems(state.items);
      }
    },

    // ลบสินค้าออกจากตะกร้า
    removeItem(
      state,
      action: PayloadAction<{ productId: number; size?: string | number }>
    ) {
      const { productId, size } = action.payload;

      // ใช้ filter เอาสินค้าชิ้นนั้นออก
      state.items = state.items.filter(
        (i) =>
          !(i.productId === productId && (i.size ?? null) === (size ?? null))
      );

      saveItems(state.items);
    },

    // 🧹 ล้างตะกร้าทั้งหมด
    clearCart(state) {
      state.items = [];
      saveItems(state.items);
    },
  },
});

// export action สำหรับใช้ใน component อื่น
export const { addToCart, updateQty, removeItem, clearCart } =
  cartSlice.actions;

// export reducer เพื่อให้ store ใช้งานได้
export default cartSlice.reducer;
