import React, { useEffect, useState } from "react";
import "./SubtaskModal.css";
import ApiServices from "../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubTasksBytaskId, setError } from "../Slices/TaskSlice";
import { FetchTeamByProjectId } from "../Slices/ProjectSlice";
import { setSubTaskModalOpen } from "../Slices/UiSlice";
import { useParams } from "react-router-dom";


const SubTaskModal = ({ parentTask, onSubTaskCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchAssignee, setSearchAssignee] = useState("");
  const [subTask, setSubTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignees: [],
    startDate: "",
    dueDate: "",
    attachments: []
  });
  const [team, setTeam] = useState([])
  
  const { SubTaskModalOpen } = useSelector((state) => state.UserInterface);
  const params = useParams();
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { error } = useSelector((state) => state.Task);
  const { ProjectDetails } = useSelector((state) => state.Project);
  const taskId = params.id;
  // const team = ProjectDetails.team || [];
  const totalSteps = 3;
  const priorities = ["Low", "Medium", "High"];
  
  // Load saved form data from localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem('create-subtask-form');
    if (savedForm) {
      setSubTask(JSON.parse(savedForm));
    }
  }, []);
  
  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem('create-subtask-form', JSON.stringify(subTask));
  }, [subTask]);

  // Fetch team members when modal opens
  const fetchTeamBytaskid=async()=>{
    try {
      const data=await ApiServices.getTeamByTaskId(params.id)
      console.log("hi",data);
      setTeam(data.assignees)
      

    } catch (error) {
      console.log(error);
      
      setError(error.message)

      
    }
  }

  useEffect(() => {
    if (SubTaskModalOpen ) {
     fetchTeamBytaskid()
    }
  }, [SubTaskModalOpen]);

  const filteredAssignees = team.filter(
    (m) =>
      m.user.name.toLowerCase().includes(searchAssignee.toLowerCase()) ||
      m.user.email.toLowerCase().includes(searchAssignee.toLowerCase())
  );

  const toggleAssignee = (userId) => {
    setSubTask((prev) => {
      const isAlreadyAssigned = prev.assignees.some(a => a.user === userId);
      
      if (isAlreadyAssigned) {
        return {
          ...prev,
          assignees: prev.assignees.filter(a => a.user !== userId)
        };
      } else {
        return {
          ...prev,
          assignees: [...prev.assignees, { user: userId, status: "todo" }]
        };
      }
    });
  };

  const getSelectedAssignees = () => {
    return team.filter((m) => 
      subTask.assignees.some(a => a.user === m.user._id)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubTask({ ...subTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append simple fields
      formData.append("title", subTask.title);
      formData.append("description", subTask.description);
      formData.append("priority", subTask.priority);
      formData.append("startDate", subTask.startDate);
      formData.append("dueDate", subTask.dueDate);
    //   formData.append("task", taskId); // Parent task ID
      
      // Append assignees as JSON
      formData.append("assignees", JSON.stringify(subTask.assignees));
      
      // Append attachments
      subTask.attachments.forEach(file => {
        formData.append("attachments", file);
      });
      
      // Create the subtask
     for (let [key, value] of formData.entries()) {
  console.log(key, value);
}

      
      const res = await ApiServices.createSubtask(formData,params.id);
      alert(res.SuccessMessage)
     
      
      // Call the callback if provided
    //   if (onSubTaskCreated) {
    //     onSubTaskCreated(res);
    //   }
      dispatch(fetchSubTasksBytaskId(params.id))
      
      dispatch(setSubTaskModalOpen(false));
    } catch (error) {
      dispatch(setError(error.message));
      console.error("Subtask creation error: ", error.message);
      
    }
    
    // Clear saved form data
    localStorage.removeItem('create-subtask-form');
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!subTask.title.trim()) {
          dispatch(setError("Please enter a subtask title"));
          return false;
        }
        break;
      case 2:
        if (!subTask.startDate) {
          dispatch(setError("Please select a start date"));
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(subTask.startDate);

        if (startDate < today) {
          dispatch(setError("Start date cannot be in the past"));
          return false;
        }

        if (subTask.dueDate) {
          const dueDate = new Date(subTask.dueDate);
          if (dueDate < startDate) {
            dispatch(setError("Due date should be after the start date"));
            return false;
          }
        }
        break;
    }
    dispatch(setError(null));
    return true;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };
const startDate=new Date(parentTask.startDate)
const dueDate=new Date(parentTask.dueDate)
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    dispatch(setError(null));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(setSubTaskModalOpen(false));
    }
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSubTask((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
  };

  const removeFile = (index) => {
    setSubTask((prev) => {
      const newFiles = [...prev.attachments];
      newFiles.splice(index, 1);
      return { ...prev, attachments: newFiles };
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="create-subtask-step-content">
            <div className="create-subtask-step-header">
              <h3>Subtask Information</h3>
              <p>Tell us about your subtask's basic details</p>
              {parentTask && (
                <>
                <div className="create-subtask-parent-info">
                  <span>milestone: {parentTask.title}</span>
                  
                </div>
                  <div className="create-subtask-parent-info">
                       <span> start date: {startDate.toLocaleDateString()}</span>
                  </div>
              
                    <div className="create-subtask-parent-info">
                       <span> Task start date: {dueDate.toLocaleDateString()}</span>
                  </div>
                    </>
              )}
            </div>

            <div className="create-subtask-form-field">
              <label>Subtask Title <span className="create-subtask-required">*</span></label>
              <input
                name="title"
                type="text"
                placeholder="e.g., Implement user authentication"
                value={subTask.title}
                onChange={handleChange}
                className="create-subtask-form-input"
                required
              />
            </div>

            <div className="create-subtask-form-field">
              <label>Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the subtask requirements and objectives..."
                value={subTask.description}
                onChange={handleChange}
                className="create-subtask-form-textarea"
              />
            </div>

            <div className="create-subtask-form-field">
              <label>Attach Documents</label>
              <div className="create-subtask-file-upload-area" onClick={() => document.getElementById('create-subtask-file-input')?.click()}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p>Click to upload files </p>
                <span>PNG, JPEG, PDF, DOC, XLS up to 10MB</span>
              </div>
              <input
                id="create-subtask-file-input"
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
              />

              {subTask.attachments.length > 0 && (
                <div className="create-subtask-file-list">
                  {subTask.attachments.map((file, i) => (
                    <div key={i} className="create-subtask-file-item">
                      <div className="create-subtask-file-icon">📄</div>
                      <div className="create-subtask-file-details">
                        <span className="create-subtask-file-name">{file.name}</span>
                        <span className="create-subtask-file-size">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button
                        type="button"
                        className="create-subtask-file-remove"
                        onClick={() => removeFile(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="create-subtask-step-content">
            <div className="create-subtask-parent-info">
                  <span>milestone: {parentTask.title}</span>
                  
                </div>
                  <div className="create-subtask-parent-info">
                       <span>milestone start date: {startDate.toLocaleDateString()}</span>
                  </div>
              
                    <div className="create-subtask-parent-info">
                       <span> milestone end date: {dueDate.toLocaleDateString()}</span>
                  </div>
            <div className="create-subtask-step-header">
              <h3>Timeline & Priority</h3>
              <p>Set your subtask timeline and priority details</p>
            </div>

            <div className="create-subtask-form-row">
              <div className="create-subtask-form-field">
                <label>Start Date <span className="create-subtask-required">*</span></label>
                <input
                  name="startDate"
                  type="date"
                  value={subTask.startDate}
                  onChange={handleChange}
                  className="create-subtask-form-input"
                />
              </div>
              <div className="create-subtask-form-field">
                <label>Due Date</label>
                <input
                  name="dueDate"
                  type="date"
                  value={subTask.dueDate}
                  onChange={handleChange}
                  className="create-subtask-form-input"
                />
              </div>
            </div>

            <div className="create-subtask-form-field">
              <label>Priority Level</label>
              <select
                name="priority"
                value={subTask.priority}
                onChange={handleChange}
                className="create-subtask-form-select"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="create-subtask-pri-indicator">
              <span className={`create-subtask-pri-badge create-subtask-priority-${subTask.priority.toLowerCase()}`}>
                {subTask.priority} Priority
              </span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="create-subtask-step-content">
            <div className="create-subtask-step-header">
              <h3>Assignment</h3>
              <p>Assign team members to this subtask</p>
            </div>

            <div className="create-subtask-form-field">
              <label>Assignees <span className="create-subtask-required">*</span></label>
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={searchAssignee}
                onChange={(e) => setSearchAssignee(e.target.value)}
                className="create-subtask-form-input create-subtask-search-input"
              />

              {searchAssignee.trim() && filteredAssignees.length > 0 && (
                <div className="create-subtask-member-search-results">
                  {filteredAssignees.map((m) => (
                    <label key={m.user._id} className="create-subtask-member-item horizontal-layout">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={subTask.assignees.some(a => a.user === m.user._id)}
                          onChange={() => toggleAssignee(m.user._id)}
                        />
                      </div>
                      <div className="create-subtask-member-details">
                        <div className="create-subtask-member-avatar">
                          {m.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="create-subtask-member-info">
                          <span className="create-subtask-member-name">{m.user.name}</span>
                          <span className="create-subtask-member-email">{m.user.email}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {getSelectedAssignees().length > 0 && (
                <div className="create-subtask-selected-members">
                  <h4>Assigned Members ({getSelectedAssignees().length})</h4>
                  <div className="create-subtask-selected-member-list">
                    {getSelectedAssignees().map((m) => (
                      <div key={m.user._id} className="create-subtask-selected-member">
                        <div className="create-subtask-member-avatar">
                          {m.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="create-subtask-member-info">
                          <span className="create-subtask-member-name">{m.user.name}</span>
                          <span className="create-subtask-member-email">{m.user.email}</span>
                        </div>
                        <button
                          type="button"
                          className="create-subtask-remove-member"
                          onClick={() => toggleAssignee(m.user._id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!SubTaskModalOpen) return null;

  return (
    <div className="create-subtask-modal-backdrop" >
      <div className="create-subtask-modal-container">
        <div className="create-subtask-modal-header">
          <h2>Create New Subtask</h2>
          <button className="create-subtask-modal-close" onClick={() => dispatch(setSubTaskModalOpen(false))}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="create-subtask-progress-container">
          <div className="create-subtask-progress-bar">
            <div
              className="create-subtask-progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="create-subtask-step-indicators">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i + 1} className={`create-subtask-step-indicator ${currentStep >= i + 1 ? 'create-subtask-active' : ''} ${currentStep > i + 1 ? 'create-subtask-completed' : ''}`}>
                {currentStep > i + 1 ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="create-subtask-modal-form">
          <div className="create-subtask-modal-content">
            {renderStepContent()}
          </div>
          
          {error && (
            <div className="create-subtask-error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <div className="create-subtask-modal-footer">
            <div className="create-subtask-footer-left">
              {currentStep > 1 && (
                <button type="button" className="create-subtask-btn-secondary" onClick={prevStep}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="create-subtask-footer-right">
              <button type="button" className="create-subtask-btn-ghost" onClick={() => dispatch(setSubTaskModalOpen(false))}>
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button type="button" className="create-subtask-btn-primary" onClick={nextStep}>
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              ) : (
                <button onClick={handleSubmit} type="submit" className="create-subtask-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Create Subtask
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubTaskModal;