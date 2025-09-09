import React, { useEffect, useState } from "react";
import "./TaskModal.css";
import ApiServices from "../ApiService/ApiService";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, setError } from "../Slices/TaskSlice";
import { FetchTeamByProjectId } from "../Slices/ProjectSlice";
import { StepForward } from "lucide-react";
import { useParams } from "react-router-dom";
import { setTaskModalOpen } from "../Slices/UiSlice";

const TaskModal = ({  projectId, onTaskCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchAssignee, setSearchAssignee] = useState("");
  const {TaskModalOpen}=useSelector((state)=>state.UserInterface)
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
  const params=useParams()
  useEffect(()=>{
    const savedform=localStorage.getItem('create-milestone-form')
    if(savedform){
      setTask(JSON.parse(savedform))
    }
   
  },[])
  useEffect(()=>{
    localStorage.setItem('create-milestone-form',JSON.stringify(task))
  },[task])

  const [Tasks, setTasks] = useState([])
  const {tasks, error, loading} = useSelector((state) => state.Task)
  const dispatch = useDispatch()

  const [members, setMembers] = useState([])
  // const [Error, setError] = useState(null)
  const {projectError,  ProjectLoading,ProjectDetails} = useSelector((state) => state.Project)
  console.log("i am project details",ProjectDetails);
  const projectStartDate=new Date(ProjectDetails.startDate);
  const ProjectEdnDate=new Date(ProjectDetails.endDate);
  
  const totalSteps = 3;
  const priorities = ["Low", "Medium", "High", "Critical"];
  const onClose=()=>{
    dispatch(setTaskModalOpen(false))
  }
  useEffect(() => {
    dispatch(FetchTeamByProjectId(projectId)).unwrap()
    .then((data) => {
      console.log("hi",data);
    }).catch((error)=>{
      console.log("bye",error);
      
    })
    dispatch(fetchTasks(projectId))
    .unwrap()
    .then((data) => {
      console.log(data);
    })
  }, [params.id])
const team=ProjectDetails.team

  const filteredAssignees = team.filter(
    (m) =>
      m.user.name.toLowerCase().includes(searchAssignee.toLowerCase()) ||
      m.user.email.toLowerCase().includes(searchAssignee.toLowerCase())
  );

  const toggleAssignee = (id) => {
    setTask((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(id)
        ? prev.assigneeIds.filter((a) => a !== id)
        : [...prev.assigneeIds, id],
    }));
  };

  const getSelectedAssignees = () => {
    return team.filter((m) => task.assigneeIds.includes(m.user._id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

 const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files);
  setTask((prev) => ({
    ...prev,
    attachments: [...prev.attachments, ...newFiles]
  }));
};

  const handleSubmit =async (e) => {
    e.preventDefault();
   try {
    console.log(task);
    
    const formdata = new FormData();

    // simple fields append karo
    formdata.append("title", task.title);
    formdata.append("description", task.description);
    formdata.append("priority", task.priority);
    formdata.append("startDate", task.startDate);
    formdata.append("dueDate", task.dueDate);
    formdata.append("milestone", task.milestone);

    // array fields (assigneeIds, dependencies) ko JSON stringify karke bhejna behtar hoga
    formdata.append("assigneeIds", JSON.stringify(task.assigneeIds));
    formdata.append("dependencies", JSON.stringify(task.dependencies));

    // attachments agar multiple files hain
    task.attachments.forEach((file) => {
      formdata.append("attachments", file);
    });
// console.log(projectId,"h");
     
    // ab api call
    const res = await ApiServices.createTask(formdata, params.id);
    alert('MileStone created')
    console.log("Task created: ", res);
    
    
    onClose()
  } catch (error) {
    dispatch(setError(error.message))
    // alert(error.message)
    console.error("Task creation error: ", error.message);
  }
    localStorage.removeItem('create-milestone-form')
    
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!task.title.trim()) {
          dispatch(setError("Please enter a milestone title"));
          return false;
        }
        break;
      case 2:
        if (!task.startDate) {
            dispatch(setError("Please select a start date"));
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(task.startDate);

        if (startDate < today) {
          dispatch(setError("Start date cannot be in the past"));
          return false;
        }

        if (task.endDate) {
          const endDate = new Date(task.endDate);
          if (endDate < startDate) {
              dispatch(setError("End date should be after the start date"));
            return false;
          }
        }
        break;
     
    }
    setError(null);
    return true;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };


  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="create-task-step-content">
          <div className="projectInfo">
          <div className="create-task-parent-info">
                  <span>Project: {ProjectDetails.name}</span>
                  
                </div>
                  <div className="create-task-parent-info">
                       <span> start date: {projectStartDate.toLocaleDateString()}</span>
                  </div>
              
                    <div className="create-task-parent-info">
                       <span> Project End date: {ProjectEdnDate.toLocaleDateString()}</span>
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
              <div className="create-task-file-upload-area" onClick={() => document.getElementById('create-task-file-input')?.click()}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p>Click to upload files </p>
                <span>PNG, JPEG, PDF, DOC, XLS up to 10MB</span>
              </div>
              <input
                id="create-task-file-input"
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
              />

              {task.attachments.length > 0 && (
                <div className="create-task-file-list">
                  {task.attachments.map((file, i) => (
                    <div key={i} className="create-task-file-item">
                      <div className="create-task-file-icon">📄</div>
                      <div className="create-task-file-details">
                        <span className="create-task-file-name">{file.name}</span>
                        <span className="create-task-file-size">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button
                        type="button"
                        className="create-task-file-remove"
                        onClick={() => {
                          const newFiles = [...task.attachments];
                          newFiles.splice(i, 1);
                          setTask({ ...task, attachments: newFiles });
                        }}
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
                       <span> start date: {projectStartDate.toLocaleDateString()}</span>
                  </div>
              
                    <div className="create-task-parent-info">
                       <span> Project End date: {ProjectEdnDate.toLocaleDateString()}</span>
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
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="create-task-form-field">
              <label>Milestone</label>
              <input
                type="text"
                name="milestone"
                value={task.milestone}
                onChange={handleChange}
                placeholder="Optional milestone"
                className="create-task-form-input"
              />
            </div> */}

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
                       <span> start date: {projectStartDate.toLocaleDateString()}</span>
                  </div>
              
                    <div className="create-task-parent-info">
                       <span> Project End date: {ProjectEdnDate.toLocaleDateString()}</span>
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

              {searchAssignee?.trim() && filteredAssignees?.length > 0 && (
                <div className="create-task-member-search-results">
                  {filteredAssignees?.map((m) => (
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

              {getSelectedAssignees()?.length > 0 && (
                <div className="create-task-selected-members">
                  <h4>Assigned Members ({getSelectedAssignees().length})</h4>
                  <div className="create-task-selected-member-list">
                    {getSelectedAssignees().map((m) => (
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

            {tasks.length > 0 && (
              <div className="create-task-form-field">
                <label>Dependencies</label>
                <Select
                  isMulti
                  options={tasks?.map((t) => ({ value: t._id, label: t.title }))}
                  value={tasks
                    .filter((t) => task.dependencies?.includes(t._id))
                    .map((t) => ({ value: t._id, label: t.title }))}
                  onChange={(selectedOptions) =>
                    setTask({ 
                      ...task, 
                      dependencies: selectedOptions.map((opt) => opt.value) 
                    })
                  }
                  className="create-task-dependencies-select"
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
    <div className="create-task-modal-backdrop" >
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
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="create-task-step-indicators">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i + 1} className={`create-task-step-indicator ${currentStep >= i + 1 ? 'create-task-active' : ''} ${currentStep > i + 1 ? 'create-task-completed' : ''}`}>
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
                <button type="button" className="create-task-btn-secondary" onClick={prevStep}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="create-task-footer-right">
              <button type="button" className="create-task-btn-ghost" onClick={onClose}>
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button type="button" className="create-task-btn-primary" onClick={nextStep}>
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              ) : (
                <button onClick={handleSubmit} type="submit" className="create-task-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Create Task
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