import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import './EditProjectModal.css';
import ApiServices from "../ApiService/ApiService";
import { FetchProjectDetailsById } from "../Slices/ProjectSlice";

const EditProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: null,
    endDate: null,
    projectStatus: "",
    priority: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  const params = useParams();
  const { ProjectDetails, ProjectLoading, projectError } = useSelector((state) => state.Project);
  const dispatch = useDispatch();

  useEffect(() => {
    if (ProjectDetails) {
      setFormData({
        name: ProjectDetails.name || "",
        description: ProjectDetails.description || "",
        budget: ProjectDetails.budget || "",
        startDate: ProjectDetails.startDate ? ProjectDetails.startDate.split("T")[0] : "",
        endDate: ProjectDetails.endDate ? ProjectDetails.endDate.split("T")[0] : "",
        projectStatus: ProjectDetails.projectStatus || "",
        priority: ProjectDetails.priority || "",
        projectId: params?.id
      });
    }
  }, [ProjectDetails, params]);

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
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with your actual API service
      const data = await ApiServices.updateProjectDetailsById(formData);
      alert(data.SuccessMessage);
      dispatch(FetchProjectDetailsById(params.id));
      
      // Simulated success for demo
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      case 'critical': return 'edit-modal-priority-critical';
      case 'high': return 'edit-modal-priority-high';
      case 'medium': return 'edit-modal-priority-medium';
      case 'low': return 'edit-modal-priority-low';
      default: return 'edit-modal-priority-default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'edit-modal-status-active';
      case 'completed': return 'edit-modal-status-completed';
      case 'on hold': return 'edit-modal-status-on-hold';
      case 'draft': return 'edit-modal-status-draft';
      default: return 'edit-modal-status-default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />;
      case 'high':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />;
      case 'medium':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />;
      case 'low':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`edit-modal-overlay ${isClosing ? 'edit-modal-closing' : ''}`}>
      <div className="edit-modal-backdrop" />
      
      <div className={`edit-modal-container ${isClosing ? 'edit-modal-closing' : ''}`}>
        <form onSubmit={handleSubmit} className="edit-modal-form">
          {/* Header */}
          <div className="edit-modal-header">
            <div className="edit-modal-header-content">
              <div className="edit-modal-icon">
                <svg className="edit-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="edit-modal-title-section">
                <h2 className="edit-modal-title">Edit Project</h2>
                <p className="edit-modal-subtitle">Update your project details and settings</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleClose}
              className="edit-modal-close-btn"
              disabled={isLoading}
            >
              <svg className="edit-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="edit-modal-progress-indicator">
            <div className="edit-modal-progress-bar">
              <div className="edit-modal-progress-fill" style={{ width: isLoading ? '100%' : '0%' }} />
            </div>
          </div>

          {/* Content */}
          <div className="edit-modal-content">
            {/* Basic Information Section */}
            <div className="edit-modal-form-section">
              <div className="edit-modal-section-header">
                <svg className="edit-modal-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="edit-modal-section-title">Basic Information</h3>
              </div>
              
              <div className="edit-modal-form-grid">
                <div className="edit-modal-form-group edit-modal-full-width">
                  <label className="edit-modal-form-label edit-modal-required">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`edit-modal-form-input ${errors.name ? 'edit-modal-error' : ''}`}
                    placeholder="Enter project name"
                    disabled={isLoading}
                  />
                  {errors.name && <span className="edit-modal-error-message">{errors.name}</span>}
                </div>
                
                <div className="edit-modal-form-group edit-modal-full-width">
                  <label className="edit-modal-form-label">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="edit-modal-form-textarea"
                    placeholder="Describe your project goals, objectives, and key deliverables..."
                    disabled={isLoading}
                  />
                </div>

                <div className="edit-modal-form-group">
                  <label className="edit-modal-form-label">
                    Budget
                  </label>
                  <div className="edit-modal-budget-input-container">
                    <div className="edit-modal-currency-symbol">
                      <span>$</span>
                    </div>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={`edit-modal-form-input edit-modal-budget-input ${errors.budget ? 'edit-modal-error' : ''}`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.budget && <span className="edit-modal-error-message">{errors.budget}</span>}
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="edit-modal-form-section">
              <div className="edit-modal-section-header">
                <svg className="edit-modal-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="edit-modal-section-title">Timeline</h3>
              </div>
              
              <div className="edit-modal-form-grid">
                <div className="edit-modal-form-group">
                  <label className="edit-modal-form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="edit-modal-form-input edit-modal-date-input"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="edit-modal-form-group">
                  <label className="edit-modal-form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`edit-modal-form-input edit-modal-date-input ${errors.endDate ? 'edit-modal-error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.endDate && <span className="edit-modal-error-message">{errors.endDate}</span>}
                </div>
              </div>
            </div>

            {/* Status & Priority Section */}
            <div className="edit-modal-form-section">
              <div className="edit-modal-section-header">
                <svg className="edit-modal-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="edit-modal-section-title">Status & Priority</h3>
              </div>
              
              <div className="edit-modal-form-grid">
                <div className="edit-modal-form-group">
                  <label className="edit-modal-form-label">
                    Project Status
                  </label>
                  <div className="edit-modal-select-container">
                    <select
                      name="projectStatus"
                      value={formData.projectStatus}
                      onChange={handleChange}
                      className={`edit-modal-form-select ${getStatusColor(formData.projectStatus)}`}
                      disabled={isLoading}
                    >
                      <option value="">Select Status</option>
                      <option value="draft">📝 Draft</option>
                      <option value="active">🟢 Active</option>
                      <option value="On Hold">⏸️ On Hold</option>
                      <option value="Completed">✅ Completed</option>
                    </select>
                    <div className="edit-modal-select-arrow">
                      <svg className="edit-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="edit-modal-form-group">
                  <label className="edit-modal-form-label">
                    Priority Level
                  </label>
                  <div className="edit-modal-select-container">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={`edit-modal-form-select ${getPriorityColor(formData.priority)}`}
                      disabled={isLoading}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">🔵 Low</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="High">🟠 High</option>
                      <option value="Critical">🔴 Critical</option>
                    </select>
                    <div className="edit-modal-select-arrow">
                      <svg className="edit-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="edit-modal-footer">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="edit-modal-btn edit-modal-btn-secondary"
            >
              <svg className="edit-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="edit-modal-btn edit-modal-btn-primary"
            >
              {isLoading ? (
                <>
                  <svg className="edit-modal-icon edit-modal-spinner" fill="none" viewBox="0 0 24 24">
                    <circle className="edit-modal-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="edit-modal-opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <svg className="edit-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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