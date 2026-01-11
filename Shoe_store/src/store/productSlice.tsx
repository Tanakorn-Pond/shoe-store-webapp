
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import axios from "axios";




export interface Product {
  id: number; 
  name: string; 
  description: string; 
  price: number; 
  stock: number; 
  brand: string; 
  sizes: number[]; 
  images: string[]; 
  createdAt?: string; 
  updatedAt?: string; 
}




interface ProductState {
  products: Product[]; 
  loading: boolean; 
  error: string | null; 
}


const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};


const API_URL = "/api/products";







type AnyRecord = Record<string, unknown>;


function toNumberArray(input: unknown): number[] {
  if (Array.isArray(input)) return input.map((s) => Number(s));
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map((s) => Number(s));
    } catch {
      
    }
    return input.split(",").map((s) => Number(String(s).trim()));
  }
  return [];
}


function toStringArray(input: unknown): string[] {
  if (Array.isArray(input)) return input.map((i) => String(i));
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map((i) => String(i));
    } catch {
      
    }
    return input.split(",").map((i) => String(i).trim());
  }
  return [];
}


function normalizeProduct(raw: AnyRecord): Product {
  
  const sizesRaw =
    raw.sizes ??
    (raw as AnyRecord)["sizesText"] ??
    (raw as AnyRecord)["sizes_text"] ??
    (raw as AnyRecord)["sizesText"];

  const imagesRaw =
    raw.images ??
    (raw as AnyRecord)["imagesText"] ??
    (raw as AnyRecord)["images_text"] ??
    raw.images;

  
  const createdAt = (raw["createdAt"] ?? raw["created_at"]) as
    | string
    | undefined;
  const updatedAt = (raw["updatedAt"] ?? raw["updated_at"]) as
    | string
    | undefined;

  return {
    id: Number(raw.id as number | string),
    name: String(raw.name ?? ""),
    description: String((raw as AnyRecord).description ?? ""),
    price: Number(raw.price as number | string),
    stock: Number((raw as AnyRecord).stock ?? 0),
    brand: String((raw as AnyRecord).brand ?? ""),
    sizes: toNumberArray(sizesRaw),
    images: toStringArray(imagesRaw),
    createdAt,
    updatedAt,
  };
}






export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await axios.get<unknown[]>(API_URL); 
  
  return (res.data as unknown[]).map((p) => normalizeProduct(p as AnyRecord));
});


export const addProduct = createAsyncThunk(
  "products/add",
  async (product: Product) => {
    const payload = { ...product } as Partial<Product>;
    delete (payload as { id?: number }).id; 
    const res = await axios.post<unknown>(API_URL, payload); 
    return normalizeProduct(res.data as AnyRecord);
  }
);


export const updateProduct = createAsyncThunk(
  "products/update",
  async (product: Product) => {
    const res = await axios.put<unknown>(`${API_URL}/${product.id}`, product);
    return normalizeProduct(res.data as AnyRecord);
  }
);


export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    return id; 
  }
);




const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {}, 

  
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true; 
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false; 
          state.products = action.payload; 
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.error.message ?? "Failed to fetch products";
      })

      
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.products.push(action.payload); 
        }
      )

      
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          
          const i = state.products.findIndex((p) => p.id === action.payload.id);
          if (i !== -1) state.products[i] = action.payload; 
        }
      )

      
      .addCase(deleteProduct.fulfilled, (state, action) => {
        
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});


export default productSlice.reducer;
