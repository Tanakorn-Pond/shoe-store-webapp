// แสดงรายการรองเท้า + ฟิลเตอร์ + ค้นหา + เพิ่มลงตะกร้า + (Admin) แก้ไข/ลบ
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ShoeForm from "./ShoeForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts, deleteProduct } from "../store/productSlice";
import type { Product } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";

const ShoeList: React.FC = () => {
  const dispatch = useAppDispatch(); // ใช้ส่ง action ไป Redux

  // ดึง state จาก Redux store
  const products = useAppSelector(
    (state) => state.products.products as Product[] // รายการสินค้า
  );
  const loading = useAppSelector((state) => state.products.loading as boolean); // สถานะโหลดข้อมูล
  const error = useAppSelector(
    (state) => state.products.error as string | null // error ขณะดึงข้อมูล
  );

  // state ภายในหน้า
  const [editingShoe, setEditingShoe] = useState<Product | undefined>(
    undefined // เก็บสินค้าที่กำลังแก้ไข (ถ้ามี)
  );
  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, string | number | undefined> // เก็บไซซ์ที่ผู้ใช้เลือกต่อสินค้า (key = product.id)
  >({});
  const [search, setSearch] = useState(""); // ข้อความค้นหา
  const [brand, setBrand] = useState<string | null>(null); // ยี่ห้อที่เลือกกรอง
  const [sortBy, setSortBy] = useState<"new" | "price-asc" | "price-desc">(
    "new" // วิธีการเรียง (ล่าสุด, ราคาต่ำ→สูง, ราคาสูง→ต่ำ)
  );

  // ตรวจ role ผู้ใช้เพื่อแสดงปุ่ม Edit/Delete
  const user = useAppSelector((s) => s.auth.user);
  const role = user?.role?.toLowerCase();
  const isStaff = role === "staff" || role === "admin"; // สิทธิ์จัดการสินค้า

  // โหลดสินค้าเมื่อ component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Debug log (เอาออกใน production)
  useEffect(() => {
    console.log("ShoeList state:", { products, loading, error });
  }, [products, loading, error]);

  // handler สำหรับโหมดแก้ไข
  const handleEdit = (shoe: Product) => setEditingShoe(shoe);
  const handleCancelEdit = () => setEditingShoe(undefined);

  // เตรียมข้อมูลยี่ห้อทั้งหมด (ไม่ซ้ำ) ด้วย useMemo เพื่อประหยัดการคำนวณ
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(), // unique + sort
    [products]
  );

  // สร้างรายการที่ผ่านการค้นหา/กรอง/เรียงแล้ว
  const filtered = useMemo(() => {
    let list = [...products]; // clone เพื่อไม่แก้ state ต้นฉบับ

    // ค้นหาจากชื่อหรือยี่ห้อ
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    // กรองตามยี่ห้อถ้ามีเลือก
    if (brand) list = list.filter((p) => p.brand === brand);

    // เรียงลำดับ
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => Number(a.price) - Number(b.price)); // ราคา: ต่ำไปสูง
        break;
      case "price-desc":
        list.sort((a, b) => Number(b.price) - Number(a.price)); // ราคา: สูงไปต่ำ
        break;
      default:
        // "new" → ล่าสุดก่อน (อิง createdAt ถ้าไม่มีให้ถือเป็น 0)
        list.sort((a, b) => {
          const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bd - ad;
        });
    }
    return list;
  }, [products, search, brand, sortBy]);

  // ฟังก์ชันฟอร์แมตราคาเป็นสกุล THB
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(Number(n || 0));

  // เริ่มส่วนแสดงผล
  return (
    <div className="w-full">
      {/* ส่วนหัว + ค้นหา + เรียง */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Shop</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* กล่องค้นหา */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or brand"
            className="border rounded px-3 py-2 w-64"
          />
          {/* ตัวเลือกการเรียง */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "new" | "price-asc" | "price-desc")
            }
            className="border rounded px-2 py-2"
          >
            <option value="new">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* แสดงสถานะกำลังโหลด / ผิดพลาด */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && (
        <p className="text-center text-red-600">Error: {String(error)}</p>
      )}

      {/* ปุ่มกรองตามยี่ห้อ */}
      {brands.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {/* ปุ่ม All */}
          <button
            onClick={() => setBrand(null)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              brand === null ? "bg-gray-900 text-white" : "hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {/* สร้างปุ่มตามยี่ห้อที่มี */}
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                brand === b ? "bg-gray-900 text-white" : "hover:bg-gray-100"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {/* ถ้าไม่มีสินค้าที่ผ่านการกรอง */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No shoes found.</p>
      ) : (
        // Grid รายการสินค้า
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((shoe) => (
            <div
              key={shoe.id}
              className="bg-white rounded-lg border hover:shadow-sm transition overflow-hidden"
            >
              {/* คลิกภาพ/ชื่อ ไปหน้า detail ของสินค้า */}
              <Link to={`/shoes/${shoe.id}`} className="block">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {shoe.images && shoe.images.length > 0 ? (
                    <img
                      src={shoe.images[0]} // ใช้รูปแรกเป็นภาพหน้าปก
                      alt={shoe.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // ถ้ารูปโหลดไม่ได้ ให้ซ่อนไว้ (เลี่ยงแตก)
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">No image</span> // ไม่มีรูป
                  )}
                </div>
              </Link>

              {/* เนื้อหาการ์ดสินค้า */}
              <div className="p-3">
                <div className="text-xs text-gray-500">{shoe.brand}</div>
                <Link
                  to={`/shoes/${shoe.id}`}
                  className="font-medium truncate hover:underline"
                  title={shoe.name}
                >
                  {shoe.name}
                </Link>
                <div className="text-sm text-gray-700">
                  {formatPrice(shoe.price)} {/* แสดงราคา */}
                </div>

                {/* ตัวเลือกไซซ์ (ถ้าสินค้ามีไซซ์) */}
                {shoe.sizes && shoe.sizes.length > 0 && (
                  <select
                    className="mt-2 w-full border rounded px-2 py-1 text-sm"
                    value={String(selectedSizes[shoe.id] ?? "")} // แสดงค่าที่เลือกไว้ต่อสินค้าชิ้นนี้
                    onChange={(e) =>
                      setSelectedSizes((s) => ({
                        ...s,
                        [shoe.id]: e.target.value, // เก็บไซซ์ที่เลือกไว้ใน state
                      }))
                    }
                  >
                    <option value="">Select size</option>
                    {shoe.sizes.map((sz) => (
                      <option key={sz} value={String(sz)}>
                        {sz}
                      </option>
                    ))}
                  </select>
                )}

                {/* ปุ่มเพิ่มลงตะกร้า */}
                <button
                  onClick={() =>
                    dispatch(
                      addToCart({
                        product: shoe, // ทั้ง object สินค้า
                        qty: 1, // จำนวนเริ่มต้น = 1
                        size: selectedSizes[shoe.id], // ไซซ์ที่เลือก (อาจว่างได้ถ้าไม่ได้เลือก)
                      })
                    )
                  }
                  disabled={shoe.stock <= 0} // ถ้าสต็อกหมดให้กดไม่ได้
                  className="mt-2 w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {shoe.stock <= 0 ? "Out of stock" : "Add to Cart"}
                </button>

                {/* ปุ่มจัดการสินค้า (เฉพาะ staff/admin) */}
                {isStaff && (
                  <div className="flex justify-between text-xs mt-2">
                    <button
                      onClick={() => handleEdit(shoe)} // เข้าโหมดแก้ไข
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteProduct(shoe.id))} // ลบสินค้า
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* แบบฟอร์มแก้ไขสินค้า โผล่ด้านล่างเมื่อเลือก Edit */}
      {editingShoe && (
        <div className="mt-6">
          <ShoeForm editingShoe={editingShoe} onCancelEdit={handleCancelEdit} />
        </div>
      )}
    </div>
  );
};

export default ShoeList; // ส่งออก component
