
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface AuthUser {
  id: number; 
  email: string; 
  name?: string; 
  role?: string; 
}


interface AuthState {
  user: AuthUser | null; 
}


const STORAGE_KEY = "authUser";


function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY); 
    
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    
    return null;
  }
}


function saveUser(user: AuthUser | null) {
  try {
    if (user)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    
  }
}


const initialState: AuthState = {
  
  user: typeof window !== "undefined" ? loadUser() : null,
};


const authSlice = createSlice({
  name: "auth", 
  initialState, 
  reducers: {
    
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload; 
      saveUser(action.payload); 
    },

    
    logout(state) {
      state.user = null; 
      saveUser(null); 
    },
  },
});


export const { setUser, logout } = authSlice.actions;


export default authSlice.reducer;
