import React, { useEffect, useState, useCallback } from "react";
import ApiServices from "../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubTasksBytaskId, setError } from "../Slices/TaskSlice";
import { setSubTaskModalOpen } from "../Slices/UiSlice";
import { useParams } from "react-router-dom";
import DescriptionField from "../components/CustomFields/DescriptionField";

// Constants for better maintainability
const PRIORITIES = ["Low", "Medium", "High"];
const TOTAL_STEPS = 3;
const ALLOWED_FILE_TYPES = "image/*,.pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 10;

const SubTaskModal = ({ parentTask, onSubTaskCreated }) => {
  const dispatch = useDispatch();
  const params = useParams();
  
  
  // Redux state selectors with proper error handling
  const { SubTaskModalOpen } = useSelector((state) => state?.UserInterface || {});
  const { error } = useSelector((state) => state?.Task || {});
  useEffect(() => {
  if (SubTaskModalOpen) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [SubTaskModalOpen]);

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


  // Derived state with error handling
  const parentStartDate = parentTask?.startDate ? new Date(parentTask.startDate) : new Date();
  const parentDueDate = parentTask?.dueDate ? new Date(parentTask.dueDate) : null;

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
      if (!params?.id) {
        dispatch(setError("Task ID is missing"));
        return;
      }
      
      const data = await ApiServices.getTeamByTaskId(params.id);
      console.log("Team data:", data);
      setTeam(data?.assignees || []);
    } catch (error) {
      console.error("Failed to fetch team:", error);
      dispatch(setError(error?.message || "Failed to fetch team members"));
    }
  }, [params?.id, dispatch]);

  useEffect(() => {
    if (SubTaskModalOpen) {
      fetchTeamByTaskId();
    }
  }, [SubTaskModalOpen, fetchTeamByTaskId]);

  // Filter assignees based on search
  const filteredAssignees = useCallback(() => {
    if (!searchAssignee?.trim()) return [];
    
    return team.filter(
      (m) =>
        m?.user?.name?.toLowerCase()?.includes(searchAssignee.toLowerCase()) ||
        m?.user?.email?.toLowerCase()?.includes(searchAssignee.toLowerCase())
    );
  }, [searchAssignee, team]);

  // Toggle assignee selection
  const toggleAssignee = useCallback((userId) => {
    setSubTask((prev) => {
      const isAlreadyAssigned = prev?.assignees?.some(a => a?.user === userId);
      
      if (isAlreadyAssigned) {
        return {
          ...prev,
          assignees: prev?.assignees?.filter(a => a?.user !== userId) || []
        };
      } else {
        return {
          ...prev,
          assignees: [...(prev?.assignees || []), { user: userId, status: "todo" }]
        };
      }
    });
  }, []);

  // Get selected assignees
  const getSelectedAssignees = useCallback(() => {
    return team.filter((m) => 
      subTask?.assignees?.some(a => a?.user === m?.user?._id)
    );
  }, [team, subTask?.assignees]);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setSubTask((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle file uploads with validation
  const handleFileChange = useCallback((e) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    
    // Validate file size
    const oversizedFiles = newFiles.filter(file => file?.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      dispatch(setError(`Some files exceed the maximum size of ${MAX_FILE_SIZE_MB}MB`));
      return;
    }
    
    setSubTask((prev) => ({
      ...prev,
      attachments: [...(prev?.attachments || []), ...newFiles]
    }));
    
    // Clear the input to allow selecting the same file again
    e.target.value = null;
  }, [dispatch]);

  // Remove a file from attachments
  const removeFile = useCallback((index) => {
    setSubTask((prev) => {
      const newFiles = [...(prev?.attachments || [])];
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
        if (!subTask?.title?.trim()) {
          dispatch(setError("Please enter a subtask title"));
          return false;
        }
        break;
      case 2:
        if (!subTask?.startDate) {
          dispatch(setError("Please select a start date"));
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(subTask.startDate);

        if (startDate < parentStartDate) {
          dispatch(setError("Start date cannot be before the parent task start date"));
          return false;
        }

        if (subTask?.dueDate) {
          const dueDate = new Date(subTask.dueDate);
          
          if (dueDate < startDate) {
            dispatch(setError("Due date should be after the start date"));
            return false;
          }
        }
        break;
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
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    dispatch(setError(null));
    
    try {
      const formData = new FormData();
      
      // Append simple fields with error handling
      formData.append("title", subTask?.title || "")
      formData.append("description", subTask?.description || "");
      formData.append("priority", subTask?.priority || "Medium");
      formData.append("startDate", subTask?.startDate || "");
      formData.append("dueDate", subTask?.dueDate || "");
      
      // Append assignees as JSON
      formData.append("assignees", JSON.stringify(subTask?.assignees || []));
      
      // Append attachments
      subTask?.attachments?.forEach(file => {
        if (file) {
          formData.append("attachments", file);
        }
      });
      
      // Create the subtask
      const res = await ApiServices.createSubtask(formData, params?.id);
      console.log(res);
      
      // Show success message
      if (res?.SuccessMessage) {
        alert(res.SuccessMessage);
      }
      
      // Refresh subtasks list
      dispatch(fetchSubTasksBytaskId(params?.id));
      
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
      dispatch(setError(error?.message || "Failed to create subtask. Please try again."));
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
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Information</h3>
              <p className="text-sm text-gray-600">Tell us about your task's basic details</p>
              {parentTask && (
                <div className="mt-4 space-y-2">
                  <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <span>Milestone: {parentTask?.title}</span>
                  </div>
                  <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <span>Start date: {parentStartDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <span>End date: {parentDueDate ? parentDueDate?.toLocaleDateString() : "to be decided"}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g., Implement user authentication"
                value={subTask?.title || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

             <DescriptionField
                        description={subTask.description}
                        setDescription={(value) => setSubTask({ ...subTask, description: value })}
                        name={subTask.title}
                        type={"checkpoint"}
                        parent={parentTask.title}
                      />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Attach Documents</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                onClick={() => document.getElementById('create-subtask-file-input')?.click()}
              >
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p className="text-sm font-medium text-gray-900 mb-1">Click to upload files</p>
                <span className="text-xs text-gray-500">PNG, JPEG, PDF, DOC, XLS up to {MAX_FILE_SIZE_MB}MB</span>
              </div>
              <input
                id="create-subtask-file-input"
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
                accept={ALLOWED_FILE_TYPES}
              />

              {subTask?.attachments?.length > 0 && (
                <div className="space-y-2 mt-4">
                  {subTask.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="text-lg">📄</div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-gray-900 truncate">
                          {file?.name}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {file?.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
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
            <div className="space-y-2">
              <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                <span>Milestone: {parentTask?.title}</span>
              </div>
              <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                <span>Milestone start date: {parentStartDate?.toLocaleDateString()}</span>
              </div>
              <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                <span>Milestone End date: {parentDueDate ? parentDueDate?.toLocaleDateString() : "to be decided"}</span>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Timeline & Priority</h3>
              <p className="text-sm text-gray-600">Set your task timeline and priority details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="startDate"
                  type="date"
                  value={subTask?.startDate || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min={parentStartDate?.toISOString()?.split('T')[0]}
                  max={parentDueDate?.toISOString()?.split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  name="dueDate"
                  type="date"
                  value={subTask?.dueDate || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min={subTask?.startDate || parentStartDate?.toISOString()?.split('T')[0]}
                  max={parentDueDate?.toISOString()?.split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Priority Level</label>
              <select
                name="priority"
                value={subTask?.priority || "Medium"}
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
                subTask?.priority?.toLowerCase() === 'low' 
                  ? 'bg-green-100 text-green-800'
                  : subTask?.priority?.toLowerCase() === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {subTask?.priority} Priority
              </span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Assignment</h3>
              <p className="text-sm text-gray-600">Assign team members to this task</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Assignees <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Search members by name or email..."
                  value={searchAssignee}
                  onChange={(e) => setSearchAssignee(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />

                {searchAssignee?.trim() && filteredAssigneeList.length > 0 && (
                  <div className="border border-gray-200 rounded-lg mt-2 max-h-48 overflow-y-auto">
                    {filteredAssigneeList.map((m) => (
                      <label key={m?.user?._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={subTask?.assignees?.some(a => a?.user === m?.user?._id)}
                          onChange={() => toggleAssignee(m?.user?._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {m?.user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-gray-900 truncate">
                              {m?.user?.name}
                            </span>
                            <span className="block text-xs text-gray-500 truncate">
                              {m?.user?.email}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {selectedAssignees.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Assigned Members ({selectedAssignees.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedAssignees.map((m) => (
                        <div key={m?.user?._id} className="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {m?.user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-gray-900">
                              {m?.user?.name}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {m?.user?.email}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                            onClick={() => removeAssignee(m?.user?._id)}
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
          </div>
        );

      default:
        return null;
    }
  };

  if (!SubTaskModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-start justify-center p-4 z-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Add new task to your checklist</h2>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderStepContent()}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    "Creating..."
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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