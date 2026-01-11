
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ShoeForm from "./ShoeForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts, deleteProduct } from "../store/productSlice";
import type { Product } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";

const ShoeList: React.FC = () => {
  const dispatch = useAppDispatch(); 

  
  const products = useAppSelector(
    (state) => state.products.products as Product[] 
  );
  const loading = useAppSelector((state) => state.products.loading as boolean); 
  const error = useAppSelector(
    (state) => state.products.error as string | null 
  );

  
  const [editingShoe, setEditingShoe] = useState<Product | undefined>(
    undefined 
  );
  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, string | number | undefined> 
  >({});
  const [search, setSearch] = useState(""); 
  const [brand, setBrand] = useState<string | null>(null); 
  const [sortBy, setSortBy] = useState<"new" | "price-asc" | "price-desc">(
    "new" 
  );

  
  const user = useAppSelector((s) => s.auth.user);
  const role = user?.role?.toLowerCase();
  const isStaff = role === "staff" || role === "admin"; 

  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  
  useEffect(() => {
    console.log("ShoeList state:", { products, loading, error });
  }, [products, loading, error]);

  
  const handleEdit = (shoe: Product) => setEditingShoe(shoe);
  const handleCancelEdit = () => setEditingShoe(undefined);

  
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(), 
    [products]
  );

  
  const filtered = useMemo(() => {
    let list = [...products]; 

    
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    
    if (brand) list = list.filter((p) => p.brand === brand);

    
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => Number(a.price) - Number(b.price)); 
        break;
      case "price-desc":
        list.sort((a, b) => Number(b.price) - Number(a.price)); 
        break;
      default:
        
        list.sort((a, b) => {
          const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bd - ad;
        });
    }
    return list;
  }, [products, search, brand, sortBy]);

  
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(Number(n || 0));

  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Shop</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or brand"
            className="border rounded px-3 py-2 w-64"
          />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "new" | "price-asc" | "price-desc")
            }
            className="border rounded px-2 py-2"
          >
            <option value="new">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && (
        <p className="text-center text-red-600">Error: {String(error)}</p>
      )}
      {brands.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setBrand(null)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              brand === null ? "bg-gray-900 text-white" : "hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                brand === b ? "bg-gray-900 text-white" : "hover:bg-gray-100"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No shoes found.</p>
      ) : (
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((shoe) => (
            <div
              key={shoe.id}
              className="bg-white rounded-lg border hover:shadow-sm transition overflow-hidden"
            >
              <Link to={`/shoes/${shoe.id}`} className="block">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {shoe.images && shoe.images.length > 0 ? (
                    <img
                      src={shoe.images[0]} 
                      alt={shoe.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">No image</span> 
                  )}
                </div>
              </Link>
              <div className="p-3">
                <div className="text-xs text-gray-500">{shoe.brand}</div>
                <Link
                  to={`/shoes/${shoe.id}`}
                  className="font-medium truncate hover:underline"
                  title={shoe.name}
                >
                  {shoe.name}
                </Link>
                <div className="text-sm text-gray-700">
                  {formatPrice(shoe.price)}
                </div>
                {shoe.sizes && shoe.sizes.length > 0 && (
                  <select
                    className="mt-2 w-full border rounded px-2 py-1 text-sm"
                    value={String(selectedSizes[shoe.id] ?? "")} 
                    onChange={(e) =>
                      setSelectedSizes((s) => ({
                        ...s,
                        [shoe.id]: e.target.value, 
                      }))
                    }
                  >
                    <option value="">Select size</option>
                    {shoe.sizes.map((sz) => (
                      <option key={sz} value={String(sz)}>
                        {sz}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() =>
                    dispatch(
                      addToCart({
                        product: shoe, 
                        qty: 1, 
                        size: selectedSizes[shoe.id], 
                      })
                    )
                  }
                  disabled={shoe.stock <= 0} 
                  className="mt-2 w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {shoe.stock <= 0 ? "Out of stock" : "Add to Cart"}
                </button>
                {isStaff && (
                  <div className="flex justify-between text-xs mt-2">
                    <button
                      onClick={() => handleEdit(shoe)} 
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteProduct(shoe.id))} 
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {editingShoe && (
        <div className="mt-6">
          <ShoeForm editingShoe={editingShoe} onCancelEdit={handleCancelEdit} />
        </div>
      )}
    </div>
  );
};

export default ShoeList; 
