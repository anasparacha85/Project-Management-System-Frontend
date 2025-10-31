// src/layouts/ProjectLayout.jsx
import { NavLink, Outlet, useParams } from "react-router-dom";
import { Users, Plus, Grid3X3, List, Filter, Search, Group, DatabaseIcon, Milestone, DownloadCloud, Edit, Antenna } from "lucide-react";
import TaskModal from "../../../modals/TaskModal";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { FetchProjectDetailsById } from "../../../Slices/ProjectSlice";
import EditProjectModal from "../../../modals/EditProjectModal";
import AddTeamModal from "../../../modals/AddteamModal";
import { setTaskModalOpen } from "../../../Slices/UiSlice";

const ProjectLayout = () => {
    const [ShowTaskModal, setShowTaskModal] = useState(false)
    const [ProjectId, setProjectId] = useState('')
    const [showEditProjectModal, setShowEditProjectModal] = useState(false)
    const [InviteTeamModalOpen, setInviteTeamModalOpen] = useState(false)
    const {ProjectDetails,ProjectError,ProjectLoading}=useSelector((state)=>state.Project)
    // console.log(ProjectDetails);
    const {user}=useSelector((state)=>state.User)
    console.log("user in project",user);
    const role=user.role
    
    const onOpenInviteTeamModal=()=>{
setInviteTeamModalOpen(true)
    }
    const params=useParams()
    const dispatch=useDispatch()
    const onOpenEditProjectModal=()=>{
      setShowEditProjectModal(true)
    }
    
     const onOpenTaskModal=()=>{
    
    setProjectId(params.id)
    dispatch(setTaskModalOpen(true))
  }
  useEffect(()=>{
    dispatch(FetchProjectDetailsById(params.id))

  },[params.id,dispatch])
    
 const navigations = [
     {
      path: `/dashboard/project/${params.id}`,
      label: "Dashboard",
      icon: <DatabaseIcon size={16} />,
    },
    {
      path: `/dashboard/project/${params.id}/team`,
      label: "Team",
      icon: <Group size={16} />,
    },
   
    {
      path: `/dashboard/project/${params.id}/milestone`,
      label: "Milestones",
      icon: <Milestone size={16} />,
    },
    {
      path: `/dashboard/project/${params.id}/attachments`,
      label: "Attachments",
      icon: <DownloadCloud size={16} />,
    },
     {
      path: `/dashboard/project/${params.id}/employees-report`,
      label: "Employees analysis",
      icon: <Antenna size={16} />,
    },
  ];

if (ProjectError) {
  return <div className="error">Failed to load project. Please try again.</div>;
}

if (!ProjectDetails) {
  return <div className="empty">No project found.</div>;
}

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
        <TaskModal  projectId={ProjectId}/>
        
        {showEditProjectModal && (
          <EditProjectModal isOpen={showEditProjectModal}  onClose={()=>setShowEditProjectModal(false)} />
        )}
        
        {InviteTeamModalOpen && (
          <AddTeamModal onClose={()=>setInviteTeamModalOpen(false)} alreadySelected={ProjectDetails.team} />
        )}

      {/* Page Header */}
      <div className="flex justify-between items-start mb-8 gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
            <span className="text-white/60">Projects</span>
            <span> / </span>
            <span>Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Project Workspace</h1>
          <p className="text-white/80 text-base leading-relaxed">Manage tasks, team members & progress</p>
        </div>
        
        {role==='manager' &&
          <div className="flex gap-3">
            <button 
              onClick={onOpenInviteTeamModal} 
              className="flex items-center gap-2 px-6 py-3 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap bg-white/20 text-white border border-white/30 backdrop-blur-xl hover:bg-white/30"
            >
              <Users size={16} />
              <span>Invite Team</span>
            </button>
            <button 
              onClick={onOpenTaskModal} 
              className="flex items-center gap-2 px-6 py-3 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap bg-white text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Plus size={16} />
              <span>New Milestone</span>
            </button>
            <button 
              onClick={onOpenEditProjectModal} 
              className="flex items-center gap-2 px-6 py-3 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap bg-white text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Edit size={16} />
              <span>Edit Project</span>
            </button>
          </div>
        }
      </div>

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
        
        <div className="flex items-center">
          <div className="flex items-center">
            {ProjectDetails?.team?.length > 0 ? (
              ProjectDetails.team.map((member, idx) => (
                <div 
                  key={idx} 
                  title={member?.user?.name} 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-xs font-semibold -ml-2 border-2 border-white transition-all duration-200 hover:-translate-y-1 hover:z-10"
                  style={{ zIndex: 4 - idx }}
                >
                  <img 
                    src={member?.user?.avatarUrl} 
                    alt={member?.user?.name?.slice(0,2)} 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png';
                    }}
                  />
                </div>
              ))
            ) : (
              <span className="no-members">No team members</span>
            )}
          </div>
        </div>
      </div>

      {/* Ye jaga alag-alag page show karega */}
      <div className="page-body">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectLayout;