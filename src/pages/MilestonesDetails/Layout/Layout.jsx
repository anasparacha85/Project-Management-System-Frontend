// src/layouts/ProjectLayout.jsx
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { Users, Plus, Grid3X3, List, Filter, Search, Group, DatabaseIcon, Milestone, DownloadCloud, MilestoneIcon, CircuitBoardIcon, AlignVerticalDistributeEnd, ArrowLeft, LogIn, Link } from "lucide-react";
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
      path: `/dashboard/milestone/${params.id}/checklists`,
      label: "CheckPoints",
      icon: <MilestoneIcon size={16} />,
    },
    {
      path: `/dashboard/milestone/${params.id}/team`,
      label: "Assignees",
      icon: <Group size={16} />,
    },
     {
      path: `/dashboard/milestone/${params.id}/analytics`,
      label: "Analytics",
      icon: <AlignVerticalDistributeEnd size={16} />,
    },
    
     {
      path: `/dashboard/milestone/${params.id}/attachments`,
      label: "Attachments",
      icon: <Link size={16} />,
    },
    
  ];

  return (
    <div className="min-h-screen  mr-3 mt-2">
        <SubTaskModal parentTask={taskDetails}  />
       
      {/* Header Section with Milestone Details */}
      <div className=" ">
        <div className="max-w-[1400px]  mx-auto px-3 py-6">
          {/* Top Bar - Back Button & Actions */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={()=>navigate(`/dashboard/project/${taskDetails.project}`)} 
              className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 border-none bg-transparent cursor-pointer"
            >
              <ArrowLeft className="" size={18} />
              <span className="text-sm font-medium ">Back to Project</span>
            </button>

            {role==="manager" && (
              <button 
                onClick={()=>dispatch(setSubTaskModalOpen(true))}   
                className="flex items-center gap-2 px-5 py-2.5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 text-gray-800 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span>Add Checkpoint</span>
              </button>
            )}
          </div>

          {/* Milestone Title & Description */}
          {/* <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-300 flex items-center justify-center shadow-md">
                <MilestoneIcon size={20} className="text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-200 m-0">
                Milestone Details
              </h1>
            </div>
            {taskDetails?.description && (
              <p className="text-gray-300 text-base leading-relaxed ml-[52px] max-w-3xl">
         {user.role=='manager'&&"Manage you Milestone Add checkpoints track progress and assignees"}     
              </p>
            )}
          </div> */}

         {/* Navigation Tabs */}
<div className="flex items-center py-6 px-3 bg-white  border border-gray-200 rounded-2xl  shadow-sm">
  {navigations.map((value, index) => (
    <NavLink
      key={index}
      to={value.path}
      end
      className={({ isActive }) => `
        flex items-center ${index===0 &&'rounded-l-xl'} ${index===navigations.length-1&&'rounded-r-xl'} justify-center  w-[100%] gap-2 px-5 py-6 text-sm font-medium  transition-all duration-300 ease-in-out
        ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-[1.03]'
            : 'text-gray-600 hover:text-gray-900 bg-gradient-to-r from-gray-50 to-gray-300 hover:bg-gray-100'
        }
      `}
    >
      <span className="text-lg">{value.icon}</span>
      <span>{value.label}</span>
    </NavLink>
  ))}
</div>

        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-[1400px] mx-auto px-3 py-0">
        <Outlet />
      </div>
    </div>
  );
};

export default MileStoneLayout;