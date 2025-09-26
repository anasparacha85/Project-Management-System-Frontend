import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiServices from "../ApiService/ApiService";

export const FetchTeamByProjectId=createAsyncThunk(
    '/project/team',
    async(projectId,{rejectWithValue})=>{
        try {
            const data=await ApiServices.getMembersByProjectId(projectId);
            return data

        } catch (error) {
            return rejectWithValue(error.message || 'Failed to Fetch Teams')
            
        }
    }
)

export const FetchAllProjects=createAsyncThunk(
    '/project/all',
    async(_,{rejectWithValue})=>{
        try {
            const data=await ApiServices.fetchAllProjects();
            return data

        } catch (error) {
            return rejectWithValue(error.message || 'Failed to Fetch Projects')
            
        }
    }
)


export const FetchProjectDetailsById=createAsyncThunk(
     "/project/details",
    async(projectId,{rejectWithValue})=>{
        try {
            const data=await ApiServices.fetchProjectDetailsById(projectId)
            return data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to Fetch Projects')
            
        }
    }
)

export const FetchDocumentsByProjectId=createAsyncThunk(
    "/project/documents",
    async(projectId,{rejectWithValue})=>{
        try {
            const data=await ApiServices.getFilesByProjectId(projectId)
            return data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to Fetch Projects')
            
        }
    }
)
export const fetchProjectMilestones=createAsyncThunk(
    "/project/milestones",
    // async(project)
)

const projectSlice=createSlice(
    {name:'projects',
        initialState:{
            projects:[],
            team:[],
            projectError:null,
            ProjectLoading:false,
            ProjectDocuments:{},
            ProjectDetails:{},
            users:[]

        },
        reducers:{
            setTeam:(state,action)=>{
                state.team=action.payload
            },
             setProjectDetails:(state,action)=>{
                state.ProjectDetails=action.payload
            },
            setUsers:(state,action)=>{
                state.users=action.payload
            },
            setProjects:(state,action)=>{
                state.projects=action.payload
            },
            setProjectError:(state,action)=>{
                state.projectError=action.payload
            }
            
        },
        extraReducers:(builder)=>{
            builder
            .addCase(FetchTeamByProjectId.pending,(state)=>{
              
                state.projectError=null,
                state.ProjectLoading=true
            })
            .addCase(FetchTeamByProjectId.fulfilled,(state,action)=>{
                state.team=action.payload,
                state.ProjectLoading=false,
                state.projectError=null
            })
            .addCase(FetchTeamByProjectId.rejected,(state,action)=>{
                state.projectError=action.payload
                state.ProjectLoading=false,
                state.team=[]
            })
             .addCase(FetchAllProjects.pending,(state)=>{
               
                state.projectError=null,
                state.ProjectLoading=true
            })
            .addCase(FetchAllProjects.fulfilled,(state,action)=>{
                state.projects=action.payload,
                state.ProjectLoading=false,
                state.projectError=null
            })
            .addCase(FetchAllProjects.rejected,(state,action)=>{
                state.projectError=action.payload
                state.ProjectLoading=false,
                state.projects=[]
            })
            .addCase(FetchDocumentsByProjectId.pending,(state,action)=>{
                
                state.projectError=null,
                state.ProjectLoading=true
               
            })
              .addCase(FetchDocumentsByProjectId.fulfilled,(state,action)=>{
                state.ProjectDocuments=action.payload,
                state.ProjectLoading=false,
                state.projectError=null
            })
            .addCase(FetchDocumentsByProjectId.rejected,(state,action)=>{
                state.projectError=action.payload
                state.ProjectLoading=false,
                state.ProjectDocuments=[]
            })
             .addCase(FetchProjectDetailsById.pending,(state,action)=>{
                
                state.projectError=null,
                state.ProjectLoading=true
               
            })
              .addCase(FetchProjectDetailsById.fulfilled,(state,action)=>{
                state.ProjectDetails=action.payload,
                state.ProjectLoading=false,
                state.projectError=null
            })
            .addCase(FetchProjectDetailsById.rejected,(state,action)=>{
                state.projectError=action.payload
                state.ProjectLoading=false,
                state.ProjectDetails=[]
            })
        }
    }
)
export const  {setProjectDetails,setTeam,setUsers,setProjects,setProjectError}=projectSlice.actions;
export default projectSlice.reducer