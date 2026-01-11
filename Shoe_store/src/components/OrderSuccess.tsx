import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";




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
}



const OrderSuccess: React.FC = () => {
  
  const { id } = useParams();

  
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    let alive = true; 
    (async () => {
      try {
        
        const res = await fetch(`/api/orders/${id}`);
        
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
              "Failed to load order"
          );
          if (alive) setError(message);
        } else if (alive) {
          
          setOrder(data as Order);
        }
      } catch (e) {
        
        if (alive) setError(String((e as Error).message || e));
      }
    })();

    
    return () => {
      alive = false;
    };
  }, [id]);

  

  
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

  
  if (!order)
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <p>Loading order...</p>
      </div>
    );

  
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Order #{order.id}</h2>
      <ul className="divide-y">
        {order.items.map((it, idx) => (
          <li key={idx} className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-gray-600">
                ฿{it.price} × {it.qty}
                {it.size != null && (
                  <span className="ml-2">size: {String(it.size)}</span>
                )}
              </div>
            </div>
            <div className="font-semibold">
              ฿{(it.price * it.qty).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
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
      <div className="mt-4">
        <Link className="underline text-blue-700" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
