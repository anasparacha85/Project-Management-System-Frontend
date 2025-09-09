import React, { useEffect, useState } from "react";

import "./projectpage.css";
import ProjectModal from "../../modals/ProjectCreationModal";
import ProjectCard from "../../components/Cards/ProjectCards/ProjectCard";
import EmptyState from "../../components/states/projectemptystate";
import { useNavigate } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllProjects } from "../../Slices/ProjectSlice";

export default function ProjectPage() {
  // const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [Error, setError] = useState(null)
  const navigate=useNavigate()
 const dispatch=useDispatch()
 const {projects,projectError,projectLoading}=useSelector((state)=>state.Project)
  const handleProjectCreate = async(projectData) => {
      const formData = new FormData();

    // append normal fields
    formData.append("name", projectData.name);
    formData.append("description", projectData.description);
    formData.append("startDate", projectData.startDate);
    formData.append("endDate", projectData.endDate);
    formData.append("budget", projectData.budget);
    formData.append("priority", projectData.priority);
    formData.append("managerId", projectData.managerId);
      formData.append("teamName", projectData.teamName);

    // memberIds ek array hai → isko loop se bhejna hoga
    projectData.memberIds.forEach((id) => {
      formData.append("memberIds[]", id);
    });

    // files bhi ek array hai
    projectData.files.forEach((file) => {
      
      formData.append("files", file);
    });
    
    try {
      const data=await ApiServices.createProject(formData)
   
    console.log("data",data);
   
      alert(data.SuccessMessage)
      setShowModal(false)
      dispatch(FetchAllProjects())
   
    
    } catch (error) {
      console.log(error.message);
      
      // alert(error.FailureMessage)
      alert(error.message)
    }
    
    
 
  };
  // const fetchAllprojects=async()=>{
  //    try {
  //     const res=await fetch(`${import.meta.env.VITE_LOCAL_API_URL}/api/manager/fetchAllProjects`,{
  //     method:'GET',
    
  //     credentials:'include'
  //   })
  //   const data=await res.json();
  //   console.log(data);
  //   if(res.ok){
  //    setProjects(data)
  //   }
  //   else{
  //     setProjects([])
  //   }
     
  //   }
  //   catch (error) {
  //     setError(error.FailureMessage)
  //    console.log(error.FailureMessage);
     
  //   }

  // }
  useEffect(()=>{
    dispatch(FetchAllProjects())
  },[])

  const handleViewProject = (projectId) => {
    console.log("Navigate to project:", projectId);
    navigate(`/dashboard/project/${projectId}`)
    // Here you would navigate to the project detail page
  };

  return (
    <div className="project-page">
      <div className="project-page-header">
        <div className="header-content">
          <h1>Projects</h1>
          <p>Manage and track your team's projects</p>
        </div>
        {projects.length > 0 && (
          <button 
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            + New Project
          </button>
        )}
      </div>

      <div className="project-page-content">
        {projects.length === 0 ? (
          <EmptyState onCreateProject={() => setShowModal(true)} />
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewProject={handleViewProject}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onSubmit={handleProjectCreate}
        />
      )}
    </div>
  );
}