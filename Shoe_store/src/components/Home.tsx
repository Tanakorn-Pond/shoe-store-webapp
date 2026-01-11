import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts, type Product } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { Link } from "react-router-dom";


const ProductGrid: React.FC<{ title: string; items: Product[] }> = ({
  title,
  items,
}) => {
  const dispatch = useAppDispatch();

  
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(Number(n || 0));

  
  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Link
          to="/shoes/list"
          className="text-blue-700 hover:underline text-sm"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.slice(0, 8).map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg border hover:shadow-sm transition overflow-hidden"
          >
            <Link to={`/shoes/${p.id}`} className="block">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
            </Link>
            <div className="p-3">
              <div className="text-sm text-gray-500">{p.brand}</div>
              <Link
                to={`/shoes/${p.id}`}
                className="font-medium truncate hover:underline"
                title={p.name}
              >
                {p.name}
              </Link>
              <div className="text-sm text-gray-700">
                {formatPrice(p.price)}
              </div>
              <button
                onClick={() => dispatch(addToCart({ product: p, qty: 1 }))}
                disabled={p.stock <= 0}
                className="mt-2 w-full bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {p.stock <= 0 ? "Out of stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { products, loading, error } = useAppSelector((s) => s.products);

  
  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchProducts());
    
  }, [dispatch, products?.length]);

  
  const byDateDesc = [...products].sort((a, b) => {
    const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bd - ad;
  });
  const newArrivals = byDateDesc.slice(0, 8); 

  
  const bestSellers = [...products]
    .sort(
      (a, b) =>
        (a.stock ?? 0) - (b.stock ?? 0) || Number(b.price) - Number(a.price)
    )
    .slice(0, 8);

  
  const brands = Array.from(new Set(products.map((p) => p.brand))).slice(0, 6);

  return (
    <div>
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900">
              THE FUTURE OF AIR IS HERE
            </h1>
            <p className="mt-3 text-gray-600 text-base sm:text-lg">
              Discover the latest collection of innovative and stylish footwear
              designed for ultimate comfort and performance.
            </p>
            <div className="mt-6 flex justify-center lg:justify-start">
              <Link
                to="/shoes/list"
                className="inline-flex items-center justify-center rounded-lg bg-black text-white h-12 px-6 font-bold hover:opacity-90"
              >
                Shop Now
              </Link>
              <Link
                to="/cart"
                className="ml-3 inline-flex items-center justify-center rounded-lg h-12 px-6 border border-gray-300 text-gray-900 hover:bg-gray-50"
              >
                View Cart
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div
              className="w-full aspect-video rounded-xl bg-center bg-cover bg-no-repeat shadow-sm"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop')",
              }}
            />
          </div>
        </div>
      </section>
      {loading && <div className="mt-6 text-gray-600">Loading products…</div>}
      {error && <div className="mt-6 text-red-600">{String(error)}</div>}
      {!loading && !error && (
        <>
          <section className="py-6 sm:py-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Recommended For You
            </h2>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pr-2">
                {(newArrivals.length ? newArrivals : bestSellers)
                  .slice(0, 12)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="min-w-64 sm:min-w-72 bg-white border rounded-lg shadow-sm flex flex-col"
                    >
                      <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-100">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col gap-2">
                        <div>
                          <p
                            className="text-base font-medium text-gray-900 truncate"
                            title={p.name}
                          >
                            {p.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            ฿{Number(p.price).toFixed(2)}
                          </p>
                        </div>
                        <Link
                          to={`/shoes/${p.id}`}
                          className="mt-auto inline-flex items-center justify-center h-10 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
          <ProductGrid title="New Arrivals" items={newArrivals} />
          <ProductGrid title="Best Sellers" items={bestSellers} />
          {brands.length > 0 && (
            <section className="mt-10">
              <h3 className="text-2xl font-bold mb-4 text-center sm:text-left">
                Shop By Brand
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {brands.map((b) => (
                  <Link
                    key={b}
                    to="/shoes/list"
                    className="border rounded-lg py-8 text-center hover:scale-[1.02] transition-transform bg-white"
                  >
                    <span className="font-semibold">{b}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
