import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Product } from "../store/productSlice";
import { fetchProducts } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";


const currency = (n: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(
    Number(n || 0)
  );

const ProductDetail: React.FC = () => {
  
  const { id } = useParams();
  const productId = Number(id);

  const dispatch = useAppDispatch();
  
  const products = useAppSelector((s) => s.products.products);

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string | number | undefined>(undefined);
  const [qty, setQty] = useState(1);

  
  const fromStore = useMemo(
    () => products.find((p) => p.id === productId) || null,
    [products, productId]
  );

  useEffect(() => {
    let alive = true; 

    
    if (fromStore) {
      setProduct(fromStore);
      setSize(fromStore.sizes?.[0]);
      return; 
    }

    
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(String(data?.message || res.statusText));
        if (alive) {
          setProduct(data as Product);
          
          setSize(
            Array.isArray((data as Product).sizes)
              ? (data as Product).sizes[0]
              : undefined
          );
        }
      } catch (e) {
        if (alive) setError(String((e as Error).message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    
    if (!products.length) dispatch(fetchProducts());

    
    return () => {
      alive = false;
    };
  }, [dispatch, fromStore, productId, products.length]);

  
  if (loading)
    return <div className="min-h-[60vh] grid place-items-center">Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!product) return <div className="text-gray-600">Product not found.</div>;

  return (
    <div>
      <nav className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:underline">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="/shoes/list" className="hover:underline">
          Shop
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400">
              No image
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          {product.brand && (
            <div className="mt-1 text-gray-500">{product.brand}</div>
          )}
          <div className="mt-3 text-xl font-semibold">
            {currency(product.price)}
          </div>
          {product.sizes?.length ? (
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">Size</label>
              <select
                className="border rounded-md px-3 py-2"
                value={String(size ?? "")}
                onChange={(e) => setSize(e.target.value)}
              >
                {product.sizes.map((s, i) => (
                  <option key={i} value={String(s)}>
                    {String(s)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <div className="inline-flex items-center border rounded-md overflow-hidden">
              <button
                type="button"
                className="px-3 py-1 hover:bg-gray-50"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-4 select-none">{qty}</span>
              <button
                type="button"
                className="px-3 py-1 hover:bg-gray-50"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>
          <button
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-black text-white h-12 px-6 font-semibold hover:opacity-90 disabled:opacity-60"
            onClick={() => dispatch(addToCart({ product, qty, size }))}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? "Out of stock" : "Add to Cart"}
          </button>
          {product.description && (
            <p className="mt-6 text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
