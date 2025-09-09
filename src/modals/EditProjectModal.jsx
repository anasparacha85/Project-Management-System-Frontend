import React, { useState, useEffect } from "react";
import "./EditProjectModal.css";
import { useDispatch, useSelector } from "react-redux";
import ApiServices from "../ApiService/ApiService";
import { useParams } from "react-router-dom";
import { FetchProjectDetailsById } from "../Slices/ProjectSlice";

const EditProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    projectStatus: "",
    priority: "",
  });
  const params=useParams()
  const { ProjectDetails,ProjectLoading,projectError}=useSelector((state)=>state.Project)
  console.log(ProjectDetails);
  
const dispatch=useDispatch()
  useEffect(() => {
    if (ProjectDetails) {
      setFormData({
        name: ProjectDetails.name || "",
        description: ProjectDetails.description || "",
        budget: ProjectDetails.budget || "",
        startDate: ProjectDetails.startDate ? ProjectDetails.startDate.split("T")[0] : "",
        endDate: ProjectDetails.endDate ?ProjectDetails.endDate.split("T")[0] : "",
        projectStatus: ProjectDetails.projectStatus || "",
        priority: ProjectDetails.priority || "",
        projectId:params.id
      });
    }
  }, [ProjectDetails]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
  try {
      const data=await ApiServices.updateProjectDetailsById(formData)
      alert(data.SuccessMessage)
      dispatch(FetchProjectDetailsById(params.id))
      
      onClose()
  } catch (error) {
    alert(error.message)
    
  }
  

  };

  if (!isOpen) return null;

  return (
    <div className="edit-project-modal-overlay">
      <div className="edit-project-modal">
        <header className="modal-header">
          <h2>Edit Project</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Project Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Budget ($)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>

          <div className="form-row grid-2">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row grid-2">
            <div>
              <label>Status</label>
              <select
                name="projectStatus"
                value={formData.projectStatus}
                onChange={handleChange}
              >
                <option value={formData.projectStatus}>{formData.projectStatus}</option>
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
