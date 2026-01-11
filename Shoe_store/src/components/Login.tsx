import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/authSlice";

const Login: React.FC = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  
  const [showPw, setShowPw] = useState(false);

  
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null); 
    setLoading(true); 

    try {
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      
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
            (typeof data === "string" ? data : undefined) ??
            res.statusText ??
            "Login failed"
        );
        setError(message);
      } else {
        
        const obj: unknown = data;
        const hasUserShape = !!(
          obj &&
          typeof obj === "object" &&
          "id" in (obj as Record<string, unknown>) &&
          "email" in (obj as Record<string, unknown>)
        );

        
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
          
          navigate("/");
        }
      }
    } catch (err) {
      
      setError(String((err as Error).message || err));
    } finally {
      
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-sm">
        <div className="flex justify-center mb-4">
        </div>
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          ลงชื่อเข้าใช้บัญชีของคุณเพื่อดำเนินการต่อ
        </p>
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-700">อีเมล</label>
            </div>
            <input
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-700">รหัสผ่าน</label>
              <span className="text-xs text-gray-400">&nbsp;</span>
            </div>
            <div className="mt-1 relative">
              <input
                type={showPw ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20 pr-10"
              />
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
          <button
            type="submit"
            disabled={loading} 
            className="w-full bg-black text-white py-2.5 rounded-md hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
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
