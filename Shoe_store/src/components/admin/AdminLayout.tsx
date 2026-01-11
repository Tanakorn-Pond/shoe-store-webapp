import React from "react";
import { NavLink, Link } from "react-router-dom";


type Props = {
  title?: string; 
  children: React.ReactNode; 
};


const AdminLayout: React.FC<Props> = ({ title = "Dashboard", children }) => {
  
  return (
    
    <div className="min-h-[70vh] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="bg-white border-r border-gray-200 p-4 space-y-6">
          <div>
            <div className="font-semibold text-gray-900">ShoeStore Admin</div>
            <div className="text-xs text-gray-500">Staff Member</div>
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/backend"
              className={({ isActive }) =>
                
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-700 hover:bg-gray-50" 
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/backend/orders"
              className={({ isActive }) =>
                
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              Orders
            </NavLink>
          </nav>
          <div className="pt-6 border-t">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Store
            </Link>
          </div>
        </aside>
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-4">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;
