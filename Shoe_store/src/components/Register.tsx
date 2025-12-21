import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  // เก็บค่าในฟอร์ม: อีเมล ชื่อ รหัสผ่าน และยืนยันรหัสผ่าน
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // เก็บข้อความผิดพลาด (กรณีสมัครไม่สำเร็จ)
  const [error, setError] = useState<string | null>(null);
  // สถานะกำลังทำงาน (เพื่อป้องกันกดซ้ำ/เปลี่ยน UI)
  const [loading, setLoading] = useState(false);
  // สำหรับนำทางไปหน้าต่าง ๆ
  const navigate = useNavigate();

  // ฟังก์ชันเมื่อส่งฟอร์มสมัครสมาชิก
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // กันรีเฟรชหน้า
    setError(null); // ล้าง error เดิม
    setLoading(true); // เปิดสถานะกำลังส่งคำขอ

    try {
      // ตรวจสอบรหัสผ่านสองช่องให้ตรงกันก่อนยิง API
      if (password !== confirm) {
        setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
        setLoading(false);
        return;
      }

      // เรียก API สมัครสมาชิก
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ส่งข้อมูลที่จำเป็น: email, name, password
        body: JSON.stringify({ email, name, password }),
      });

      // รองรับกรณี response เป็นข้อความเปล่า/ไม่ใช่ JSON
      const text = await res.text();
      let data: unknown = null;
      try {
        data = text ? JSON.parse(text) : null; // พยายาม parse เป็น JSON
      } catch {
        data = text || null; // ถ้า parse ไม่ได้เก็บเป็น string
      }

      // ถ้าไม่ใช่ 2xx ให้สร้างข้อความ error ที่เหมาะสม
      if (!res.ok) {
        let message = String(
          (data && typeof data === "object" && "message" in (data as object)
            ? (data as { message?: unknown }).message
            : undefined) ??
            (typeof data === "string" ? data : undefined) ??
            res.statusText ??
            "Register failed"
        );

        // แปลงข้อความทับกรณีอีเมลซ้ำซ้อน (HTTP 409 หรือข้อความบอกว่าเคยสมัครแล้ว)
        if (res.status === 409 || /already registered/i.test(message)) {
          message = "อีเมลนี้ถูกใช้แล้ว";
        }
        setError(message);
      } else {
        // สมัครสำเร็จ → พาไปหน้า Login
        navigate("/login");
      }
    } catch (err: unknown) {
      // กรณี network error หรือ error อื่น ๆ
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError(String(err));
      }
    } finally {
      // ปิดสถานะกำลังทำงานเสมอ
      setLoading(false);
    }
  };

  return (
    // กล่องจัดวางฟอร์มกลางหน้า
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* หัวเรื่องของหน้า */}
        <h1 className="text-center text-3xl font-semibold mb-6">สร้างบัญชี</h1>

        {/* การ์ดฟอร์ม */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm max-w-xl mx-auto">
          {/* แสดงข้อความผิดพลาด (ถ้ามี) */}
          {error && (
            <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
          )}

          {/* ฟอร์มสมัครสมาชิก */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ช่องชื่อ */}
            <div>
              <label className="block text-sm text-gray-700">ชื่อ</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="กรอกชื่อของคุณ"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            {/* ช่องอีเมล */}
            <div>
              <label className="block text-sm text-gray-700">อีเมล</label>
              <input
                type="email" // ตรวจรูปแบบอีเมลเบื้องต้น
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="yourname@example.com"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            {/* ช่องรหัสผ่าน */}
            <div>
              <label className="block text-sm text-gray-700">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8} // บังคับขั้นต่ำ 8 ตัวอักษร
                required
                placeholder="กรอกรหัสผ่านของคุณ"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            {/* ช่องยืนยันรหัสผ่าน */}
            <div>
              <label className="block text-sm text-gray-700">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8} // ต้องยาวเท่ากับเงื่อนไขรหัสผ่าน
                required
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            {/* ปุ่มส่งฟอร์ม */}
            <button
              type="submit"
              disabled={loading} // ปิดปุ่มระหว่างกำลังส่ง
              className="w-full bg-black text-white py-2.5 rounded-md hover:bg-gray-900 disabled:opacity-60"
            >
              {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
            </button>
          </form>

          {/* ลิงก์ไปหน้าเข้าสู่ระบบสำหรับผู้ที่มีบัญชีแล้ว */}
          <p className="text-center text-sm text-gray-600 mt-4">
            มีบัญชีอยู่แล้ว?{" "}
            <button
              type="button"
              className="text-gray-900 underline hover:no-underline"
              onClick={() => navigate("/login")}
            >
              เข้าสู่ระบบ
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
