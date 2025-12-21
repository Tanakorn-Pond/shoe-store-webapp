import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart } from "../store/cartSlice";

const Checkout: React.FC = () => {
  // อ่านข้อมูลผู้ใช้ที่ล็อกอินอยู่จาก Redux (เช่น user.id, user.email)
  const { user } = useAppSelector((s) => s.auth);
  // อ่านรายการสินค้าในตะกร้า
  const items = useAppSelector((s) => s.cart.items);
  // hook ใช้เปลี่ยนหน้า
  const navigate = useNavigate();
  // ใช้ส่ง action ไปยัง Redux
  const dispatch = useAppDispatch();

  // note: ข้อความหมายเหตุจากลูกค้า (optional)
  const [note, setNote] = useState("");
  // เก็บข้อความ error กรณีสั่งซื้อไม่สำเร็จ
  const [error, setError] = useState<string | null>(null);
  // สถานะกำลังส่งคำสั่งซื้อ (ป้องกันกดซ้ำ)
  const [loading, setLoading] = useState(false);

  // คำนวณยอดรวมสินค้า (ไม่รวมค่าส่ง)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  // ค่าส่ง (ตอนนี้ให้ฟรี)
  const shipping = 0; // free shipping for now
  // ยอดสุทธิ = สินค้ารวม + ค่าส่ง
  const total = subtotal + shipping;

  // ถ้ายังไม่ล็อกอิน ให้บอกให้ไป Login ก่อนสั่งซื้อ
  if (!user) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Checkout</h2>
        <p className="mb-4">Please login before placing an order.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ถ้าตะกร้าว่าง ไม่สามารถเช็คเอาท์ได้ ให้ชวนกลับไปช้อปต่อ
  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Checkout</h2>
        <p>Your cart is empty.</p>
        <button
          onClick={() => navigate("/shoes/list")}
          className="mt-3 underline text-blue-700"
        >
          Back to shopping
        </button>
      </div>
    );
  }

  // ฟังก์ชันยืนยันสั่งซื้อ: ยิง POST ไป /api/orders
  const placeOrder = async () => {
    setError(null); // ล้าง error เดิม
    setLoading(true); // เปิดสถานะกำลังดำเนินการ
    try {
      // เรียก API สร้างออเดอร์ใหม่
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ส่งข้อมูลที่จำเป็น: userId, items, shipping, note
        body: JSON.stringify({
          userId: user.id,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty,
            size: i.size,
          })),
          shipping,
          note,
        }),
      });

      // อ่าน response เป็นข้อความไว้ก่อน (กันกรณี backend ส่ง non-JSON)
      const text = await res.text();
      let data: unknown = null;
      try {
        // พยายาม parse เป็น JSON ถ้าได้ก็เก็บไว้ใน data
        data = text ? JSON.parse(text) : null;
      } catch {
        // ถ้า parse ไม่ได้ให้เก็บเป็น string (ใช้โชว์ error ได้)
        data = text || null;
      }

      // จัดการกรณีไม่สำเร็จ (status code ไม่ใช่ 2xx)
      if (!res.ok) {
        // พยายามหยิบ message จาก body ถ้ามี ไม่มีก็ใช้ statusText หรือ fallback
        const message = String(
          (data && typeof data === "object" && "message" in (data as object)
            ? (data as { message?: unknown }).message
            : undefined) ??
            (typeof data === "string" ? data : undefined) ??
            res.statusText ??
            "Failed to place order"
        );
        setError(message); // แสดง error ให้ผู้ใช้
      } else {
        // สำเร็จ: ดึง orderId จาก response (เช่น { id: 123 })
        const orderId = Number((data as { id?: number })?.id ?? 0);
        // เคลียร์ตะกร้า
        dispatch(clearCart());
        // ไปหน้าแสดงรายละเอียดออเดอร์ที่เพิ่งสั่ง
        navigate(`/orders/${orderId}`);
      }
    } catch (e) {
      // กรณี network error หรือ exception อื่น ๆ
      setError(String((e as Error).message || e));
    } finally {
      // ปิดสถานะกำลังดำเนินการเสมอ
      setLoading(false);
    }
  };

  // UI หลักของหน้า Checkout
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      {/* แสดงข้อมูลผู้ใช้ที่ล็อกอินอยู่ */}
      <div className="mb-4">
        <div className="text-sm text-gray-600">Logged in as</div>
        <div className="font-medium">{user.email}</div>
      </div>

      {/* ช่องให้ลูกค้าใส่หมายเหตุเพิ่มเติม */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">
          Note (optional)
        </label>
        <textarea
          className="w-full border rounded p-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      {/* สรุปยอดเงิน */}
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Subtotal</span>
          <span>฿{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Shipping</span>
          <span>฿{shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold mt-2">
          <span>Total</span>
          <span>฿{total.toFixed(2)}</span>
        </div>
      </div>

      {/* แสดงข้อความผิดพลาดถ้ามี */}
      {error && <div className="mt-3 text-red-600">{error}</div>}

      {/* ปุ่มยืนยันสั่งซื้อ และปุ่มกลับไปตะกร้า */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={placeOrder}
          disabled={loading} // ปิดปุ่มระหว่างกำลังส่ง
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="px-4 py-2 border rounded"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
};

export default Checkout;
