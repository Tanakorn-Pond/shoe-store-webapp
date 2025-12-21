import React from "react";
import { NavLink, Link } from "react-router-dom";

// กำหนดชนิดของ props ที่ component นี้จะรับ
type Props = {
  title?: string; // ชื่อหัวข้อของหน้า (เช่น Dashboard, Orders)
  children: React.ReactNode; // ส่วนเนื้อหาภายในหน้า (component ลูก)
};

// คอมโพเนนต์ Layout สำหรับหน้าแอดมิน (หน้าผู้ดูแลระบบ)
const AdminLayout: React.FC<Props> = ({ title = "Dashboard", children }) => {
  // title มีค่าเริ่มต้นเป็น "Dashboard" ถ้าไม่มีการส่งค่ามา
  return (
    // กล่องครอบทั้งหมดของหน้า (พื้นหลังสีเทาอ่อน มีขอบโค้ง)
    <div className="min-h-[70vh] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      {/* ใช้ grid แบ่งหน้าออกเป็น 2 ส่วน: sidebar (ซ้าย) และ main (ขวา) */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* Sidebar ส่วนเมนูด้านซ้าย */}
        <aside className="bg-white border-r border-gray-200 p-4 space-y-6">
          {/* ส่วนหัวของ sidebar (ชื่อระบบ / ชื่อผู้ใช้) */}
          <div>
            <div className="font-semibold text-gray-900">ShoeStore Admin</div>
            <div className="text-xs text-gray-500">Staff Member</div>
          </div>

          {/* เมนูนำทาง (Navigation links) */}
          <nav className="space-y-1">
            {/* NavLink ไปหน้า Dashboard */}
            <NavLink
              to="/backend"
              className={({ isActive }) =>
                // ตรวจสอบว่าหน้านี้ active หรือไม่ เพื่อเปลี่ยนสีพื้นหลัง
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-gray-100 text-gray-900" // ถ้าหน้านี้เปิดอยู่
                    : "text-gray-700 hover:bg-gray-50" // ถ้าไม่เปิดอยู่
                }`
              }
            >
              Dashboard
            </NavLink>

            {/* NavLink ไปหน้า Orders */}
            <NavLink
              to="/backend/orders"
              className={({ isActive }) =>
                // เช่นเดียวกับด้านบน: ถ้าหน้า Orders ถูกเลือก จะเปลี่ยนสี
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              Orders
            </NavLink>
          </nav>

          {/* ลิงก์กลับไปยังหน้าร้านค้าหลัก */}
          <div className="pt-6 border-t">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Store
            </Link>
          </div>
        </aside>

        {/* Main ส่วนเนื้อหาด้านขวา */}
        <main className="p-6">
          {/* แสดงชื่อหัวข้อของหน้า (เช่น Dashboard หรือ Edit Product) */}
          <h1 className="text-2xl font-semibold mb-4">{title}</h1>
          {/* แสดงเนื้อหาของแต่ละหน้า (children คือ component ย่อยที่ถูกส่งมา) */}
          {children}
        </main>
      </div>
    </div>
  );
};

// ส่งออก component นี้เพื่อใช้ในไฟล์อื่น
export default AdminLayout;
