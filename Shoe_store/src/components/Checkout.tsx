import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart } from "../store/cartSlice";

const Checkout: React.FC = () => {
  
  const { user } = useAppSelector((s) => s.auth);
  
  const items = useAppSelector((s) => s.cart.items);
  
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();

  
  const [note, setNote] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);

  
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  
  const shipping = 0; 
  
  const total = subtotal + shipping;

  
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

  
  const placeOrder = async () => {
    setError(null); 
    setLoading(true); 
    try {
      
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
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
            "Failed to place order"
        );
        setError(message); 
      } else {
        
        const orderId = Number((data as { id?: number })?.id ?? 0);
        
        dispatch(clearCart());
        
        navigate(`/orders/${orderId}`);
      }
    } catch (e) {
      
      setError(String((e as Error).message || e));
    } finally {
      
      setLoading(false);
    }
  };

  
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
      <div className="mb-4">
        <div className="text-sm text-gray-600">Logged in as</div>
        <div className="font-medium">{user.email}</div>
      </div>
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
      {error && <div className="mt-3 text-red-600">{error}</div>}
      <div className="mt-4 flex gap-2">
        <button
          onClick={placeOrder}
          disabled={loading} 
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
