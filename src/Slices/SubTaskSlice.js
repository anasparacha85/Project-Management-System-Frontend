import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiServices from "../ApiService/ApiService";

export const fetchSubTaskById=createAsyncThunk(
  "task/getSubTaskById",
  async(TaskId,{rejectWithValue})=>{
    try {
      const response=await ApiServices.getSubTaskBySUbTaskId(TaskId)
      return response
    } catch (error) {
       return rejectWithValue(error.message || "Failed to fetch task details");
    }

  }
)

const SubTaskSlice=createSlice(
    {
        name:'SubTaskSlice',
        initialState:{
            SubTaskDetails:{},
            SubTasks:[],
            SUbTaskError:null,
            SubTaskLoading:false
        }
        ,
        reducers:{
            setSubTaskDetails:(state,action)=>{
                state.SubTask=action.payload
            }
        },
        extraReducers:(builder)=>{
            builder
            .addCase(fetchSubTaskById.pending,(state)=>{
                state.SUbTaskError=null,
                state.SubTaskLoading=true
            })
            .addCase(fetchSubTaskById.fulfilled,(state,action)=>{
                state.SUbTaskError=null,
                state.SubTaskLoading=false,
                state.SubTaskDetails=action.payload
            })
            .addCase(fetchSubTaskById.rejected,(state,action)=>{
                state.SUbTaskError=action.payload,
                state.SubTaskLoading=false,
                state.SubTaskDetails={}
            })
        }
    }
)

export const {setSubTaskDetails}=SubTaskSlice.actions
export default SubTaskSlice.reducer