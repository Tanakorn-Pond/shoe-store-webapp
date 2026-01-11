

import { configureStore } from "@reduxjs/toolkit";



import productReducer from "./productSlice"; 
import authReducer from "./authSlice"; 
import cartReducer from "./cartSlice"; 


const store = configureStore({
  reducer: {
    
    products: productReducer, 
    auth: authReducer, 
    cart: cartReducer, 
  },
});



export default store;





export type RootState = ReturnType<typeof store.getState>;



export type AppDispatch = typeof store.dispatch;
