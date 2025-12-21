// นำเข้า configureStore จาก Redux Toolkit
// ฟังก์ชันนี้ใช้สร้าง "Redux store" ซึ่งเป็นศูนย์กลางเก็บสถานะของแอปทั้งหมด
import { configureStore } from "@reduxjs/toolkit";

// import reducers (แต่ละส่วนของ state)
// แต่ละ slice จะดูแลข้อมูลของตัวเอง เช่น product, user, cart
import productReducer from "./productSlice"; // ดูแลสินค้ารองเท้า
import authReducer from "./authSlice"; // ดูแลข้อมูลผู้ใช้ (login/logout)
import cartReducer from "./cartSlice"; // ดูแลข้อมูลตะกร้าสินค้า

// สร้าง store หลักของแอป
const store = configureStore({
  reducer: {
    // ชื่อ key คือชื่อ state ที่จะเห็นใน Redux
    products: productReducer, // state.products จะเก็บข้อมูลสินค้าทั้งหมด
    auth: authReducer, // state.auth จะเก็บข้อมูลผู้ใช้ที่ล็อกอิน
    cart: cartReducer, // state.cart จะเก็บข้อมูลตะกร้าสินค้า
  },
});

// export store เพื่อให้ React app ใช้ได้ทั้งระบบ
// โดยเราจะนำไปครอบ <Provider store={store}> ใน main.tsx หรือ index.tsx
export default store;

// สร้าง type สำหรับ RootState และ AppDispatch
// เพื่อให้ TypeScript รู้จักชนิดของข้อมูลใน store ทั้งหมด

// RootState → ตัวแทน type ของ state ทั้งหมดในแอป
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch → type ของ dispatch function
// ใช้คู่กับ useAppDispatch() เพื่อให้ TypeScript ช่วยตรวจสอบ action
export type AppDispatch = typeof store.dispatch;
