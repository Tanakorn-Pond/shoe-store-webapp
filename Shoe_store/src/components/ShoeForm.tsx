import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import {
  addProduct,
  updateProduct,
  fetchProducts,
} from "../store/productSlice";
import type { Product } from "../store/productSlice";

// กำหนด props ที่ component จะรับ
interface ShoeFormProps {
  editingShoe?: Product; // ถ้ามีค่านี้ แปลว่ากำลังแก้ไขสินค้า
  onCancelEdit?: () => void; // ฟังก์ชันเมื่อผู้ใช้กดยกเลิก
}

// เริ่มสร้าง Functional Component
const ShoeForm: React.FC<ShoeFormProps> = ({ editingShoe, onCancelEdit }) => {
  const dispatch = useAppDispatch(); // ใช้สำหรับเรียก action ของ Redux

  // สร้าง state เก็บข้อมูลในฟอร์มทั้งหมด
  const [name, setName] = useState(""); // ชื่อสินค้า
  const [description, setDescription] = useState(""); // รายละเอียดสินค้า
  const [price, setPrice] = useState<number>(0); // ราคา
  const [stock, setStock] = useState<number>(0); // จำนวนสต็อก
  const [brand, setBrand] = useState(""); // ยี่ห้อสินค้า
  const [sizes, setSizes] = useState<string>(""); // ไซซ์ (พิมพ์คั่นด้วย ,)
  const [images, setImages] = useState<string>(""); // ลิงก์รูปภาพ (คั่นด้วย ,)

  // useEffect ทำงานเมื่อค่า editingShoe เปลี่ยน
  useEffect(() => {
    if (editingShoe) {
      // ถ้ามี editingShoe → แสดงข้อมูลเก่าในช่องกรอก
      setName(editingShoe.name);
      setDescription(editingShoe.description);
      setPrice(editingShoe.price);
      setStock(editingShoe.stock);
      setBrand(editingShoe.brand);
      setSizes(editingShoe.sizes.join(",")); // แปลง array เป็นข้อความ
      setImages(editingShoe.images.join(","));
    } else {
      // ถ้าไม่มี (แปลว่าอยู่ในโหมดเพิ่มสินค้าใหม่) → เคลียร์ค่าทั้งหมด
      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
      setBrand("");
      setSizes("");
      setImages("");
    }
  }, [editingShoe]); // ทำงานใหม่เมื่อค่า editingShoe เปลี่ยน

  // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม Submit ฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ

    // สร้าง object ที่จะส่งไป backend หรือ Redux
    const productData: Product = {
      id: editingShoe?.id ?? 0, // ถ้าเป็นโหมดเพิ่มใหม่ → ให้ id = 0
      name,
      description,
      price,
      stock,
      brand,
      // แปลง string เป็น array ของตัวเลข (ไซซ์)
      sizes: sizes.split(",").map((s) => Number(s.trim())),
      // แปลง string เป็น array ของลิงก์รูป
      images: images.split(",").map((i) => i.trim()),
    };

    try {
      if (editingShoe) {
        // โหมดแก้ไขสินค้า
        await dispatch(updateProduct(productData)).unwrap(); // อัปเดตสินค้า
        await dispatch(fetchProducts()).unwrap(); // โหลดข้อมูลใหม่เพื่ออัปเดตหน้า
        onCancelEdit?.(); // เรียกฟังก์ชันยกเลิก (กลับไปหน้า list)
      } else {
        // โหมดเพิ่มสินค้าใหม่
        await dispatch(addProduct(productData)).unwrap(); // เพิ่มสินค้าใหม่
        await dispatch(fetchProducts()).unwrap(); // โหลดข้อมูลใหม่
        // เคลียร์ค่าทั้งหมดในฟอร์ม
        setName("");
        setDescription("");
        setPrice(0);
        setStock(0);
        setBrand("");
        setSizes("");
        setImages("");
      }
    } catch (err) {
      // ถ้ามี error จะ log ออกมา
      console.error("Error saving product:", err);
    }
  };

  // ส่วน UI ของฟอร์ม
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      {/* หัวข้อของฟอร์ม */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {editingShoe ? "Edit Shoe" : "Add New Shoe"}
      </h2>

      {/* ฟอร์มกรอกข้อมูล */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} // เมื่อพิมพ์จะอัปเดต state name
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))} // แปลงเป็น number ก่อนเก็บ
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-700">Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-gray-700">Brand:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-gray-700">
            Sizes (comma separated):
          </label>
          <input
            type="text"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 38, 39, 40" // ตัวอย่างการกรอก
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-700">
            Images (comma separated URLs):
          </label>
          <input
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. https://example.com/img1.jpg" // ตัวอย่างการกรอก URL
          />
        </div>

        {/* ปุ่ม Add / Update และ Cancel */}
        <div className="flex space-x-2">
          {/* ปุ่มหลัก (เพิ่มหรืออัปเดต) */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 grow">
            {editingShoe ? "Update" : "Add"}
          </button>

          {/* ปุ่ม Cancel (มีเฉพาะเวลาแก้ไขสินค้า) */}
          {editingShoe && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ส่งออก component เพื่อให้ไฟล์อื่นนำไปใช้
export default ShoeForm;
