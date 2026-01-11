import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts, deleteProduct } from "../../store/productSlice";


const format = (n: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(
    Number(n || 0)
  );


const AdminDashboard: React.FC = () => {
  
  const dispatch = useAppDispatch();
  
  const navigate = useNavigate();
  
  const products = useAppSelector((s) => s.products.products);

  
  useEffect(() => {
    
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
    
    
  }, [dispatch, products?.length]);

  return (
    <AdminLayout title="Dashboard">
      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Manage Products</h2>
          <Link
            to="/shoes/new"
            className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded hover:bg-gray-900"
          >
            + Add New Product
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div className="max-h-[480px] overflow-y-auto pr-2">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-600 sticky top-0 z-10 bg-gray-50">
                <tr className="border-b">
                  <th className="p-2">Image</th>
                  <th className="p-2">Product Name</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  
                  const img = p.images?.[0];
                  
                  const sku = `${p.brand?.[0]?.toUpperCase() ?? "P"}-${String(
                    p.id
                  ).padStart(4, "0")}`;
                  return (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="p-2">
                        <div className="h-10 w-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          {img ? (
                            
                            <img
                              src={img}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            
                            <span className="text-gray-400 text-xs">
                              No image
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="font-medium text-gray-900">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-500">{p.brand}</div>
                      </td>
                      <td className="p-2 text-gray-700">{sku}</td>
                      <td className="p-2">{format(p.price)}</td>
                      <td className="p-2">{p.stock}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-blue-600 hover:underline text-sm"
                            onClick={() => navigate(`/shoes/${p.id}/edit`)}
                            title="Edit shoe"
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline text-sm"
                            onClick={() => dispatch(deleteProduct(p.id))}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <RecentOrders />
    </AdminLayout>
  );
};

export default AdminDashboard;


const statusColor = (s: string) => {
  const k = s?.toLowerCase?.() ?? "";
  if (k.includes("deliver")) return "bg-emerald-100 text-emerald-700"; 
  if (k.includes("ship")) return "bg-blue-100 text-blue-700"; 
  if (k.includes("pend")) return "bg-amber-100 text-amber-700"; 
  if (k.includes("cancel")) return "bg-rose-100 text-rose-700"; 
  return "bg-gray-100 text-gray-700"; 
};


const RecentOrders: React.FC = () => {
  
  const [orders, setOrders] = React.useState<
    { id: number; total: number; status: string; createdAt?: string }[]
  >([]);

  
  React.useEffect(() => {
    let alive = true; 
    (async () => {
      try {
        
        const res = await fetch("/api/orders");
        const json = await res.json();
        
        if (alive)
          setOrders(Array.isArray(json) ? json.slice(-4).reverse() : []);
      } catch {
        
      }
    })();
    
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mt-6 bg-white border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
      {orders.length === 0 ? (
        <div className="text-sm text-gray-500">No recent orders.</div>
      ) : (
        
        <ul className="divide-y">
          {orders.map((o) => (
            <li key={o.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-xs text-gray-500">
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString()
                    : ""}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">{format(o.total)}</div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${statusColor(
                    o.status
                  )}`}
                >
                  {o.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
