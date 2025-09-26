import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiServices from "../ApiService/ApiService";
export const getUser=createAsyncThunk(
    "auth/getUser",
    async (_,{rejectWithValue})=>{
        try {
              const response=await ApiServices.getUserData()
        return response
        } catch (error) {
            return rejectWithValue(error.message)
            
        }
      
    }
)
const UserSlice=createSlice({
    name:'user',
    initialState:{
        user:{}
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        },
        clearUser:(state,action)=>{
            state.user={}
        }
    }
})

export const {setUser,clearUser}=UserSlice.actions
export default UserSlice.reducer