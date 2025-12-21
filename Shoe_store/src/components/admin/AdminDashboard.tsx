import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts, deleteProduct } from "../../store/productSlice";

// ฟังก์ชันแปลงตัวเลขเป็นรูปแบบสกุลเงินไทย (THB)
const format = (n: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(
    Number(n || 0)
  );

// คอมโพเนนต์หลักของหน้า Dashboard ผู้ดูแลระบบ
const AdminDashboard: React.FC = () => {
  // ใช้ dispatch เพื่อเรียก action ของ Redux
  const dispatch = useAppDispatch();
  // ใช้ navigate สำหรับเปลี่ยนหน้า เช่น ไปหน้าแก้ไขสินค้า
  const navigate = useNavigate();
  // ดึงข้อมูลสินค้าทั้งหมดจาก Redux state
  const products = useAppSelector((s) => s.products.products);

  // โหลดข้อมูลสินค้าเมื่อเปิดหน้า (หรือเมื่อจำนวนสินค้าเปลี่ยน)
  useEffect(() => {
    // ถ้ายังไม่มีสินค้าใน state ให้โหลดจาก backend
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
    // ปิด eslint เตือนเพราะต้องการให้ทำงานเฉพาะตอน mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, products?.length]);

  return (
    <AdminLayout title="Dashboard">
      {/* ส่วนจัดการสินค้า */}
      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          {/* หัวข้อส่วนจัดการสินค้า */}
          <h2 className="text-lg font-semibold">Manage Products</h2>
          {/* ปุ่มเพิ่มสินค้าใหม่ */}
          <Link
            to="/shoes/new"
            className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded hover:bg-gray-900"
          >
            + Add New Product
          </Link>
        </div>
        <div className="overflow-x-auto">
          {/* ส่วนตารางสินค้าพร้อม scrollbar แนวตั้ง */}
          <div className="max-h-[480px] overflow-y-auto pr-2">
            <table className="w-full text-sm">
              {/* ส่วนหัวตาราง */}
              <thead className="text-left text-gray-600 sticky top-0 z-10 bg-gray-50">
                <tr className="border-b">
                  <th className="p-2">Image</th>
                  <th className="p-2">Product Name</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              {/* เนื้อหาของตาราง (รายการสินค้าแต่ละแถว) */}
              <tbody>
                {products.map((p) => {
                  // ดึงรูปแรกของสินค้า (ถ้ามี)
                  const img = p.images?.[0];
                  // สร้างรหัส SKU เช่น N-0001 (ตัวอักษรแรกของ brand + id)
                  const sku = `${p.brand?.[0]?.toUpperCase() ?? "P"}-${String(
                    p.id
                  ).padStart(4, "0")}`;
                  return (
                    <tr key={p.id} className="border-b last:border-0">
                      {/* คอลัมน์รูปสินค้า */}
                      <td className="p-2">
                        <div className="h-10 w-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          {img ? (
                            // แสดงรูปถ้ามี
                            <img
                              src={img}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            // ถ้าไม่มีรูปให้แสดงข้อความ
                            <span className="text-gray-400 text-xs">
                              No image
                            </span>
                          )}
                        </div>
                      </td>
                      {/* คอลัมน์ชื่อสินค้าและแบรนด์ */}
                      <td className="p-2">
                        <div className="font-medium text-gray-900">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-500">{p.brand}</div>
                      </td>
                      {/* คอลัมน์ SKU */}
                      <td className="p-2 text-gray-700">{sku}</td>
                      {/* คอลัมน์ราคา */}
                      <td className="p-2">{format(p.price)}</td>
                      {/* คอลัมน์จำนวนคงเหลือ */}
                      <td className="p-2">{p.stock}</td>
                      {/* คอลัมน์ปุ่มแก้ไขและลบ */}
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {/* ปุ่มแก้ไขสินค้า */}
                          <button
                            className="text-blue-600 hover:underline text-sm"
                            onClick={() => navigate(`/shoes/${p.id}/edit`)}
                            title="Edit shoe"
                          >
                            Edit
                          </button>
                          {/* ปุ่มลบสินค้า */}
                          <button
                            className="text-red-600 hover:underline text-sm"
                            onClick={() => dispatch(deleteProduct(p.id))}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ส่วนแสดงคำสั่งซื้อใหม่ */}
      <RecentOrders />
    </AdminLayout>
  );
};

export default AdminDashboard;

// ฟังก์ชันกำหนดสีพื้นหลังตามสถานะของคำสั่งซื้อ
const statusColor = (s: string) => {
  const k = s?.toLowerCase?.() ?? "";
  if (k.includes("deliver")) return "bg-emerald-100 text-emerald-700"; // ส่งสำเร็จ
  if (k.includes("ship")) return "bg-blue-100 text-blue-700"; // กำลังจัดส่ง
  if (k.includes("pend")) return "bg-amber-100 text-amber-700"; // รอดำเนินการ
  if (k.includes("cancel")) return "bg-rose-100 text-rose-700"; // ยกเลิกแล้ว
  return "bg-gray-100 text-gray-700"; // อื่นๆ
};

// คอมโพเนนต์ย่อยสำหรับแสดงรายการคำสั่งซื้อใหม่
const RecentOrders: React.FC = () => {
  // state เก็บรายการคำสั่งซื้อ (id, total, status, createdAt)
  const [orders, setOrders] = React.useState<
    { id: number; total: number; status: string; createdAt?: string }[]
  >([]);

  // โหลดข้อมูลคำสั่งซื้อเมื่อ component เริ่มทำงาน
  React.useEffect(() => {
    let alive = true; // ตัวแปรกันไม่ให้ setState หลัง component ถูก unmount
    (async () => {
      try {
        // ดึงข้อมูลจาก API /api/orders
        const res = await fetch("/api/orders");
        const json = await res.json();
        // ถ้าได้ข้อมูลเป็น array ให้เอาเฉพาะ 4 รายการล่าสุด (reverse เพื่อให้ล่าสุดอยู่บน)
        if (alive)
          setOrders(Array.isArray(json) ? json.slice(-4).reverse() : []);
      } catch {
        /* ถ้ามี error จะไม่ทำอะไร */
      }
    })();
    // cleanup เมื่อ component ถูก unmount
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mt-6 bg-white border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
      {/* ถ้ายังไม่มีคำสั่งซื้อ */}
      {orders.length === 0 ? (
        <div className="text-sm text-gray-500">No recent orders.</div>
      ) : (
        // แสดงรายการคำสั่งซื้อ
        <ul className="divide-y">
          {orders.map((o) => (
            <li key={o.id} className="py-3 flex items-center justify-between">
              <div>
                {/* หมายเลขคำสั่งซื้อ */}
                <div className="font-medium">Order #{o.id}</div>
                {/* วันที่สั่งซื้อ */}
                <div className="text-xs text-gray-500">
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString()
                    : ""}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* ราคารวมของออเดอร์ */}
                <div className="text-sm text-gray-700">{format(o.total)}</div>
                {/* แสดงสถานะพร้อมสีพื้นหลังตาม statusColor */}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${statusColor(
                    o.status
                  )}`}
                >
                  {o.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
