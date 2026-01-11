import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import {
  addProduct,
  updateProduct,
  fetchProducts,
} from "../store/productSlice";
import type { Product } from "../store/productSlice";


interface ShoeFormProps {
  editingShoe?: Product; 
  onCancelEdit?: () => void; 
}


const ShoeForm: React.FC<ShoeFormProps> = ({ editingShoe, onCancelEdit }) => {
  const dispatch = useAppDispatch(); 

  
  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [price, setPrice] = useState<number>(0); 
  const [stock, setStock] = useState<number>(0); 
  const [brand, setBrand] = useState(""); 
  const [sizes, setSizes] = useState<string>(""); 
  const [images, setImages] = useState<string>(""); 

  
  useEffect(() => {
    if (editingShoe) {
      
      setName(editingShoe.name);
      setDescription(editingShoe.description);
      setPrice(editingShoe.price);
      setStock(editingShoe.stock);
      setBrand(editingShoe.brand);
      setSizes(editingShoe.sizes.join(",")); 
      setImages(editingShoe.images.join(","));
    } else {
      
      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
      setBrand("");
      setSizes("");
      setImages("");
    }
  }, [editingShoe]); 

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    
    const productData: Product = {
      id: editingShoe?.id ?? 0, 
      name,
      description,
      price,
      stock,
      brand,
      
      sizes: sizes.split(",").map((s) => Number(s.trim())),
      
      images: images.split(",").map((i) => i.trim()),
    };

    try {
      if (editingShoe) {
        
        await dispatch(updateProduct(productData)).unwrap(); 
        await dispatch(fetchProducts()).unwrap(); 
        onCancelEdit?.(); 
      } else {
        
        await dispatch(addProduct(productData)).unwrap(); 
        await dispatch(fetchProducts()).unwrap(); 
        
        setName("");
        setDescription("");
        setPrice(0);
        setStock(0);
        setBrand("");
        setSizes("");
        setImages("");
      }
    } catch (err) {
      
      console.error("Error saving product:", err);
    }
  };

  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {editingShoe ? "Edit Shoe" : "Add New Shoe"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Brand:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">
            Sizes (comma separated):
          </label>
          <input
            type="text"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 38, 39, 40" 
          />
        </div>
        <div>
          <label className="block text-gray-700">
            Images (comma separated URLs):
          </label>
          <input
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. https://example.com/img1.jpg" 
          />
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 grow">
            {editingShoe ? "Update" : "Add"}
          </button>
          {editingShoe && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};


export default ShoeForm;
