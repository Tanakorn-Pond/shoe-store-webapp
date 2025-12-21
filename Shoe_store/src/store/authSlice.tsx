// นำเข้า createSlice และ PayloadAction จาก Redux Toolkit
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// กำหนดรูปแบบข้อมูลของผู้ใช้ (AuthUser)
export interface AuthUser {
  id: number; // รหัสผู้ใช้ (เช่น 1, 2, 3)
  email: string; // อีเมลที่ใช้ล็อกอิน
  name?: string; // ชื่อจริง (optional)
  role?: string; // สิทธิ์ เช่น "user", "staff", "admin"
}

// state หลักของ slice นี้ (ข้อมูลผู้ใช้ที่ล็อกอินอยู่)
interface AuthState {
  user: AuthUser | null; // ถ้ามีคนล็อกอิน → เก็บข้อมูล user, ถ้าออก → เป็น null
}

// ชื่อ key ที่ใช้เก็บใน localStorage (สำหรับจำสถานะล็อกอิน)
const STORAGE_KEY = "authUser";

// ฟังก์ชันโหลดข้อมูลผู้ใช้จาก localStorage (ตอนเปิดเว็บใหม่)
function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY); // อ่านค่าจาก storage
    // ถ้ามีข้อมูล → แปลงจาก JSON กลับเป็น object
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    // ถ้ามี error (เช่น JSON เสียหาย) → คืนค่า null
    return null;
  }
}

// ฟังก์ชันบันทึกผู้ใช้ลงใน localStorage (ใช้ตอน login / logout)
function saveUser(user: AuthUser | null) {
  try {
    if (user)
      // ถ้ามีข้อมูล user → เก็บใน localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    // ถ้า logout → ลบออกจาก storage
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ถ้ามี error จาก browser เช่น ปิดการใช้ localStorage → ไม่ต้องทำอะไร
  }
}

// state เริ่มต้น (initial state)
const initialState: AuthState = {
  // ถ้ามี window object (คืออยู่ฝั่ง client) → โหลดข้อมูลผู้ใช้จาก localStorage
  user: typeof window !== "undefined" ? loadUser() : null,
};

// สร้าง slice สำหรับจัดการการล็อกอิน/ออกจากระบบ
const authSlice = createSlice({
  name: "auth", // ชื่อของ slice (ใช้เป็น prefix ของ action type)
  initialState, // ค่าเริ่มต้น
  reducers: {
    // Action: ตั้งค่าผู้ใช้ (ใช้ตอน login สำเร็จ)
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload; // บันทึกผู้ใช้ใน state
      saveUser(action.payload); // เก็บใน localStorage เพื่อจำสถานะ
    },

    // Action: logout (ล้างข้อมูลผู้ใช้)
    logout(state) {
      state.user = null; // เคลียร์ user ออกจาก state
      saveUser(null); // ลบออกจาก localStorage
    },
  },
});

// export actions เพื่อนำไปใช้ใน component
export const { setUser, logout } = authSlice.actions;

// export reducer เพื่อนำไปใช้ใน store
export default authSlice.reducer;
