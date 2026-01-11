import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null); 
    setLoading(true); 

    try {
      
      if (password !== confirm) {
        setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
        setLoading(false);
        return;
      }

      
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ email, name, password }),
      });

      
      const text = await res.text();
      let data: unknown = null;
      try {
        data = text ? JSON.parse(text) : null; 
      } catch {
        data = text || null; 
      }

      
      if (!res.ok) {
        let message = String(
          (data && typeof data === "object" && "message" in (data as object)
            ? (data as { message?: unknown }).message
            : undefined) ??
            (typeof data === "string" ? data : undefined) ??
            res.statusText ??
            "Register failed"
        );

        
        if (res.status === 409 || /already registered/i.test(message)) {
          message = "อีเมลนี้ถูกใช้แล้ว";
        }
        setError(message);
      } else {
        
        navigate("/login");
      }
    } catch (err: unknown) {
      
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError(String(err));
      }
    } finally {
      
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-center text-3xl font-semibold mb-6">สร้างบัญชี</h1>
        <div className="bg-white border rounded-2xl p-8 shadow-sm max-w-xl mx-auto">
          {error && (
            <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="block text-sm text-gray-700">อีเมล</label>
              <input
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="yourname@example.com"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8} 
                required
                placeholder="กรอกรหัสผ่านของคุณ"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8} 
                required
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading} 
              className="w-full bg-black text-white py-2.5 rounded-md hover:bg-gray-900 disabled:opacity-60"
            >
              {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
            </button>
          </form>
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
