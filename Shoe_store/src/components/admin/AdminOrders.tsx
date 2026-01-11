import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";


interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  size?: string | number;
}


interface Order {
  id: number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt?: string;
}


const AdminOrders: React.FC = () => {
  
  const [orders, setOrders] = useState<Order[]>([]);

  
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        
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
          if (alive) setError(message); 
        } else if (alive) {
          setOrders(Array.isArray(data) ? (data as Order[]) : []);
        }
      } catch (e) {
        if (alive) setError(String((e as Error).message || e));
      }
    })();
    
    return () => {
      alive = false;
    };
  }, []); 

  
  return (
    <AdminLayout title="Orders">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {orders.length === 0 ? (
        <div className="bg-white border rounded p-4">No orders.</div>
      ) : (
        
        <div className="bg-white border rounded overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Items</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="p-2">{o.id}</td>
                  <td className="p-2">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="text-xs">
                        {it.name} × {it.qty}
                        {it.size != null && (
                          <span className="ml-1">(size {String(it.size)})</span>
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="p-2">฿{Number(o.total).toFixed(2)}</td>
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
