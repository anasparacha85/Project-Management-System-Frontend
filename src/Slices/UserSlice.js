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
        user:{},
        token:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        },
        setToken:(state,action)=>{
            state.token=action.payload
        },
        clearUser:(state,action)=>{
            state.user={}
        }
    }
})

export const {setUser,clearUser,setToken}=UserSlice.actions
export default UserSlice.reducer