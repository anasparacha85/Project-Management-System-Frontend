import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ApiServices from "../ApiService/ApiService";
import { FetchProjectDetailsById } from "../Slices/ProjectSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditProjectModal = ({ isOpen, onClose }) => {
   const params = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: null,
    endDate: null,
    projectStatus: "",
    priority: "",
     projectId: params?.id
    
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);

 
  const { ProjectDetails, ProjectLoading, projectError } = useSelector((state) => state.Project);
  const dispatch = useDispatch();
  console.log(ProjectDetails,"projectDetails");
  
  
 useEffect(() => {
  if (isOpen && ProjectDetails && ProjectDetails.name) {
    setFormData({
      name: ProjectDetails.name || "",
      description: ProjectDetails.description || "",
      budget: ProjectDetails.budget || "",
      startDate: ProjectDetails.startDate
        ? ProjectDetails.startDate.split("T")[0]
        : "",
      endDate: ProjectDetails.endDate
        ? ProjectDetails.endDate.split("T")[0]
        : "",
      projectStatus: ProjectDetails.projectStatus || "",
      priority: ProjectDetails.priority || "",
      projectId: params?.id,
    });
  }
}, [isOpen, ProjectDetails]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }
    if (formData.budget && formData.budget < 0) {
      newErrors.budget = "Budget cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    console.log(formData);
    
    setIsLoading(true);
    
    try {
      const data = await ApiServices.updateProjectDetailsById(formData);
      alert(data.SuccessMessage);
      dispatch(FetchProjectDetailsById(params.id));
      handleClose();
    } catch (error) {
      alert(error.message || "Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setErrors({});
    }, 300);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'border-green-500 bg-green-50';
      case 'completed': return 'border-blue-500 bg-blue-50';
      case 'on hold': return 'border-yellow-500 bg-yellow-50';
      case 'draft': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center p-4 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'} backdrop-blur-sm`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/75 transition-colors" />
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl shadow-black/25 ring-1 ring-white/5 ${isClosing ? 'animate-slideOut' : 'animate-slideIn'} overflow-hidden`}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-8 pb-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-700/10 backdrop-blur-xl" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold bg-gradient-to-br from-white to-slate-200 bg-clip-text text-transparent mb-1">
                  Edit Project
                </h2>
                <p className="text-sm opacity-90 text-white/80">
                  Update your project details and settings
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleClose}
              className="relative z-10 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-lg text-white/80 cursor-pointer transition-all duration-200 backdrop-blur-sm hover:bg-white/20 hover:text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="h-1 bg-slate-200/30 overflow-hidden">
            <div className="h-full w-full relative">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-blue-700 to-blue-500 transition-all duration-300 animate-shimmer bg-[length:200%_100%]" 
                style={{ width: isLoading ? '100%' : '0%' }} 
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {/* Basic Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-slate-100">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-800 m-0">
                  Basic Information
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    Project Name
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-sm bg-white transition-all duration-200 font-inherit focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:-translate-y-0.5 ${errors.name ? 'border-red-500 ring-4 ring-red-500/10' : ''} disabled:bg-slate-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
                    placeholder="Enter project name"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      ⚠️ {errors.name}
                    </span>
                  )}
                </div>
                
                <div className="col-span-2 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <ReactQuill
                         theme="snow"
                         value={formData.description || ""}
                      onChange={(value) => setFormData({ ...formData, description: value })}
                         className="min-h-40 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-3 focus:ring-purple-100"
                       />
                </div>

                <div className="flex flex-col mt-7">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    Budget
                  </label>
                  <div className="flex relative">
                    <div className="flex items-center justify-center px-4 bg-slate-50 border-2 border-slate-200 border-r-0 rounded-l-xl text-gray-500 font-semibold">
                      <span>$</span>
                    </div>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={`flex-1 px-4 py-3.5 border-2 border-slate-200 rounded-r-xl text-sm bg-white transition-all duration-200 font-inherit focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:-translate-y-0.5 ${errors.budget ? 'border-red-500 ring-4 ring-red-500/10' : ''} disabled:bg-slate-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.budget && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      ⚠️ {errors.budget}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-slate-100">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-800 m-0">
                  Timeline
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-sm bg-white transition-all duration-200 font-inherit focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:-translate-y-0.5 disabled:bg-slate-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-sm bg-white transition-all duration-200 font-inherit focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:-translate-y-0.5 ${errors.endDate ? 'border-red-500 ring-4 ring-red-500/10' : ''} disabled:bg-slate-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
                    disabled={isLoading}
                  />
                  {errors.endDate && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      ⚠️ {errors.endDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status & Priority Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-slate-100">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-800 m-0">
                  Status & Priority
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    Project Status
                  </label>
                  <div className="relative">
                    <select
                      name="projectStatus"
                      value={formData.projectStatus}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm bg-white transition-all duration-200 font-inherit focus:outline-none focus:ring-4 focus:-translate-y-0.5 appearance-none cursor-pointer ${getStatusColor(formData.projectStatus)} disabled:bg-slate-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
                      disabled={isLoading}
                    >
                      <option value="">Select Status</option>
                      <option value="draft">📝 Draft</option>
                      <option value="active">🟢 Active</option>
                      <option value="On Hold">⏸️ On Hold</option>
                      <option value="Completed">✅ Completed</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm bg-white transition-all duration-200 font-inherit focus:outline-none focus:ring-4 focus:-translate-y-0.5 appearance-none cursor-pointer ${getPriorityColor(formData.priority)} disabled:bg-slate-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
                      disabled={isLoading}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">🔵 Low</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="High">🟠 High</option>
                      <option value="Critical">🔴 Critical</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 pt-4 border-t border-slate-100 bg-gradient-to-br from-slate-50 to-white">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 border-2 border-transparent relative overflow-hidden bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-left duration-500" />
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 border-2 border-transparent relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-blue-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-left duration-500" />
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;