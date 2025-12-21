import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// ประเภทข้อมูล (TypeScript)

// รายการสินค้าภายในออเดอร์หนึ่งใบ
interface OrderItem {
  productId: number; // รหัสสินค้า
  name: string; // ชื่อสินค้า
  price: number; // ราคาต่อชิ้น
  qty: number; // จำนวนที่สั่ง
  size?: string | number; // ไซซ์ (ถ้ามี)
}

// โครงสร้างข้อมูลออเดอร์
interface Order {
  id: number; // เลขที่ออเดอร์
  items: OrderItem[]; // รายการสินค้าในออเดอร์
  subtotal: number; // ราคารวมก่อนค่าส่ง
  shipping: number; // ค่าส่ง
  total: number; // ยอดรวมสุทธิ
  status: string; // สถานะออเดอร์ (ไม่ถูกใช้แสดงในหน้านี้ แต่เผื่อไว้)
}

// คอมโพเนนต์หลัก

const OrderSuccess: React.FC = () => {
  // อ่าน id ของออเดอร์จาก URL เช่น /orders/123 → id = "123"
  const { id } = useParams();

  // เก็บข้อมูลออเดอร์ที่โหลดมา / เก็บข้อความผิดพลาด
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูลออเดอร์เมื่อเปิดหน้า หรือเมื่อ id เปลี่ยน
  useEffect(() => {
    let alive = true; // ธงกัน setState หลัง unmount เพื่อป้องกัน memory leak
    (async () => {
      try {
        // เรียก API: ดึงข้อมูลออเดอร์ตาม id
        const res = await fetch(`/api/orders/${id}`);
        // อ่านเป็นข้อความไว้ก่อน เพื่อรองรับกรณี backend ส่ง non-JSON
        const text = await res.text();

        // พยายาม parse JSON; ถ้าไม่สำเร็จเก็บเป็น string
        let data: unknown = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text || null;
        }

        // ถ้าสถานะไม่ใช่ 2xx → แสดง error ข้อความจาก body.message ถ้ามี
        if (!res.ok) {
          const message = String(
            (data && typeof data === "object" && "message" in (data as object)
              ? (data as { message?: unknown }).message
              : undefined) ??
              res.statusText ??
              "Failed to load order"
          );
          if (alive) setError(message);
        } else if (alive) {
          // สำเร็จ: เซ็ตข้อมูลออเดอร์
          setOrder(data as Order);
        }
      } catch (e) {
        // จัดการ error จากเครือข่าย/อื่น ๆ
        if (alive) setError(String((e as Error).message || e));
      }
    })();

    // cleanup: เมื่อคอมโพเนนต์ถูก unmount
    return () => {
      alive = false;
    };
  }, [id]);

  // สถานะการแสดงผล

  // แสดงข้อความผิดพลาด (ถ้ามี)
  if (error)
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Order</h2>
        <p className="text-red-600">{error}</p>
        <Link className="underline text-blue-700" to="/">
          Back to home
        </Link>
      </div>
    );

  // ระหว่างกำลังโหลด (ยังไม่มีข้อมูลออเดอร์)
  if (!order)
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <p>Loading order...</p>
      </div>
    );

  // แสดงรายละเอียดออเดอร์
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      {/* หัวข้อ + เลขออเดอร์ */}
      <h2 className="text-xl font-semibold mb-4">Order #{order.id}</h2>

      {/* รายการสินค้าแต่ละชิ้น */}
      <ul className="divide-y">
        {order.items.map((it, idx) => (
          <li key={idx} className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-gray-600">
                ฿{it.price} × {it.qty}
                {/* โชว์ไซซ์ถ้ามี */}
                {it.size != null && (
                  <span className="ml-2">size: {String(it.size)}</span>
                )}
              </div>
            </div>
            {/* ราคารวมของรายการนี้ = price * qty */}
            <div className="font-semibold">
              ฿{(it.price * it.qty).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>

      {/* สรุปยอดเงิน */}
      <div className="border-t mt-4 pt-4">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Subtotal</span>
          <span>฿{Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Shipping</span>
          <span>฿{Number(order.shipping).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold mt-2">
          <span>Total</span>
          <span>฿{Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {/* ลิงก์กลับหน้าแรก */}
      <div className="mt-4">
        <Link className="underline text-blue-700" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
