// src/layouts/ProjectLayout.jsx
import { NavLink, Outlet, useParams } from "react-router-dom";
import { Users, Plus, Grid3X3, List, Filter, Search, Group, DatabaseIcon, Milestone, DownloadCloud, Edit, Antenna } from "lucide-react";
import "./Layout.css";
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
    // {
    //   path: `/dashboard/project/${params.id}`,
    //   label: "Board",
    //   icon: <Grid3X3 size={16} />,
    // },
     {
      path: `/dashboard/project/${params.id}`,
      label: "Overview",
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
// if (ProjectLoading) {
//   return <div className="loading">Loading project...</div>;
// }

if (ProjectError) {
  return <div className="error">Failed to load project. Please try again.</div>;
}

if (!ProjectDetails) {
  return <div className="empty">No project found.</div>;
}

  return (
    <div className="project-layout">
    
        
               <TaskModal  projectId={ProjectId}/>
        
       
     
        {
        showEditProjectModal&&(
        
               <EditProjectModal isOpen={showEditProjectModal}  onClose={()=>setShowEditProjectModal(false)} />
        
       
        )
      }
        {
        InviteTeamModalOpen&&(
        
               <AddTeamModal    onClose={()=>setInviteTeamModalOpen(false)} alreadySelected={ProjectDetails.team} />
        
       
        )
      }
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <div className="breadcrumb">
            <span>Projects</span>
            <span> / </span>
            <span>Dashboard</span>
          </div>
          <h1 className="page-title">Project Workspace</h1>
          <p className="page-subtitle">Manage tasks, team members & progress</p>
        </div>

        <div className="proj-page-actions">
          <button onClick={onOpenInviteTeamModal} className="proj-action-btn secondary">
            <Users size={16} />
            <span>Invite Team</span>
          </button>
          <button onClick={onOpenTaskModal} className="proj-action-btn primary">
            <Plus size={16} />
            <span>New Milestone</span>
          </button>
            <button onClick={onOpenEditProjectModal} className="proj-action-btn primary">
            <Edit size={16} />
            <span>Edit Project</span>
          </button>
        </div>
      </div>

      {/* Page Controls */}
      <div className="page-controls">
        <div className="controls-left">
          <div className="view-toggle">
          {navigations.map((value,index)=>(
             <NavLink  to={value.path} className={({isActive})=>`view-btn  ${isActive? 'view-btn active' : ''}`}>
             {value.icon}
              <span>{value.label}</span>
            
            </NavLink> 

          ))}
         
          </div>

          {/* <div className="search-filter">
            <div className="search-projects">
              <Search size={16} />
              <input type="text" placeholder="Search..." />
            </div>
            <button className="filter-btn">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div> */}
        </div>
        <div className="controls-right">
          <div className="team-avatars">
  {ProjectDetails?.team?.length > 0 ? (
    ProjectDetails.team.map((member, idx) => (
      <div key={idx} title={member?.user?.name} className="team-avatar" style={{ zIndex: 4 - idx }}>
        <img 
          src={member?.user?.avatarUrl} 
          alt={member?.user?.name?.slice(0,2)} 
          className="member-avatar"
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
