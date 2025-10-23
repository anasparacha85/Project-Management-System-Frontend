import React, { useEffect, useState, useCallback } from "react";
import "./TaskModal.css";
import ApiServices from "../ApiService/ApiService";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../Slices/TaskSlice";
import { FetchTeamByProjectId } from "../Slices/ProjectSlice";
import { useParams } from "react-router-dom";
import { setTaskModalOpen } from "../Slices/UiSlice";

// Constants for better maintainability
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const TOTAL_STEPS = 3;
const ALLOWED_FILE_TYPES = "image/*,.pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 10;

const TaskModal=({ projectId, onTaskCreated }) => {
  const dispatch = useDispatch();
  const params = useParams();
  
  // Redux state selectors
  const { TaskModalOpen } = useSelector((state) => state.UserInterface);
  const { tasks, error: tasksError, loading: tasksLoading } = useSelector((state) => state.Task);
  const { projectError, ProjectLoading, ProjectDetails } = useSelector((state) => state.Project);
  
  // Local state
  const [currentStep, setCurrentStep] = useState(1);
  const [searchAssignee, setSearchAssignee] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Task form state with better validation defaults
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assigneeIds: [],
    startDate: "",
    dueDate: "",
    dependencies: [],
    milestone: "",
    attachments: []
  });

  // Derived state
  const projectStartDate = new Date(ProjectDetails.startDate);
  const projectEndDate = new Date(ProjectDetails.endDate);
  const team = ProjectDetails.team || [];

  // Load saved form data from localStorage
  useEffect(() => {
    try {
      const savedForm = localStorage.getItem('create-milestone-form');
      if (savedForm) {
        setTask(JSON.parse(savedForm));
      }
    } catch (err) {
      console.error("Failed to load saved form data:", err);
    }
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('create-milestone-form', JSON.stringify(task));
    } catch (err) {
      console.error("Failed to save form data:", err);
    }
  }, [task]);

  // Fetch project data and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(FetchTeamByProjectId(projectId)).unwrap();
        await dispatch(fetchTasks(projectId)).unwrap();
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        // setError("Failed to load project data. Please try again.");
      }
    };

    if (TaskModalOpen && params.id) {
      fetchData();
    }
  }, [TaskModalOpen, params.id, projectId, dispatch]);

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
  const toggleAssignee = useCallback((id) => {
    setTask((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(id)
        ? prev.assigneeIds.filter((a) => a !== id)
        : [...prev.assigneeIds, id],
    }));
  }, []);

  // Get selected assignees
  const getSelectedAssignees = useCallback(() => {
    return team.filter((m) => task.assigneeIds.includes(m.user._id));
  }, [team, task.assigneeIds]);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle file uploads with validation
  const handleFileChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files);
    
    // Validate file size
    const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
    
    setTask((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
    
    // Clear the input to allow selecting the same file again
    e.target.value = null;
  }, []);

  // Remove a file from attachments
  const removeFile = useCallback((index) => {
    setTask((prev) => {
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
    setError(null);
    
    switch (step) {
      case 1:
        if (!task.title.trim()) {
          setError("Please enter a milestone title");
          return false;
        }
        break;
      case 2:
        if (!task.startDate) {
          setError("Please select a start date");
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(task.startDate);

        if (startDate < today) {
          setError("Start date cannot be in the past");
          return false;
        }

        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          if (dueDate < startDate) {
            setError("Due date should be after the start date");
            return false;
          }
        }
        break;
      case 3:
        if (task.assigneeIds.length === 0) {
          setError("Please assign at least one team member");
          return false;
        }
        break;
      default:
        return true;
    }
    
    return true;
  }, [task]);
//
  //Navigation functions
const nextStep = useCallback(() => {
  // Agar current step last step (3) hai, to validation skip karega
  if (currentStep === TOTAL_STEPS) return;

  // ✅ Sirf Step 1 aur Step 2 validate honge
  if (currentStep < TOTAL_STEPS - 1) {
    const isValid = validateStep(currentStep);
    if (!isValid) return;
  }

  setError(null);
  setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
}, [currentStep, validateStep]);


  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  }, []);

  // Close modal
  const onClose = useCallback(() => {
    dispatch(setTaskModalOpen(false));
  }, [dispatch]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Submit form
  const handleSubmit = async () => {
    // e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    // if (!validateStep(3)) return;
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();

      // Append simple fields
      formData.append("title", task.title);
      formData.append("description", task.description);
      formData.append("priority", task.priority);
      formData.append("startDate", task.startDate);
      formData.append("dueDate", task.dueDate);
      formData.append("milestone", task.milestone);

      // Append array fields as JSON strings
      formData.append("assigneeIds", JSON.stringify(task.assigneeIds));
      formData.append("dependencies", JSON.stringify(task.dependencies));

      // Append attachments
      task.attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      // API call
      const res = await ApiServices.createTask(formData, params.id);
      
      // Notify parent component and close modal
      if (onTaskCreated) onTaskCreated(res);
      
      // Clear saved form data
      localStorage.removeItem('create-milestone-form');
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error("Task creation error:", error);
      setError(error.message || "Failed to create task. Please try again.");
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
          <div className="create-task-step-content">
            <div className="projectInfo">
              <div className="create-task-parent-info">
                <span>Project: {ProjectDetails.name}</span>
              </div>
              <div className="create-task-parent-info">
                <span>Start date: {projectStartDate.toLocaleDateString()}</span>
              </div>
              <div className="create-task-parent-info">
                <span>Project End date: {projectEndDate.toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="create-task-step-header">
              <h3>Milestone Information</h3>
              <p>Tell us about your Milestone's basic details</p>
            </div>
             
            <div className="create-task-form-field">
              <label>Milestone Title <span className="create-task-required">*</span></label>
              <input
                name="title"
                type="text"
                placeholder="e.g., Implement user authentication"
                value={task.title}
                onChange={handleChange}
                className="create-task-form-input"
                required
              />
            </div>

            <div className="create-task-form-field">
              <label>Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the task requirements and objectives..."
                value={task.description}
                onChange={handleChange}
                className="create-task-form-textarea"
              />
            </div>

            <div className="create-task-form-field">
              <label>Attach Documents</label>
              <div 
                className="create-task-file-upload-area" 
                onClick={() => document.getElementById('create-task-file-input')?.click()}
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
                id="create-task-file-input"
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
                accept={ALLOWED_FILE_TYPES}
              />

              {task.attachments.length > 0 && (
                <div className="create-task-file-list">
                  {task.attachments.map((file, i) => (
                    <div key={i} className="create-task-file-item">
                      <div className="create-task-file-icon">📄</div>
                      <div className="create-task-file-details">
                        <span className="create-task-file-name">{file.name}</span>
                        <span className="create-task-file-size">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        className="create-task-file-remove"
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
          <div className="create-task-step-content">
            <div className="projectInfo">
              <div className="create-task-parent-info">
                <span>Project: {ProjectDetails.name}</span>
              </div>
              <div className="create-task-parent-info">
                <span>Start date: {projectStartDate.toLocaleDateString()}</span>
              </div>
              <div className="create-task-parent-info">
                <span>Project End date: {projectEndDate.toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="create-task-step-header">
              <h3>Timeline & Priority</h3>
              <p>Set your Milestone timeline and priority details</p>
            </div>

            <div className="create-task-form-row">
              <div className="create-task-form-field">
                <label>Start Date</label>
                <input
                  name="startDate"
                  type="date"
                  value={task.startDate}
                  onChange={handleChange}
                  className="create-task-form-input"
                  min={projectStartDate.toISOString().split('T')[0]}
                  max={projectEndDate.toISOString().split('T')[0]}
                />
              </div>
              <div className="create-task-form-field">
                <label>Due Date</label>
                <input
                  name="dueDate"
                  type="date"
                  value={task.dueDate}
                  onChange={handleChange}
                  className="create-task-form-input"
                  min={task.startDate || projectStartDate.toISOString().split('T')[0]}
                  max={projectEndDate.toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="create-task-form-field">
              <label>Priority Level</label>
              <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="create-task-form-select"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="create-task-pri-indicator">
              <span className={`create-task-pri-badge create-task-priority-${task.priority.toLowerCase()}`}>
                {task.priority} Priority
              </span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="create-task-step-content">
            <div className="projectInfo">
              <div className="create-task-parent-info">
                <span>Project: {ProjectDetails.name}</span>
              </div>
              <div className="create-task-parent-info">
                <span>Start date: {projectStartDate.toLocaleDateString()}</span>
              </div>
              <div className="create-task-parent-info">
                <span>Project End date: {projectEndDate.toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="create-task-step-header">
              <h3>Assignment & Dependencies</h3>
              <p>Assign team members and set Milestone dependencies</p>
            </div>

            <div className="create-task-form-field">
              <label>Assignees <span className="create-task-required">*</span></label>
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={searchAssignee}
                onChange={(e) => setSearchAssignee(e.target.value)}
                className="create-task-form-input create-task-search-input"
              />

              {searchAssignee.trim() && filteredAssigneeList.length > 0 && (
                <div className="create-task-member-search-results">
                  {filteredAssigneeList.map((m) => (
                    <label key={m.user._id} className="create-task-member-item">
                      <input
                        type="checkbox"
                        checked={task.assigneeIds.includes(m.user._id)}
                        onChange={() => toggleAssignee(m.user._id)}
                      />
                      <div className="create-task-member-avatar">
                        {m.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="create-task-member-info">
                        <span className="create-task-member-name">{m.user.name}</span>
                        <span className="create-task-member-email">{m.user.email}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedAssignees.length > 0 && (
                <div className="create-task-selected-members">
                  <h4>Assigned Members ({selectedAssignees.length})</h4>
                  <div className="create-task-selected-member-list">
                    {selectedAssignees.map((m) => (
                      <div key={m.user._id} className="create-task-selected-member">
                        <div className="create-task-member-avatar">
                          {m.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="create-task-member-info">
                          <span className="create-task-member-name">{m.user.name}</span>
                          <span className="create-task-member-email">{m.user.email}</span>
                        </div>
                        <button
                          type="button"
                          className="create-task-remove-member"
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

            {tasks.length > 0 && (
              <div className="create-task-form-field">
                <label>Dependencies</label>
                <Select
                  isMulti
                  options={tasks.map((t) => ({ value: t._id, label: t.title }))}
                  value={tasks
                    .filter((t) => task.dependencies.includes(t._id))
                    .map((t) => ({ value: t._id, label: t.title }))}
                  onChange={(selectedOptions) =>
                    setTask({ 
                      ...task, 
                      dependencies: selectedOptions.map((opt) => opt.value) 
                    })
                  }
                  className="create-task-dependencies-select"
                  placeholder="Select dependent tasks..."
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!TaskModalOpen) return null;

  return (
    <div className="create-task-modal-backdrop" onClick={handleBackdropClick}>
      <div className="create-task-modal-container">
        <div className="create-task-modal-header">
          <h2>Create New Milestone</h2>
          <button className="create-task-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="create-task-progress-container">
          <div className="create-task-progress-bar">
            <div
              className="create-task-progress-fill"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="create-task-step-indicators">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div 
                key={i + 1} 
                className={`create-task-step-indicator ${currentStep >= i + 1 ? 'create-task-active' : ''} ${currentStep > i + 1 ? 'create-task-completed' : ''}`}
              >
                {currentStep > i + 1 ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="create-task-modal-form" >
          <div className="create-task-modal-content">
            {renderStepContent()}
          </div>
          
          {error && (
            <div className="create-project-error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <div className="create-task-modal-footer">
            <div className="create-task-footer-left">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  className="create-task-btn-secondary" 
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

            <div className="create-task-footer-right">
              <button 
                type="button" 
                className="create-task-btn-ghost" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button 
                  type="button" 
                  className="create-task-btn-primary" 
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
                  className="create-task-btn-primary"
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
                      Create Task
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

export default TaskModal;