import React, { useEffect, useState, useCallback } from "react";
import "./SubtaskModal.css";
import ApiServices from "../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubTasksBytaskId, setError } from "../Slices/TaskSlice";
import { setSubTaskModalOpen } from "../Slices/UiSlice";
import { useParams } from "react-router-dom";

// Constants for better maintainability
const PRIORITIES = ["Low", "Medium", "High"];
const TOTAL_STEPS = 3;
const ALLOWED_FILE_TYPES = "image/*,.pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 10;

const SubTaskModal = ({ parentTask, onSubTaskCreated }) => {
  const dispatch = useDispatch();
  const params = useParams();
  
  // Redux state selectors
  const { SubTaskModalOpen } = useSelector((state) => state.UserInterface);
  const { error } = useSelector((state) => state.Task);
  
  // Local state
  const [currentStep, setCurrentStep] = useState(1);
  const [searchAssignee, setSearchAssignee] = useState("");
  const [team, setTeam] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Subtask form state
  const [subTask, setSubTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignees: [],
    startDate: "",
    dueDate: "",
    attachments: []
  });

  // Derived state
  const parentStartDate = new Date(parentTask.startDate);
  const parentDueDate = parentTask.dueDate?new Date(parentTask.dueDate):null;

  // Load saved form data from localStorage
  useEffect(() => {
    try {
      const savedForm = localStorage.getItem('create-subtask-form');
      if (savedForm) {
        setSubTask(JSON.parse(savedForm));
      }
    } catch (err) {
      console.error("Failed to load saved form data:", err);
    }
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('create-subtask-form', JSON.stringify(subTask));
    } catch (err) {
      console.error("Failed to save form data:", err);
    }
  }, [subTask]);

  // Fetch team members when modal opens
  const fetchTeamByTaskId = useCallback(async () => {
    try {
      const data = await ApiServices.getTeamByTaskId(params.id);
      console.log("Team data:", data);
      setTeam(data.assignees || []);
    } catch (error) {
      console.error("Failed to fetch team:", error);
      dispatch(setError(error.message));
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (SubTaskModalOpen) {
      fetchTeamByTaskId();
    }
  }, [SubTaskModalOpen, fetchTeamByTaskId]);

  // Filter assignees based on search
  const filteredAssignees = useCallback(() => {
    if (!searchAssignee.trim()) return [];
    
    return team.filter(
      (m) =>
        m.user.name.toLowerCase().includes(searchAssignee.toLowerCase()) ||
        m.user.email.toLowerCase().includes(searchAssignee.toLowerCase())
    );
  }, [searchAssignee, team]);

  // Toggle assignee selection
  const toggleAssignee = useCallback((userId) => {
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
  }, []);

  // Get selected assignees
  const getSelectedAssignees = useCallback(() => {
    return team.filter((m) => 
      subTask.assignees.some(a => a.user === m.user._id)
    );
  }, [team, subTask.assignees]);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setSubTask((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle file uploads with validation
  const handleFileChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files);
    
    // Validate file size
    const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      dispatch(setError(`Some files exceed the maximum size of ${MAX_FILE_SIZE_MB}MB`));
      return;
    }
    
    setSubTask((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
    
    // Clear the input to allow selecting the same file again
    e.target.value = null;
  }, [dispatch]);

  // Remove a file from attachments
  const removeFile = useCallback((index) => {
    setSubTask((prev) => {
      const newFiles = [...prev.attachments];
      newFiles.splice(index, 1);
      return { ...prev, attachments: newFiles };
    });
  }, []);

  // Remove an assignee
  const removeAssignee = useCallback((id) => {
    toggleAssignee(id);
  }, [toggleAssignee]);

  // Validate current step
  const validateStep = useCallback((step) => {
    dispatch(setError(null));
    
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

        // if (startDate < today) {
        //   dispatch(setError("Start date cannot be in the past"));
        //   return false;
        // }

        // Validate against parent task dates
        if (startDate < parentStartDate) {
          dispatch(setError("Start date cannot be before the parent task start date"));
          return false;
        }

        if (subTask.dueDate) {
          const dueDate = new Date(subTask.dueDate);
          
          if (dueDate < startDate) {
            dispatch(setError("Due date should be after the start date"));
            return false;
          }
          
          // if (dueDate > parentDueDate) {
          //   dispatch(setError("Due date cannot be after the parent task due date"));
          //   return false;
          // }
        }
        break;
      // case 3:
      //   if (subTask.assignees.length === 0) {
      //     dispatch(setError("Please assign at least one team member"));
      //     return false;
      //   }
      //   break;
      default:
        return true;
    }
    
    return true;
  }, [subTask, parentStartDate, parentDueDate, dispatch]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    dispatch(setError(null));
  }, [dispatch]);

  // Close modal
  const onClose = useCallback(() => {
    dispatch(setSubTaskModalOpen(false));
  }, [dispatch]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Submit form
  const handleSubmit = async () => {
   
      console.log("submit");
    
    console.log(subTask);
    // e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    dispatch(setError(null));
    
    try {
      const formData = new FormData();
      
      // Append simple fields
      formData.append("title", subTask.title)
      formData.append("description", subTask.description);
      formData.append("priority", subTask.priority);
      formData.append("startDate", subTask.startDate);
      formData.append("dueDate", subTask.dueDate);
      
      // Append assignees as JSON
      formData.append("assignees", JSON.stringify(subTask.assignees));
      
      // Append attachments
      subTask.attachments.forEach(file => {
        formData.append("attachments", file);
      });
      
      // Create the subtask
      const res = await ApiServices.createSubtask(formData, params.id);
      console.log(res);
      
      
      // Show success message
      if (res.SuccessMessage) {
        alert(res.SuccessMessage);
      }
      
      // Refresh subtasks list
      dispatch(fetchSubTasksBytaskId(params.id));
      
      // Call the callback if provided
      if (onSubTaskCreated) {
        onSubTaskCreated(res);
      }
      
      // Close modal
      onClose();
      
      // Clear saved form data
      localStorage.removeItem('create-subtask-form');
    } catch (error) {
      console.error("Subtask creation error:", error);
      dispatch(setError(error.message || "Failed to create subtask. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    const selectedAssignees = getSelectedAssignees();
    const filteredAssigneeList = filteredAssignees();

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
                    <span>Milestone: {parentTask.title}</span>
                  </div>
                  <div className="create-subtask-parent-info">
                    <span>Start date: {parentStartDate.toLocaleDateString()}</span>
                  </div>
                  <div className="create-subtask-parent-info">
                                    <span>End date: {parentDueDate!==null?parentDueDate?.toLocaleDateString():"to be decided"}</span>

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
              <div 
                className="create-subtask-file-upload-area" 
                onClick={() => document.getElementById('create-subtask-file-input')?.click()}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p>Click to upload files</p>
                <span>PNG, JPEG, PDF, DOC, XLS up to {MAX_FILE_SIZE_MB}MB</span>
              </div>
              <input
                id="create-subtask-file-input"
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
                accept={ALLOWED_FILE_TYPES}
              />

              {subTask.attachments.length > 0 && (
                <div className="create-subtask-file-list">
                  {subTask.attachments.map((file, i) => (
                    <div key={i} className="create-subtask-file-item">
                      <div className="create-subtask-file-icon">📄</div>
                      <div className="create-subtask-file-details">
                        <span className="create-subtask-file-name">{file.name}</span>
                        <span className="create-subtask-file-size">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
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
              <span>Milestone: {parentTask.title}</span>
            </div>
            <div className="create-subtask-parent-info">
              <span>Milestone start date: {parentStartDate.toLocaleDateString()}</span>
            </div>
            <div className="create-subtask-parent-info">
                                                <span>Milestone End date: {parentDueDate!==null?parentDueDate?.toLocaleDateString():"to be decided"}</span>

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
                  min={parentStartDate.toISOString().split('T')[0]}
                  max={parentDueDate?.toISOString().split('T')[0]}
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
                  min={subTask.startDate || parentStartDate.toISOString().split('T')[0]}
                  max={parentDueDate?.toISOString().split('T')[0]}
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
                {PRIORITIES.map((p) => (
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

              {searchAssignee.trim() && filteredAssigneeList.length > 0 && (
                <div className="create-subtask-member-search-results">
                  {filteredAssigneeList.map((m) => (
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

              {selectedAssignees.length > 0 && (
                <div className="create-subtask-selected-members">
                  <h4>Assigned Members ({selectedAssignees.length})</h4>
                  <div className="create-subtask-selected-member-list">
                    {selectedAssignees.map((m) => (
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
                          onClick={() => removeAssignee(m.user._id)}
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
    <div className="create-subtask-modal-backdrop" onClick={handleBackdropClick}>
      <div className="create-subtask-modal-container">
        <div className="create-subtask-modal-header">
          <h2>Create New Subtask</h2>
          <button className="create-subtask-modal-close" onClick={onClose}>
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
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="create-subtask-step-indicators">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div 
                key={i + 1} 
                className={`create-subtask-step-indicator ${currentStep >= i + 1 ? 'create-subtask-active' : ''} ${currentStep > i + 1 ? 'create-subtask-completed' : ''}`}
              >
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
                <button 
                  type="button" 
                  className="create-subtask-btn-secondary" 
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="create-subtask-footer-right">
              <button 
                type="button" 
                className="create-subtask-btn-ghost" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button 
                  type="button" 
                  className="create-subtask-btn-primary" 
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="create-subtask-btn-primary"
                  disabled={isSubmitting}
                   onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    "Creating..."
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      Create Subtask
                    </>
                  )}
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