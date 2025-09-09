import { createSlice } from "@reduxjs/toolkit"
const UISlice=createSlice(
    {name:'ui',
        initialState:{
          TaskModalOpen:false,
          SubTaskModalOpen:false,

        },
        reducers:{
          setTaskModalOpen:(state,action)=>{
            state.TaskModalOpen=action.payload
          },
          setSubTaskModalOpen:(state,action)=>{
            state.SubTaskModalOpen=action.payload
          }
            
        },
       
        
    }
)
export const  {setTaskModalOpen,setSubTaskModalOpen}=UISlice.actions;
export default UISlice.reducer