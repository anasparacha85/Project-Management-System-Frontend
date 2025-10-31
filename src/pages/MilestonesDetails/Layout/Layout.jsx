// src/layouts/ProjectLayout.jsx
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { Users, Plus, Grid3X3, List, Filter, Search, Group, DatabaseIcon, Milestone, DownloadCloud, MilestoneIcon, CircuitBoardIcon, AlignVerticalDistributeEnd, ArrowLeft, LogIn } from "lucide-react";
import TaskModal from "../../../modals/TaskModal";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiService/ApiService";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setSubTaskModalOpen } from "../../../Slices/UiSlice";
import SubTaskModal from "../../../modals/SubTaskModal";
import { fetchSubTasksBytaskId, setError, setSubTasks } from "../../../Slices/TaskSlice";

const MileStoneLayout = () => {
    const [ShowTaskModal, setShowTaskModal] = useState(false)
    const [ProjectId, setProjectId] = useState('')
    const dispatch=useDispatch()
    const { SubTaskModalOpen}=useSelector((state)=>state.UserInterface)
    const {taskDetails,SubTasks}=useSelector((state)=>state.Task)
    console.log(SubTasks);
    const {user}=useSelector((state)=>state.User)
    const navigate=useNavigate()
  const params=useParams()
  useEffect(()=>{
    setSubTaskModalOpen(false)
  },[])
  useEffect(()=>{
    dispatch(fetchSubTasksBytaskId(params.id))
  },[dispatch])
  const role=user.role

  const navigations = [
    {
      path: `/dashboard/milestone/${params.id}`,
      label: "Overview",
      icon: <MilestoneIcon size={16} />,
    },
    {
      path: `/dashboard/milestone/${params.id}/board`,
      label: "Board",
      icon: <CircuitBoardIcon size={16} />,
    },
    {
      path: `/dashboard/milestone/${params.id}/team`,
      label: "assignees",
      icon: <Group size={16} />,
    },
     {
      path: `/dashboard/milestone/${params.id}/analytics`,
      label: "analytics",
      icon: <AlignVerticalDistributeEnd size={16} />,
    },
     {
      path: `/dashboard/milestone/${params.id}/checklists`,
      label: "CheckPoints",
      icon: <MilestoneIcon size={16} />,
    },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
        <SubTaskModal parentTask={taskDetails}  />
       
      {/* Page Controls */}
      <div className="flex justify-between items-center mb-8 p-5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-[9px]">
          {navigations.map((value,index)=>(
             <NavLink  
               to={value.path} 
               className={({isActive}) => `flex items-center gap-2 px-4 py-2 border-none bg-transparent rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 text-gray-600 no-underline ${
                 isActive ? 'bg-white text-gray-900 shadow-sm' : ''
               }`}
             >
               {value.icon}
              <span>{value.label}</span>
            </NavLink> 
          ))}
          </div>
        </div>
        <div className="flex gap-3">
          {role==="manager" &&
          <>
             <button 
               onClick={()=>dispatch(setSubTaskModalOpen(true))}   
               className="flex items-center gap-2 px-6 py-3 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap text-white bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:shadow-lg hover:-translate-y-0.5"
             >
               <Plus size={16} />
               <span>Add task to Your Checklists</span>
             </button>
          </>}
           <button 
             onClick={()=>navigate(`/dashboard/project/${taskDetails.project}`)} 
             className="flex items-center gap-2 px-6 py-3 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap text-white bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:shadow-lg hover:-translate-y-0.5"
           >
             <ArrowLeft size={16} />
             <span>Back to Project</span>
           </button>
        </div>
      </div>

      {/* Ye jaga alag-alag page show karega */}
      <div className="page-body">
        <Outlet />
      </div>
    </div>
  );
};

export default MileStoneLayout;