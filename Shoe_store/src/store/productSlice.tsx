//  import เครื่องมือจาก Redux Toolkit
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
// ใช้ axios สำหรับเรียก API backend (GET/POST/PUT/DELETE)
import axios from "axios";

//
// (1) กำหนด Interface ของสินค้า (Product)
//
export interface Product {
  id: number; // รหัสสินค้า
  name: string; // ชื่อรองเท้า
  description: string; // รายละเอียด
  price: number; // ราคา
  stock: number; // จำนวนในสต็อก
  brand: string; // ยี่ห้อ
  sizes: number[]; // ไซซ์ที่มี เช่น [38,39,40]
  images: string[]; // ลิงก์รูปภาพ
  createdAt?: string; // วันที่สร้าง
  updatedAt?: string; // วันที่แก้ไขล่าสุด
}

//
// (2) กำหนด State สำหรับสินค้าทั้งหมด
//
interface ProductState {
  products: Product[]; // รายการสินค้าทั้งหมด
  loading: boolean; // สถานะกำลังโหลดข้อมูล
  error: string | null; // ข้อความ error (ถ้ามี)
}

// ค่าเริ่มต้นของ state
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// URL สำหรับ API ของสินค้า
const API_URL = "/api/products";

//
// ฟังก์ชันช่วย (Helper functions)
// ใช้สำหรับแปลงข้อมูลจาก backend ให้เป็นรูปแบบที่แน่นอน
//

// Type ตัวกลาง (object ใดๆ)
type AnyRecord = Record<string, unknown>;

// แปลงค่าให้เป็น array ของตัวเลข เช่น "38,39" → [38,39]
function toNumberArray(input: unknown): number[] {
  if (Array.isArray(input)) return input.map((s) => Number(s));
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map((s) => Number(s));
    } catch {
      /* ถ้า parse ไม่ได้ก็ใช้แยกด้วย , แทน */
    }
    return input.split(",").map((s) => Number(String(s).trim()));
  }
  return [];
}

// แปลงค่าให้เป็น array ของ string เช่น "a,b" → ["a","b"]
function toStringArray(input: unknown): string[] {
  if (Array.isArray(input)) return input.map((i) => String(i));
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map((i) => String(i));
    } catch {
      /* ถ้า parse ไม่ได้ก็ใช้ split() */
    }
    return input.split(",").map((i) => String(i).trim());
  }
  return [];
}

// แปลงข้อมูลสินค้าจาก backend → เป็น object Product ที่แน่นอน
function normalizeProduct(raw: AnyRecord): Product {
  // ตรวจหลายรูปแบบ (บาง backend อาจใช้ชื่อ field ต่างกัน)
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

  // รองรับชื่อ field createdAt/created_at
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

//
// (3) Async Thunks — ใช้สำหรับติดต่อ API แบบ async
//

// โหลดสินค้าทั้งหมด
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await axios.get<unknown[]>(API_URL); // GET /api/products
  // แปลงทุก object ที่ได้ให้เป็น Product มาตรฐาน
  return (res.data as unknown[]).map((p) => normalizeProduct(p as AnyRecord));
});

// เพิ่มสินค้าใหม่
export const addProduct = createAsyncThunk(
  "products/add",
  async (product: Product) => {
    const payload = { ...product } as Partial<Product>;
    delete (payload as { id?: number }).id; // ลบ id ทิ้ง (ให้ backend สร้างเอง)
    const res = await axios.post<unknown>(API_URL, payload); // POST /api/products
    return normalizeProduct(res.data as AnyRecord);
  }
);

// อัปเดตสินค้าเดิม
export const updateProduct = createAsyncThunk(
  "products/update",
  async (product: Product) => {
    const res = await axios.put<unknown>(`${API_URL}/${product.id}`, product);
    return normalizeProduct(res.data as AnyRecord);
  }
);

// ลบสินค้าออก
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    return id; // คืนค่า id ที่ลบ
  }
);

//
// (4) สร้าง Slice หลักของสินค้า
//
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {}, // ไม่มี reducer ธรรมดา เพราะใช้ async thunk แทน

  // จัดการผลลัพธ์จาก async thunk (pending / fulfilled / rejected)
  extraReducers: (builder) => {
    builder
      // --- fetchProducts ---
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true; // เริ่มโหลด
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false; // โหลดเสร็จ
          state.products = action.payload; // เก็บสินค้าใน state
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; // โหลดล้มเหลว
        state.error = action.error.message ?? "Failed to fetch products";
      })

      // --- addProduct ---
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.products.push(action.payload); // เพิ่มสินค้าใหม่ใน list
        }
      )

      // --- updateProduct ---
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          // หา index ของสินค้าที่แก้ไข
          const i = state.products.findIndex((p) => p.id === action.payload.id);
          if (i !== -1) state.products[i] = action.payload; // อัปเดตข้อมูลใหม่
        }
      )

      // --- deleteProduct ---
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // ลบสินค้าที่มี id ตรงกับ payload
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

// export reducer ไปใช้ใน store
export default productSlice.reducer;
