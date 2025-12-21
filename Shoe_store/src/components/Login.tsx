import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/authSlice";

const Login: React.FC = () => {
  // เก็บค่าจากฟอร์ม: อีเมล / รหัสผ่าน
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // เก็บข้อความผิดพลาดจากการล็อกอิน (ถ้ามี)
  const [error, setError] = useState<string | null>(null);
  // สถานะกำลังส่งคำขอ (ป้องกันการกดซ้ำ และโชว์ข้อความกำลังทำงาน)
  const [loading, setLoading] = useState(false);
  // toggle แสดง/ซ่อนรหัสผ่าน
  const [showPw, setShowPw] = useState(false);

  // สำหรับนำทางไปหน้าต่าง ๆ
  const navigate = useNavigate();
  // สำหรับยิง action ไป Redux
  const dispatch = useAppDispatch();

  // ฟังก์ชันเมื่อกด submit ฟอร์มล็อกอิน
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // กันรีเฟรชหน้า
    setError(null); // ล้าง error เดิม
    setLoading(true); // เปิดสถานะกำลังโหลด

    try {
      // เรียก API ล็อกอิน ส่งอีเมล/รหัสผ่านไปที่ backend
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // อ่าน response เป็นข้อความไว้ก่อน (รองรับกรณี backend ส่ง non-JSON)
      const text = await res.text();

      // พยายาม parse เป็น JSON ถ้าไม่สำเร็จจะเก็บเป็น string
      let data: unknown = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text || null;
      }

      // ถ้า status code ไม่ใช่ 2xx ถือว่าล้มเหลว → สกัดข้อความ error เพื่อแสดง
      if (!res.ok) {
        const message = String(
          (data && typeof data === "object" && "message" in (data as object)
            ? (data as { message?: unknown }).message
            : undefined) ??
            (typeof data === "string" ? data : undefined) ??
            res.statusText ??
            "Login failed"
        );
        setError(message);
      } else {
        // ตรวจสอบโครงสร้าง response ให้แน่ใจว่ามี id และ email ก่อนจะ setUser
        const obj: unknown = data;
        const hasUserShape = !!(
          obj &&
          typeof obj === "object" &&
          "id" in (obj as Record<string, unknown>) &&
          "email" in (obj as Record<string, unknown>)
        );

        // ถ้า payload ไม่ถูกต้อง แสดงข้อความผิดพลาด (ภาษาไทย)
        if (!hasUserShape) {
          let extracted: string | undefined;
          if (
            obj &&
            typeof obj === "object" &&
            "message" in (obj as Record<string, unknown>) &&
            typeof (obj as Record<string, unknown>)["message"] === "string"
          ) {
            extracted = (obj as Record<string, unknown>)["message"] as string;
          }
          const message = String(extracted ?? "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          setError(message);
        } else {
          // แปลงข้อมูลผู้ใช้ให้เป็นชนิดที่ต้องการ และส่งเข้า Redux
          const user = obj as {
            id: number;
            email: string;
            name?: string;
            role?: string;
          };
          dispatch(
            setUser({
              id: Number(user.id),
              email: String(user.email),
              name: user.name,
              role: user.role,
            })
          );
          // ล็อกอินสำเร็จ → ไปหน้าแรกของเว็บไซต์
          navigate("/");
        }
      }
    } catch (err) {
      // กรณีเครือข่ายล้มเหลวหรือ error อื่น ๆ
      setError(String((err as Error).message || err));
    } finally {
      // ปิดสถานะกำลังโหลดเสมอ
      setLoading(false);
    }
  };

  return (
    // กล่องกลางหน้าสำหรับฟอร์มล็อกอิน
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-sm">
        {/* พื้นที่โลโก้ (คอมเมนต์ไว้เพื่อปรับใช้ภายหลัง) */}
        <div className="flex justify-center mb-4">
          {/* <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-lg">
            ●
          </div> */}
        </div>

        {/* หัวข้อและคำอธิบาย */}
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          ลงชื่อเข้าใช้บัญชีของคุณเพื่อดำเนินการต่อ
        </p>

        {/* แสดงข้อความ error ถ้ามี */}
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}

        {/* ฟอร์มล็อกอิน */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* ช่องอีเมล */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-700">อีเมล</label>
            </div>
            <input
              type="email" // บังคับให้เป็นรูปแบบอีเมล
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>

          {/* ช่องรหัสผ่าน + ปุ่มสลับแสดง/ซ่อนรหัสผ่าน */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-700">รหัสผ่าน</label>
              <span className="text-xs text-gray-400">&nbsp;</span>
            </div>
            <div className="mt-1 relative">
              <input
                type={showPw ? "text" : "password"} // toggle แสดง/ซ่อนรหัสผ่าน
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20 pr-10"
              />
              {/* ปุ่มกดแสดง/ซ่อนรหัสผ่าน (ไอคอนตา) */}
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="toggle password"
              >
                {showPw ? "👁️" : "👁️"}
              </button>
            </div>
          </div>

          {/* ปุ่มส่งฟอร์ม (เข้าสู่ระบบ) */}
          <button
            type="submit"
            disabled={loading} // ปิดปุ่มระหว่างกำลังส่งคำขอ
            className="w-full bg-black text-white py-2.5 rounded-md hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          {/* ลิงก์ไปหน้าสมัครสมาชิก */}
          <p className="text-center text-sm text-gray-600">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <button
              type="button"
              className="text-gray-900 underline hover:no-underline"
              onClick={() => navigate("/register")}
            >
              สมัครบัญชีใหม่
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
