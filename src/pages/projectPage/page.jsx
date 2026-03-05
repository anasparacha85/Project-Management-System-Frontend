import React, { useEffect, useState } from "react";
import ProjectModal from "../../modals/ProjectCreationModal";
import AIProjectAutomationModal from "../../modals/AIProjectAutomationModal";
import ProjectCard from "../../components/Cards/ProjectCards/ProjectCard";
import EmptyState from "../../components/states/projectemptystate";
import { useNavigate } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllProjects, setProjectError, setProjects } from "../../Slices/ProjectSlice";

export default function ProjectPage() {
  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [Error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {projects, projectError, projectLoading} = useSelector((state) => state.Project)
  const {user} = useSelector((state) => state.User)
  console.log(user);
  
  const handleProjectCreate = async(projectData) => {
    const formData = new FormData();

    formData.append("name", projectData.name);
    formData.append("description", projectData.description);
    formData.append("startDate", projectData.startDate);
    formData.append("endDate", projectData.endDate);
    formData.append("budget", projectData.budget);
    formData.append("priority", projectData.priority);
    formData.append("managerId", projectData.managerId);
    formData.append("teamName", projectData.teamName);

    projectData.memberIds.forEach((id) => {
      formData.append("memberIds[]", id);
    });

    projectData.files.forEach((file) => {
      formData.append("files", file);
    });
    
    try {
      const data = await ApiServices.createProject(formData)
      console.log("data", data);
      alert(data.SuccessMessage)
      setShowModal(false)
      dispatch(FetchAllProjects())
    } catch (error) {
      console.log(error.message);
      alert(error.message)
    }
  };

  const role = user.role;
  console.log(role);
  
  const FetchProjectsByEmployee = async() => {
    try {
      const data = await ApiServices.getProjectByEmployee()
      console.log(data);
      dispatch(setProjects(data.projects))
    } catch (error) {
      console.log(error);
      dispatch(setProjectError(error.message))
    }
  }

  useEffect(() => {
    if(role === 'manager') {
      dispatch(FetchAllProjects())
    } else {
      FetchProjectsByEmployee()
    }
  }, [role])

  const handleViewProject = (projectId) => {
    console.log("Navigate to project:", projectId);
    navigate(`/dashboard/project/${projectId}`)
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-start mb-8">
        {role === 'manager' ? (
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Projects</h1>
            <p className="text-base text-gray-100 m-0">Manage and track your team's projects</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Your assigned Projects</h1>
            <p className="text-base text-gray-100 m-0">Manage your projects and tasks status</p>
          </div>
        )}
        
        {role === 'manager' && projects.length > 0 && (
          <div className="flex items-center gap-3">
            <button 
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-none py-3 px-6 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
              onClick={() => setShowAIModal(true)}
              title="Generate projects and milestones using AI"
            >
              🤖 AI Generate
            </button>
            <button 
              className="bg-blue-500 text-white border-none py-3 px-6 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
              onClick={() => setShowModal(true)}
               title="Create New Project Manually "
            >
              + New Project
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[1200px] w-full">
        {projects.length === 0 ? (
          <EmptyState onCreateProject={() => setShowModal(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {showAIModal && (
        <AIProjectAutomationModal
          onClose={() => setShowAIModal(false)}
        />
      )}
    </div>
  );
}