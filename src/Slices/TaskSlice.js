// taskSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiServices from "../ApiService/ApiService";


// Async thunk
export const fetchTasks = createAsyncThunk(
  "task/getTasks",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await ApiServices.getTasksByProjectId(projectId);
      return response; // ApiClient already returning JSON hoga
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch tasks");
    }
  }
);

export const fetchTasksById=createAsyncThunk(
  "task/getTaskById",
  async(TaskId,{rejectWithValue})=>{
    try {
      const response=await ApiServices.getTasksByTaskId(TaskId)
      return response
    } catch (error) {
       return rejectWithValue(error.message || "Failed to fetch task details");
    }

  }
)
export const fetchSubTasksBytaskId=createAsyncThunk(
  "task/getSubTaskById",
    async(TaskId,{rejectWithValue})=>{
    try {
      const response=await ApiServices.getSubTaskByTaskid(TaskId)
      return response
    } catch (error) {
       return rejectWithValue(error.message || "Failed to fetch SUb Tasks SUbTasks");
    }

  }
)
// const fetchTeamByTaskId=createAsyncThunk(
//   "task/getTeamByTask",
//   async(TaskId,{rejectWithValue})=>{
//     try {
//       const response=await ApiServices.getTeamByTaskId(TaskId)
//       return response
//     } catch (error) {
//        return rejectWithValue(error.message || "Failed to fetch task details");

      
//     }
//   }
// )
// Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    taskDetails:{},
    TaskReport:{},
    SubTasks:[],
    
  },
  reducers: {
    setTasks:(state,action)=>{
        state.tasks=action.payload
    },
    setTaskDetails:(state,action)=>{
      state.taskDetails=action.payload
    },
    setError:(state,action)=>{
      state.error=action.payload
    },
    setTaskReport:(state,action)=>{
      state.TaskReport=action.payload
    }


  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tasks=[]
      })
       .addCase(fetchTasksById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksById.fulfilled, (state, action) => {
        state.loading = false;
        state.taskDetails = action.payload;
      })
      .addCase(fetchTasksById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.taskDetails={}
      })
      //
         .addCase(fetchSubTasksBytaskId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubTasksBytaskId.fulfilled, (state, action) => {
        state.loading = false;
        state.SubTasks=action.payload
      })
      .addCase(fetchSubTasksBytaskId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.SubTasks=[]
      })
       .addCase("Task/updateSubTaskStatus", (state, action) => {
      const { id, status } = action.payload;
      const task = state.SubTasks.subTasks.find(t => t._id === id);
      if (task) task.status = status; // local update
    });
  },
});
export const  {setTasks,setTaskDetails,setError,setTaskReport}=taskSlice.actions;
export default taskSlice.reducer;
