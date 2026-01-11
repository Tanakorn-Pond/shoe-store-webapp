import React from "react";
import AdminLayout from "./AdminLayout";
import ShoeForm from "../ShoeForm";

const AdminAddShoe: React.FC = () => {
  return (
    <AdminLayout title="Add New Product">
      <div className="max-w-xl">
        <ShoeForm />
      </div>
    </AdminLayout>
  );
};

export default AdminAddShoe;
