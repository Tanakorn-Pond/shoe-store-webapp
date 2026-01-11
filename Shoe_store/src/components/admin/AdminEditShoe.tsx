import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/productSlice";
import ShoeForm from "../ShoeForm";
import AdminLayout from "./AdminLayout";


const AdminEditShoe: React.FC = () => {
  
  const { id } = useParams();
  
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  
  const products = useAppSelector((s) => s.products.products);

  
  const productId = Number(id);
  
  const editing = products.find((p) => p.id === productId);

  
  useEffect(() => {
    if (!editing) {
      
      dispatch(fetchProducts());
    }
  }, [dispatch, editing]); 

  
  return (
    
    <AdminLayout title="Edit Product">
      {editing ? (
        
        <div className="max-w-xl">
          <ShoeForm
            editingShoe={editing}
            onCancelEdit={() => navigate("/backend")}
          />
        </div>
      ) : (
        
        <div className="text-gray-600">Loading product...</div>
      )}
    </AdminLayout>
  );
};


export default AdminEditShoe;
