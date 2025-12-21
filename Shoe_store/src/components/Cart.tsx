import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeItem, updateQty } from "../store/cartSlice";

const Cart: React.FC = () => {
  // อ่านรายการสินค้าในตะกร้าจาก Redux state
  const items = useAppSelector((s) => s.cart.items);
  // ใช้ dispatch เพื่อยิง action ไปที่ Redux
  const dispatch = useAppDispatch();
  // ใช้เปลี่ยนหน้า เช่น ไป /checkout
  const navigate = useNavigate();

  // คำนวณราคารวมของสินค้าในตะกร้า (ไม่รวมค่าส่ง)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  // อ่านรายการสินค้าทั้งหมดจาก state เพื่อใช้ข้อมูลประกอบ (เช่น รูป/แบรนด์)
  const products = useAppSelector((s) => s.products.products);
  // ฟังก์ชันแปลงตัวเลขเป็นรูปแบบ THB (เช่น ฿1,234.00)
  const format = (n: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(Number(n || 0));

  // ถ้าตะกร้าว่าง แสดงหน้า "ตะกร้าของคุณว่าง"
  if (items.length === 0)
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <p>Your cart is empty.</p>
        <div className="mt-4">
          <Link to="/shoes/list" className="text-blue-600 underline">
            Continue shopping
          </Link>
        </div>
      </div>
    );

  // กรณีมีสินค้าในตะกร้า
  return (
    <div className="min-h-[75vh]">
      {/* หัวข้อหน้า */}
      <h2 className="text-2xl font-semibold mb-4">Your Bag</h2>

      {/* แบ่งกริด: ซ้าย = รายการสินค้า, ขวา = สรุปคำสั่งซื้อ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- รายการสินค้าในตะกร้า ---------- */}
        <div className="lg:col-span-2 space-y-3">
          {/* เผื่อกรณี state เปลี่ยนแล้วว่าง (ปกติบล็อกนี้จะไม่แสดงเพราะเช็คด้านบนแล้ว) */}
          {items.length === 0 && (
            <div className="bg-white rounded border p-6 text-center text-gray-600">
              Your bag is empty.
              <div className="mt-2">
                <Link
                  to="/shoes/list"
                  className="text-blue-600 hover:underline"
                >
                  Shop the latest arrivals →
                </Link>
              </div>
            </div>
          )}

          {/* ไล่แสดงสินค้าแต่ละชิ้นในตะกร้า */}
          {items.map((it) => {
            // หา product เต็มจากรายการทั้งหมดเพื่อใช้ข้อมูล เช่น รูป/แบรนด์
            const p = products.find((pp) => pp.id === it.productId);
            const img = p?.images?.[0]; // ใช้รูปแรกของสินค้า

            return (
              <div
                key={`${it.productId}-${it.size ?? "_"}`} // สร้าง key โดยผูกกับ product + size
                className="bg-white rounded border p-3 flex items-center gap-3"
              >
                {/* กล่องรูปสินค้า */}
                <div className="h-20 w-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {img ? (
                    <img
                      src={img}
                      alt={it.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </div>

                {/* ข้อมูลสินค้า (ชื่อ/แบรนด์/ไซซ์/ราคา) */}
                <div className="flex-1 min-w-0">
                  {/* ชื่อสินค้า (truncate ป้องกันชื่อยาวเกิน) */}
                  <div className="font-medium truncate" title={it.name}>
                    {it.name}
                  </div>
                  {/* แบรนด์ + ไซซ์ (ถ้ามี) */}
                  <div className="text-sm text-gray-600">
                    {p?.brand}
                    {it.size != null && (
                      <span className="ml-2">Size: {String(it.size)}</span>
                    )}
                  </div>
                  {/* ราคาต่อชิ้น (ไม่ใช่ยอดรวมของชิ้นนี้) */}
                  <div className="text-sm text-gray-700">
                    {format(it.price)}
                  </div>
                </div>

                {/* ตัวปรับจำนวน (Stepper) */}
                <div className="flex items-center gap-2">
                  {/* ปุ่มลบจำนวนลง 1 (ขั้นต่ำ 1) */}
                  <button
                    className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={() =>
                      dispatch(
                        updateQty({
                          productId: it.productId,
                          size: it.size,
                          qty: Math.max(1, it.qty - 1), // ไม่ให้ต่ำกว่า 1
                        })
                      )
                    }
                  >
                    -
                  </button>
                  {/* จำนวนปัจจุบัน */}
                  <span className="w-6 text-center">{it.qty}</span>
                  {/* ปุ่มเพิ่มจำนวน +1 */}
                  <button
                    className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={() =>
                      dispatch(
                        updateQty({
                          productId: it.productId,
                          size: it.size,
                          qty: it.qty + 1,
                        })
                      )
                    }
                  >
                    +
                  </button>
                </div>

                {/* ปุ่มลบสินค้าออกจากตะกร้า */}
                <button
                  className="ml-3 text-gray-400 hover:text-red-600"
                  title="Remove"
                  onClick={() =>
                    dispatch(
                      removeItem({ productId: it.productId, size: it.size })
                    )
                  }
                >
                  ×
                </button>
              </div>
            );
          })}

          {/* ลิงก์กลับไปช้อปต่อ */}
          <Link
            to="/shoes/list"
            className="inline-flex items-center text-sm text-gray-600 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* ---------- สรุปคำสั่งซื้อ (Order Summary) ---------- */}
        <div>
          <div className="bg-white rounded border p-4">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

            {/* แสดง Subtotal (รวมราคาสินค้าทั้งหมด) */}
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>

            {/* ค่าขนส่ง: ยังไม่คำนวณ ณ ขั้นนี้ */}
            <div className="flex justify-between text-sm text-gray-700 mt-1">
              <span>Shipping</span>
              <span className="text-gray-500">Calculated at next step</span>
            </div>

            <hr className="my-3" />

            {/* Total ตอนนี้เท่ากับ subtotal (เพราะยังไม่บวกค่าส่ง/ส่วนลด) */}
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{format(subtotal)}</span>
            </div>

            {/* ใส่โค้ดส่วนลด (ยังไม่มี logic ประมวลผลจริง) */}
            <div className="mt-4">
              <label className="text-sm text-gray-700">Promo Code</label>
              <div className="flex gap-2 mt-1">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Enter code"
                />
                <button className="px-3 py-2 rounded border hover:bg-gray-50">
                  Apply
                </button>
              </div>
            </div>

            {/* ปุ่มไปหน้า Checkout — ปิดการใช้งานถ้าตะกร้าว่าง */}
            <button
              onClick={() => navigate("/checkout")}
              disabled={items.length === 0}
              className={`mt-4 w-full px-4 py-2 rounded ${
                items.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
