import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeItem, updateQty } from "../store/cartSlice";

const Cart: React.FC = () => {
  
  const items = useAppSelector((s) => s.cart.items);
  
  const dispatch = useAppDispatch();
  
  const navigate = useNavigate();

  
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  
  const products = useAppSelector((s) => s.products.products);
  
  const format = (n: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(Number(n || 0));

  
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

  
  return (
    <div className="min-h-[75vh]">
      <h2 className="text-2xl font-semibold mb-4">Your Bag</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
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
          {items.map((it) => {
            
            const p = products.find((pp) => pp.id === it.productId);
            const img = p?.images?.[0]; 

            return (
              <div
                key={`${it.productId}-${it.size ?? "_"}`} 
                className="bg-white rounded border p-3 flex items-center gap-3"
              >
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
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" title={it.name}>
                    {it.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {p?.brand}
                    {it.size != null && (
                      <span className="ml-2">Size: {String(it.size)}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    {format(it.price)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={() =>
                      dispatch(
                        updateQty({
                          productId: it.productId,
                          size: it.size,
                          qty: Math.max(1, it.qty - 1), 
                        })
                      )
                    }
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{it.qty}</span>
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
          <Link
            to="/shoes/list"
            className="inline-flex items-center text-sm text-gray-600 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>
        <div>
          <div className="bg-white rounded border p-4">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mt-1">
              <span>Shipping</span>
              <span className="text-gray-500">Calculated at next step</span>
            </div>

            <hr className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{format(subtotal)}</span>
            </div>
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
