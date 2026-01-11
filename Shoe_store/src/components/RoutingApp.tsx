import React from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";


import Home from "./Home";
import ShoeList from "./ShoeList";
import Login from "./Login";
import Register from "./Register";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import ProductDetail from "./ProductDetail";


import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";


import AdminRoute from "./admin/AdminRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminEditShoe from "./admin/AdminEditShoe";
import AdminAddShoe from "./admin/AdminAddShoe";

const RoutingApp: React.FC = () => {
  
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((n, i) => n + i.qty, 0)
  );
  
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 [scrollbar-gutter:stable]">
        <nav className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <ul className="flex gap-4 items-center">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-white px-2 py-1 rounded hover:bg-white/10 ${
                      isActive ? "bg-white/10" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/shoes/list"
                  className={({ isActive }) =>
                    `text-white px-2 py-1 rounded hover:bg-white/10 ${
                      isActive ? "bg-white/10" : ""
                    }`
                  }
                >
                  Shop
                </NavLink>
              </li>
              {(() => {
                const role = user?.role?.toLowerCase();
                const isStaff = role === "staff" || role === "admin";
                return isStaff;
              })() && (
                <li>
                  <NavLink
                    to="/backend"
                    className={({ isActive }) =>
                      `text-white px-2 py-1 rounded hover:bg-white/10 ${
                        isActive ? "bg-white/10" : ""
                      }`
                    }
                  >
                    Backend
                  </NavLink>
                </li>
              )}
              <li className="ml-auto" />
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `text-white px-2 py-1 rounded hover:bg-white/10 relative ${
                      isActive ? "bg-white/10" : ""
                    }`
                  }
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </li>
              {user ? (
                <li className="text-white flex items-center space-x-2">
                  <span className="opacity-90">
                    Hi, {user.name ?? user.email}
                  </span>
                  <button
                    onClick={() => dispatch(logout())}
                    className="underline hover:no-underline px-2 py-1"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-white px-2 py-1 rounded hover:bg-white/10"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-white px-2 py-1 rounded hover:bg-white/10"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto p-4 min-h-[75vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shoes/list" element={<ShoeList />} />
            <Route path="/shoes/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:id" element={<OrderSuccess />} />
            <Route
              path="/shoes/new"
              element={
                <AdminRoute>
                  <AdminAddShoe />
                </AdminRoute>
              }
            />
            <Route
              path="/shoes/:id/edit"
              element={
                <AdminRoute>
                  <AdminEditShoe />
                </AdminRoute>
              }
            />
            <Route
              path="/backend"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/backend/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default RoutingApp;
