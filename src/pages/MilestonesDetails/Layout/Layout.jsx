// src/layouts/ProjectLayout.jsx
import { NavLink, Outlet, useParams } from "react-router-dom";
import { Users, Plus, Grid3X3, List, Filter, Search, Group, DatabaseIcon, Milestone, DownloadCloud, MilestoneIcon, CircuitBoardIcon, AlignVerticalDistributeEnd } from "lucide-react";
import "./milestonelayout.css";
import TaskModal from "../../../modals/TaskModal";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiService/ApiService";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setSubTaskModalOpen } from "../../../Slices/UiSlice";
import SubTaskModal from "../../../modals/SubTaskModal";

const MileStoneLayout = () => {
    const [ShowTaskModal, setShowTaskModal] = useState(false)
    const [ProjectId, setProjectId] = useState('')
    const dispatch=useDispatch()
    const { SubTaskModalOpen}=useSelector((state)=>state.UserInterface)
    const {taskDetails}=useSelector((state)=>state.Task)
  const params=useParams()
  useEffect(()=>{
    setSubTaskModalOpen(false)
  },[])
//      const onOpenTaskModal=()=>{
//     setShowTaskModal(true)
//     setProjectId(params.id)
//   }
//      const onTaskCreated = async (task) => {
//   try {
//     console.log(task);
    
//     const formdata = new FormData();

//     // simple fields append karo
//     formdata.append("title", task.title);
//     formdata.append("description", task.description);
//     formdata.append("priority", task.priority);
//     formdata.append("startDate", task.startDate);
//     formdata.append("dueDate", task.dueDate);
//     formdata.append("milestone", task.milestone);

//     // array fields (assigneeIds, dependencies) ko JSON stringify karke bhejna behtar hoga
//     formdata.append("assigneeIds", JSON.stringify(task.assigneeIds));
//     formdata.append("dependencies", JSON.stringify(task.dependencies));

//     // attachments agar multiple files hain
//     task.attachments.forEach((file) => {
//       formdata.append("attachments", file);
//     });
// // console.log(projectId,"h");
     
//     // ab api call
//     const res = await ApiServices.createTask(formdata, params.id);
//     alert('MileStone created')
//     console.log("Task created: ", res);
    
//     setShowTaskModal(false)
//   } catch (error) {
//     console.error("Task creation error: ", error.message);
//   }
// };
 const navigations = [
    // {
    //   path: `/dashboard/project/${params.id}`,
    //   label: "Board",
    //   icon: <Grid3X3 size={16} />,
    // },
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
   
    
    // {
    //   path: `/dashboard/project/${params.id}/attachments`,
    //   label: "Attachments",
    //   icon: <DownloadCloud size={16} />,
    // },
  ];


  return (
    <div className="project-layout">
     {
        SubTaskModalOpen&&(
        
               <SubTaskModal parentTask={taskDetails}  />
        
       
        )
      }
      {/* Page Header */}
    

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
        <div className="mile-page-actions">
          {/* <button className="mile-action-btn secondary">
            <Users size={16} />
            <span>Assign Members</span>
          </button> */}
          <button onClick={()=>dispatch(setSubTaskModalOpen(true))}   className="mile-action-btn primary">
            <Plus size={16} />
            <span>Create Subtask</span>
          </button>
            {/* <button  className="mile-action-btn primary">
            <Plus size={16} />
            <span>Edit Milestone</span>
          </button> */}
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
