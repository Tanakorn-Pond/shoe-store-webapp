import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

// กำหนดชนิดของ props ที่รับเข้ามา — จะรับ children (คอมโพเนนต์ลูกที่อยู่ภายใน route)
interface Props {
  children: React.ReactElement;
}

// คอมโพเนนต์ AdminRoute ใช้สำหรับ "ป้องกันหน้าแอดมิน" (route guard)
// ให้เฉพาะผู้ใช้ที่ล็อกอินและมีสิทธิ์ staff หรือ admin เข้าถึงได้เท่านั้น
const AdminRoute: React.FC<Props> = ({ children }) => {
  // ดึงข้อมูลผู้ใช้จาก Redux store (state.auth.user)
  const user = useAppSelector((s) => s.auth.user);
  // ดึงข้อมูลตำแหน่งหน้า URL ปัจจุบัน (ใช้ตอน redirect กลับหลังล็อกอิน)
  const location = useLocation();

  // ตรวจสอบกรณีผู้ใช้ยังไม่ล็อกอิน
  if (!user) {
    // ถ้ายังไม่มีข้อมูล user → ส่งกลับไปหน้า /login
    // พร้อม state.from เพื่อให้ล็อกอินเสร็จจะกลับมาหน้าเดิมได้
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ตรวจสอบสิทธิ์ role ของผู้ใช้
  // แปลง role เป็นตัวพิมพ์เล็ก เช่น "Admin" → "admin"
  const role = user.role?.toLowerCase();
  // ให้สิทธิ์เข้าหน้านี้เฉพาะคนที่ role เป็น staff หรือ admin
  const isStaff = role === "staff" || role === "admin";

  // ถ้าไม่ใช่ staff หรือ admin → ส่งกลับหน้าแรกของเว็บ (หน้าลูกค้า)
  if (!isStaff) {
    return <Navigate to="/" replace />;
  }

  // ถ้าผ่านทุกเงื่อนไข → แสดงคอมโพเนนต์ลูกที่อยู่ภายใน route (เช่นหน้าแอดมิน)
  return children;
};

// ส่งออก component เพื่อใช้งานในระบบ route
export default AdminRoute;
