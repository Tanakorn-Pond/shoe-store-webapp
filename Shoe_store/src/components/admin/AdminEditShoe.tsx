import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/productSlice";
import ShoeForm from "../ShoeForm";
import AdminLayout from "./AdminLayout";

// คอมโพเนนต์หน้าสำหรับ "แก้ไขสินค้า" ของผู้ดูแลระบบ
const AdminEditShoe: React.FC = () => {
  // ดึงค่าพารามิเตอร์ id จาก URL เช่น /shoes/3/edit → id = "3"
  const { id } = useParams();
  // ใช้สำหรับเปลี่ยนหน้า (ไปกลับหรือไปหน้าอื่น)
  const navigate = useNavigate();
  // ใช้ dispatch เพื่อเรียก action ของ Redux
  const dispatch = useAppDispatch();
  // ดึงข้อมูลสินค้าทั้งหมดจาก state ของ Redux
  const products = useAppSelector((s) => s.products.products);

  // แปลง id ที่ได้จาก URL ให้เป็นตัวเลข
  const productId = Number(id);
  // ค้นหาสินค้าที่ต้องการแก้ไขจากรายการทั้งหมดใน Redux store
  const editing = products.find((p) => p.id === productId);

  // เมื่อ component โหลดขึ้นมา ถ้ายังไม่เจอสินค้านี้ ให้โหลดข้อมูลสินค้าทั้งหมด
  useEffect(() => {
    if (!editing) {
      // เรียก action fetchProducts() เพื่อโหลดข้อมูลจาก backend
      dispatch(fetchProducts());
    }
  }, [dispatch, editing]); // ทำงานใหม่ถ้ามีการเปลี่ยน dispatch หรือ editing

  // ส่วนแสดงผลของหน้า
  return (
    // ใช้ layout หลักของหน้าแอดมิน และตั้งชื่อหน้าเป็น "Edit Product"
    <AdminLayout title="Edit Product">
      {editing ? (
        // ถ้าพบสินค้าที่ต้องการแก้ไข
        <div className="max-w-xl">
          {/* แสดงฟอร์มแก้ไขสินค้า โดยส่งข้อมูลสินค้าปัจจุบันไปใน prop editingShoe */}
          {/* และเมื่อกดยกเลิก ให้กลับไปหน้า /backend */}
          <ShoeForm
            editingShoe={editing}
            onCancelEdit={() => navigate("/backend")}
          />
        </div>
      ) : (
        // ถ้ายังโหลดสินค้าไม่เสร็จ (ไม่มีข้อมูลสินค้าใน state)
        <div className="text-gray-600">Loading product...</div>
      )}
    </AdminLayout>
  );
};

// ส่งออก component เพื่อใช้ในส่วนอื่นของโปรเจกต์
export default AdminEditShoe;
