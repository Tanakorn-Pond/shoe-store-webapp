import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

// รายการสินค้าในออเดอร์หนึ่งรายการ
interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  size?: string | number;
}

// ออเดอร์ (คำสั่งซื้อ)
interface Order {
  id: number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt?: string;
}

// รายการออเดอร์ในแอดมิน
const AdminOrders: React.FC = () => {
  // เก็บรายการออเดอร์ที่โหลดมาจาก
  const [orders, setOrders] = useState<Order[]>([]);

  // เก็บข้อความ error ถ้าโหลดไม่สำเร็จ
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูลออเดอร์จาก
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // ดึงออเดอร์ทั้งหมด
        const res = await fetch(`/api/orders`);
        const text = await res.text();
        let data: unknown = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text || null;
        }

        if (!res.ok) {
          const message = String(
            (data && typeof data === "object" && "message" in (data as object)
              ? (data as { message?: unknown }).message
              : undefined) ??
              res.statusText ??
              "Failed to load orders"
          );
          if (alive) setError(message); // บันทึก error เพื่อแสดงบนหน้า
        } else if (alive) {
          setOrders(Array.isArray(data) ? (data as Order[]) : []);
        }
      } catch (e) {
        if (alive) setError(String((e as Error).message || e));
      }
    })();
    // cleanup: เมื่อคอมโพเนนต์ถูก unmount ไม่ให้ setState ต่อ
    return () => {
      alive = false;
    };
  }, []); // ทำงานครั้งเดียวตอน mount

  // ส่วนแสดงผล
  return (
    <AdminLayout title="Orders">
      {/* ถ้ามี error จะแสดงข้อความสีแดงด้านบน */}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {/* ถ้ายังไม่มีออเดอร์ แสดงกล่องข้อความว่าง */}
      {orders.length === 0 ? (
        <div className="bg-white border rounded p-4">No orders.</div>
      ) : (
        // ถ้ามีออเดอร์ แสดงเป็นตาราง
        <div className="bg-white border rounded overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-2">ID</th> {/* เลขที่ออเดอร์ */}
                <th className="p-2">Items</th> {/* รายการสินค้าในออเดอร์ */}
                <th className="p-2">Total</th> {/* ยอดรวมสุทธิของออเดอร์ */}
                <th className="p-2">Status</th> {/* สถานะออเดอร์ */}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  {/* คอลัมน์เลขที่ออเดอร์ */}
                  <td className="p-2">{o.id}</td>

                  {/* คอลัมน์รายการสินค้า: loop แสดงสินค้าทุกชิ้นในออเดอร์ */}
                  <td className="p-2">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="text-xs">
                        {it.name} × {it.qty}
                        {/* แสดงไซซ์ถ้ามี */}
                        {it.size != null && (
                          <span className="ml-1">(size {String(it.size)})</span>
                        )}
                      </div>
                    ))}
                  </td>

                  {/* คอลัมน์ยอดรวมสุทธิ (format เป็นทศนิยม 2 ตำแหน่ง แบบ THB) */}
                  <td className="p-2">฿{Number(o.total).toFixed(2)}</td>

                  {/* คอลัมน์สถานะออเดอร์ (แสดงเป็น badge) */}
                  <td className="p-2">
                    <span className="inline-flex text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
