import React from "react";
import AdminLayout from "./AdminLayout";
import ShoeForm from "../ShoeForm";

// สร้างหน้าชื่อ AdminAddShoe สำหรับให้แอดมินเพิ่มสินค้ารองเท้าใหม่
const AdminAddShoe: React.FC = () => {
  return (
    // ใช้หน้า layout ของแอดมิน เพื่อให้หน้านี้อยู่ในโครงเดียวกับหน้าอื่น ๆ ของระบบแอดมิน
    // แล้วตั้งชื่อหัวข้อของหน้านี้ว่า "Add New Product"
    <AdminLayout title="Add New Product">
      {/* จำกัดความกว้างของเนื้อหาไม่ให้ยืดเต็มจอ ดูเรียบร้อย */}
      <div className="max-w-xl">
        {/* ตรงนี้คือฟอร์มกรอกข้อมูลรองเท้า เช่น ชื่อ ราคา รูปภาพ ขนาด ฯลฯ */}
        <ShoeForm />
      </div>
    </AdminLayout>
  );
};

// ส่งออก component นี้ให้ไฟล์อื่น (เช่นไฟล์ router) เรียกมาใช้งานได้
export default AdminAddShoe;
