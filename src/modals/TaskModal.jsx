import React, { useEffect, useState, useCallback } from "react";
import ApiServices from "../ApiService/ApiService";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../Slices/TaskSlice";
import { FetchTeamByProjectId } from "../Slices/ProjectSlice";
import { useParams } from "react-router-dom";
import { setTaskModalOpen } from "../Slices/UiSlice";
import DescriptionField from "../components/CustomFields/DescriptionField";

// Constants for better maintainability
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const TOTAL_STEPS = 3;
const ALLOWED_FILE_TYPES = "image/*,.pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 10;

const TaskModal = ({ projectId, onTaskCreated }) => {
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
  const projectEndDate = ProjectDetails.endDate !== null ? new Date(ProjectDetails.endDate) : null;
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
      // case 3:
      //   if (task.assigneeIds.length === 0) {
      //     setError("Please assign at least one team member");
      //     return false;
      //   }
      //   break;
      default:
        return true;
    }
    
    return true;
  }, [task]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (currentStep === TOTAL_STEPS) return;

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
    if (!validateStep(currentStep)) return;
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
          <div className="space-y-6">
            <div className="flex justify-between gap-4 mb-1">
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Project: {ProjectDetails.name}</span>
              </div>
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Start date: {projectStartDate?.toLocaleDateString()}</span>
              </div>
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Project End date: {projectEndDate !== null ? projectEndDate?.toLocaleDateString() : "to be decided"}</span>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Milestone Information</h3>
              <p className="text-gray-600 text-sm">Tell us about your Milestone's basic details</p>
            </div>
             
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milestone Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g., Implement user authentication"
                value={task.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <DescriptionField
              description={task.description}
              setDescription={(value) => setTask({ ...task, description: value })}
              name={task.title}
              type={"milestone"}
              parent={ProjectDetails.name}
            />

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attach Documents</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                onClick={() => document.getElementById('create-task-file-input')?.click()}
              >
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p className="font-medium text-gray-700 mb-1">Click to upload files</p>
                <span className="text-xs text-gray-500">PNG, JPEG, PDF, DOC, XLS up to {MAX_FILE_SIZE_MB}MB</span>
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
                <div className="mt-4 space-y-2">
                  {task.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl">📄</div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium text-gray-900 text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
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
          <div className="space-y-6">
            <div className="flex justify-between gap-4 mb-1">
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Project: {ProjectDetails.name}</span>
              </div>
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Start date: {projectStartDate.toLocaleDateString()}</span>
              </div>
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Project End date: {projectEndDate !== null ? projectEndDate?.toLocaleDateString() : "to be decided"}</span>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Timeline & Priority</h3>
              <p className="text-gray-600 text-sm">Set your Milestone timeline and priority details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  name="startDate"
                  type="date"
                  value={task.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min={projectStartDate.toISOString().split('T')[0]}
                  max={projectEndDate?.toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  name="dueDate"
                  type="date"
                  value={task.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min={task.startDate || projectStartDate.toISOString().split('T')[0]}
                  max={projectEndDate?.toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase ${
                task.priority.toLowerCase() === 'low' ? 'bg-green-100 text-green-800' :
                task.priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                task.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                'bg-red-200 text-red-900'
              }`}>
                {task.priority} Priority
              </span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between gap-4 mb-1">
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Project: {ProjectDetails.name}</span>
              </div>
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Start date: {projectStartDate.toLocaleDateString()}</span>
              </div>
              <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                <span>Project End date: {projectEndDate !== null ? projectEndDate?.toLocaleDateString() : "to be decided"}</span>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Assignment & Dependencies</h3>
              <p className="text-gray-600 text-sm">Assign team members and set Milestone dependencies</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignees <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={searchAssignee}
                onChange={(e) => setSearchAssignee(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />

              {searchAssignee.trim() && filteredAssigneeList.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredAssigneeList.map((m) => (
                    <label key={m.user._id} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <input
                        type="checkbox"
                        checked={task.assigneeIds.includes(m.user._id)}
                        onChange={() => toggleAssignee(m.user._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                        {m.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium text-gray-900 text-sm">{m.user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{m.user.email}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedAssignees.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Assigned Members ({selectedAssignees.length})</h4>
                  <div className="space-y-2">
                    {selectedAssignees.map((m) => (
                      <div key={m.user._id} className="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                          {m.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-medium text-gray-900 text-sm">{m.user.name}</span>
                          <span className="text-xs text-gray-500 truncate">{m.user.email}</span>
                        </div>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
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
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dependencies</label>
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
                  className="mt-1"
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
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-start justify-center z-50 p-5 animate-fadeIn"
      // onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Create New Milestone</h2>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="flex justify-between">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div 
                key={i + 1} 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep >= i + 1 
                    ? currentStep > i + 1 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > i + 1 ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {renderStepContent()}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-100 mt-auto">
            <div className="flex-1">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    "Creating..."
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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