// import ฟังก์ชันหลักจาก react-redux
import { useDispatch, useSelector } from "react-redux";
// ใช้เพื่อบอก TypeScript ว่าตัว selector มีชนิดข้อมูลแบบไหน
import type { TypedUseSelectorHook } from "react-redux";
// import type ของ RootState และ AppDispatch จาก store หลัก (index.ts)
import type { RootState, AppDispatch } from ".";

// Custom hook สำหรับ dispatch
// ใช้แทน useDispatch()
// ทำให้เวลา dispatch action TypeScript จะรู้ว่าเรากำลังส่ง action ไหนได้บ้าง
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook สำหรับ selector
// เป็น useSelector() แบบที่รู้ type ของ RootState
// ใช้เลือกข้อมูลจาก Redux state ได้แบบปลอดภัย (มี auto-complete)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
