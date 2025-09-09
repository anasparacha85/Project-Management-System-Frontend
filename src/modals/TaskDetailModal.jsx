import React, { useEffect, useMemo, useRef, useState } from "react";
import './TaskDetailModal.css'
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksById, setError, setTaskDetails } from "../Slices/TaskSlice";
import { useNavigate, useParams } from "react-router-dom";
import ApiServices from "../ApiService/ApiService";
import { FetchProjectDetailsById, setProjectDetails } from "../Slices/ProjectSlice";
import SubTaskTable from "../components/SubTaskstable";
import { AlertCircle } from "lucide-react";

const AssigneesSelector = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
const {team}=useSelector((state)=>state.Project)
const { taskDetails}=useSelector((state)=>state.Task)
console.log(team);

  // useEffect(()=>{
  //   fetch
  // })
const allUsers=team;
const dispatch=useDispatch()
  // Filtered users by search
  const filteredUsers = allUsers.filter(
    (u) =>
      u.user.name.toLowerCase().includes(search.toLowerCase()) ||
      u.user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Add or remove assignee
  const toggleAssignee = (user) => {
    const exists = taskDetails.assignees.find((a) => a._id === user._id);
    if (exists) {
      // remove
      dispatch(setTaskDetails({
        ...taskDetails,
        assignees: taskDetails.assignees.filter((a) => a._id !== user._id),
      }));
    } else {
      // add
     dispatch(setTaskDetails({
        ...taskDetails,
        assignees: [...taskDetails.assignees, { _id: user._id, user }],
      }));
    }
  };

  return (
    <div className="task-details-field">
      <span className="task-details-label">Assignees</span>
      <div className="task-details-assignees-list">
        {taskDetails.assignees?.length > 0 ? (
          taskDetails.assignees.map((assignee) => (
            <div key={assignee._id} className="task-details-user-avatar-container">
              <img
                src={assignee.user.avatarUrl}
                alt={assignee.user.name}
                className="task-details-user-avatar"
              />
              <span className="task-details-user-name">{assignee.user.name}</span>
              <button
                style={{
                  marginLeft: "8px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "red",
                  fontSize: "14px",
                }}
                onClick={() => toggleAssignee(assignee.user)}
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <span className="task-details-value task-details-empty">No assignees</span>
        )}

        {/* ADD Button */}
        <button
          className="task-details-add-assignee-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          + Add
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          style={{
            marginTop: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "white",
            padding: "10px",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="text"
            placeholder="Search assignees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="task-details-input"
            style={{ marginBottom: "10px", width: "100%" }}
          />

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isChecked = !!taskDetails.assignees.find(
                (a) => a.user._id === user.user._id
              );
              return (
                <div
                  key={user.user._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAssignee(user.user)}
                  />
                  <img
                    src={user.user.avatarUrl
}
                    alt={user.user.name}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                      {user.user.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      {user.user.email}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>
              No users found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const EditableField = ({ label, value, placeholder, name, type = "text", options = [] }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || "");


 const dispatch = useDispatch();
  const { taskDetails } = useSelector((state) => state.Task);

  useEffect(() => {
    setText(value || "");
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    dispatch(setTaskDetails({ ...taskDetails, [name]: text })); 
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setText(value || "");
      setEditing(false);
    }
  };

  if (type === "select") {
    return (
      <div className="task-details-field">
        <span className="task-details-label">{label}</span>
        {editing ? (
          <select
            className="task-details-input task-details-select-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            autoFocus
            name={name}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <span
            className={`task-details-value ${!text ? "task-details-empty" : ""} ${text === 'High' ? 'task-details-high-priority' : text === 'Medium' ? 'task-details-medium-priority' : text === 'Low' ? 'task-details-low-priority' : ''}`}
            onClick={() => setEditing(true)}
          >
            {text || placeholder}
          </span>
        )}
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className="task-details-field">
        <span className="task-details-label">{label}</span>
        {editing ? (
          <input
            className="task-details-input task-details-date-input"
            type="date"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            autoFocus
            name={name}
          />
        ) : (
          <span
            className={`task-details-value ${!text ? "task-details-empty" : ""}`}
            onClick={() => setEditing(true)}
          >
            {text ? new Date(text).toLocaleDateString() : placeholder}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="task-details-field">
      <span className="task-details-label">{label}</span>
      {editing ? (
        <input
          className="task-details-input"
          type={type}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          name={name}
        />
      ) : (
        <span
          className={`task-details-value ${!text ? "task-details-empty" : ""}`}
          onClick={() => setEditing(true)}
        >
          {text || placeholder}
        </span>
      )}
    </div>
  );
};

const UserAvatar = ({ user }) => (
  <div className="task-details-user-avatar-container">
    <img 
      src={user?.avatarUrl || 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png'} 
      alt={user?.name || 'User'} 
      className="task-details-user-avatar"
    />
    <span className="task-details-user-name">{user?.name || 'Unassigned'}</span>
  </div>
);

const TaskDetailPage = () => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("details");
  const [newComment, setNewComment] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
    const descriptionRef=useRef()
   const [projectId, setprojectId] = useState(false)
   const navigate=useNavigate()
   const [project, setproject] = useState({})
   
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  const dispatch=useDispatch()
  const {taskDetails,loading,error}=useSelector((state)=>state.Task)
  const {projectDetails}=useSelector((state)=>state.Project)
    const params=useParams()
    const getSubTasksById=async()=>{
      try {
          const data=await ApiServices.getSubTaskByTaskid(params.id)
          console.log(data);
          
          setSubtasks(data.subTasks)
      } catch (error) {
        setError(error.message)
        
      }


}
useEffect(()=>{
  getSubTasksById()
},[params.id])
  
    
  useEffect(()=>{
    dispatch(fetchTasksById(params.id))
    .unwrap().then((data)=>{
    console.log("hi2",data);
    
      setprojectId(data.project)
      //  dispatch(FetchProjectDetailsById(data.project))
      

    })
  },[])
  // useEffect(()=>{
  //   dispatch(FetchProjectDetailsById(taskDetails.project))
  // },[params.id,taskDetails.project])

  useEffect(()=>{
  if(projectId){   // sirf tabhi chale jab projectId set ho
    dispatch(FetchProjectDetailsById(projectId)).unwrap()
    .then((data)=>{
      setproject(data)
      
    }).catch((error)=>{
      console.log(error);
      
    })
  }
},[projectId])
  console.log("hi",project);
  
console.log(taskDetails);
const handleSaveTask=async()=>{
  console.log(taskDetails);
  try {
      const payload = {
      ...taskDetails,
      ...(taskDetails.startDate ? { startDate: taskDetails.startDate } : {}),
      ...(taskDetails.dueDate ? { dueDate: taskDetails.dueDate } : {})
    };

    const data = await ApiServices.updateTaskById(params.id, payload);
    // const data=await ApiServices.updateTaskById(params.id,taskDetails)
    alert(data.SuccessMessage)
    dispatch(fetchTasksById(params.id))
  } catch (error) {
    alert(error.message)
    
  }

  
}
const handleDeleteTask=async()=>{
  try {
    const data=await ApiServices.deleteTaskById(params.id)
    alert(data.SuccessMessage)
      navigate(-1);
    dispatch(FetchProjectDetailsById(projectId))
  } catch (error) {
    alert(error.message)
    
  }
}

  // Mock data for demonstration (replace with actual API data)
  const mockTaskData = {
    assignees: [
      { user: { name: 'John Doe', email: 'john@example.com', avatarUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png' }, status: 'todo', _id: '68adaa225ba79ba3455e3b4b' },
      { user: { name: 'Jane Smith', email: 'jane@example.com', avatarUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png' }, status: 'todo', _id: '68adaa225ba79ba3455e3b4c' }
    ],
    attachments: [],
    comments: [],
    createdAt: "2025-08-26T12:35:46.267Z",
    createdBy: { _id: '68ac16938add1a689d1be6e2', name: 'Anas Paracha', email: 'amiranas761@gmail.com', avatarUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png', role: 'manager' },
    dependencies: [],
    description: "task desc",
    dueDate: "2025-12-03T00:00:00.000Z",
    milestone: "",
    priority: "High",
    progress: 0,
    project: "68ac61488c1f7f7a382d7d7d",
    startDate: "2025-08-27T00:00:00.000Z",
    status: "todo",
    subTasks: [],
    title: "task 1",
    updatedAt: "2025-08-26T12:35:46.267Z",
    __v: 0,
    _id: "68adaa225ba79ba3455e3b4a"
  };

  const taskData = taskDetails;

  // Simulate loading task data
  useEffect(() => {
        
  }, []);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: Date.now(), title: newSubtask, completed: false }]);
      setNewSubtask("");
    }
  };

  const toggleSubtask = (id) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Here you would dispatch an action to add comment
      setNewComment("");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo': return 'task-details-status-todo';
      case 'in progress': return 'task-details-status-progress';
      case 'completed': return 'task-details-status-completed';
      default: return 'task-details-status-default';
    }
  };

  if (loading) {
    return (
      <div className="task-details-loading-container">
        <div className="task-details-loading-spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-task-container">
        <div className="error-task-content">
          <AlertCircle className="error-task-icon" />
          <h3 className="error-task-title">Error Loading Task</h3>
          <p className="error-task-message">{error}</p>
          <button 
            onClick={()=> dispatch(fetchTasksById(params.id))
    .unwrap().then((data)=>{
    console.log("hi2",data);
    
      setprojectId(data.project)
      //  dispatch(FetchProjectDetailsById(data.project))
      

    })}
            className="error-task-retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-page-container">
      {/* LEFT CONTENT */}
      <div className="task-details-left-panel">
        <div className="task-details-breadcrumb">
          Team Space / Projects / {taskData.project || 'Project'}
        </div>
         <div className="task-details-breadcrumb">
          project starts : {new Date(project.startDate).toLocaleDateString() }
        </div>
          <div className="task-details-breadcrumb">
          project ends : {new Date(project.endDate).toLocaleDateString() }
        </div>

        <div className="task-details-task-header">
          <span className="task-details-task-badge">Milestone</span>
          <span className="task-details-task-id">{taskData._id?.slice(-8) || '86et84ncr'}</span>
          <button className="task-details-ask-ai-btn">
            <span className="task-details-ai-icon">🤖</span>
            Ask AI
          </button>
        </div>

        <h1 className="task-details-task-title">{taskData.title || "Task Title"}</h1>
        
        <div className="task-details-progress-section">
          <div className="task-details-progress-header">
            <span>Progress: {taskData.progress || 0}%</span>
            <span className={`task-details-status-badge ${getStatusBadgeClass(taskData.status)}`}>
              {taskData.status?.toUpperCase() || 'TODO'}
            </span>
          </div>
          <div className="task-details-progresss-bar">
            <div 
              className="task-details-progresss-fill" 
              style={{ width: `${taskData.progress || 0}%` }}
            ></div>
          </div>
        </div>

        <p className="task-details-ask-brain">
          ✨ Ask Brain to write a description, generate subtasks or find similar tasks
        </p>

        <div className="task-details-grid">
          <EditableField 
            label="Status" 
            value={taskData.status} 
            placeholder="Select status"
            name="status"
            type="select"
            options={["todo", "in-progress", "review", "completed"]}
          />
          
          <AssigneesSelector
//   allUsers={allUsers} // all available users
  // your task state
//  setTaskData={setTaskData} // updater
/>


          <EditableField 
            label="Start Date" 
            value={taskData.startDate} 
            placeholder="Set start date"
            name="startDate"
            type="date"
          />
          
          <EditableField 
            label="Due Date" 
            value={taskData.dueDate} 
            placeholder="Set due date"
            name="dueDate"
            type="date"
          />
          
          <EditableField 
            label="Priority" 
            value={taskData.priority} 
            placeholder="Select priority"
            name="priority"
            type="select"
            options={["Low", "Medium", "High", "Critical"]}
          />
          
          <EditableField 
            label="Milestone" 
            value={taskData.milestone} 
            placeholder="Add milestone"
            name="milestone"
          />
        </div>

        <div className="task-details-description-section">
          <div className="task-details-field">
            <span className="task-details-label">Description</span>
          <textarea
  ref={descriptionRef}
  disabled={false} // disable ka chakkar mat rakho
  className="task-details-description-content"
  value={taskDetails.description || ""}
  onChange={(e) =>
    dispatch(setTaskDetails({ ...taskDetails, description: e.target.value }))
  }
/>
            <button onClick={()=>descriptionRef.current.disabled=false} className="task-details-edit-description-btn">Edit Description</button>
          </div>
        </div>

        <div className="task-details-tabs">
          <button 
            className={`task-details-tab ${activeTab === "details" ? "task-details-active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button 
            className={`task-details-tab ${activeTab === "subtasks" ? "task-details-active" : ""}`}
            onClick={() => setActiveTab("subtasks")}
          >
            Subtasks ({subtasks.length})
          </button>
          <button 
            className={`task-details-tab ${activeTab === "dependencies" ? "task-details-active" : ""}`}
            onClick={() => setActiveTab("dependencies")}
          >
            Dependencies
          </button>
        </div>

        <div className="task-details-tab-content">
          {activeTab === "details" && (
            <div className="task-details-details-content">
              <div className="task-details-metadata-grid">
                <div className="task-details-metadata-item">
                  <span className="task-details-metadata-label">Created by</span>
                  <UserAvatar user={taskData.createdBy} />
                </div>
                <div className="task-details-metadata-item">
                  <span className="task-details-metadata-label">Created</span>
                  <span>{formatDate(taskData.createdAt)}</span>
                </div>
                <div className="task-details-metadata-item">
                  <span className="task-details-metadata-label">Updated</span>
                  <span>{formatDate(taskData.updatedAt)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "subtasks" && (
            <div className="task-details-subtasks-content">
              {/* <div className="task-details-add-subtask-form">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a new subtask..."
                  className="task-details-subtask-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <button 
                  className="task-details-add-subtask-btn"
                  onClick={handleAddSubtask}
                  disabled={!newSubtask.trim()}
                >
                  + Add Subtask
                </button>
              </div> */}
              
              <div className="task-details-subtasks-list">
               <SubTaskTable 
  subtasks={subtasks} 
  onSubTaskUpdate={(id, updates) => {
    // Handle subtask update
    console.log('Update subtask:', id, updates);
  }}
  onSubTaskDelete={(id) => {
    // Handle subtask deletion
    console.log('Delete subtask:', id);
  }}
/>
              </div>
            </div>
          )}

          {activeTab === "dependencies" && (
            <div className="task-details-dependencies-content">
              <p className="task-details-no-dependencies">No dependencies configured</p>
              <button className="task-details-add-dependency-btn">+ Add Dependency</button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="task-details-right-panel">
        <div className="task-details-activity-section">
          <h3 className="task-details-activity-header">Activity</h3>
          <div className="task-details-activity-feed">
            <div className="task-details-activity-item">
              <div className="task-details-activity-avatar">
                <img 
                  src={taskData.createdBy?.avatarUrl} 
                  alt={taskData.createdBy?.name}
                  className="task-details-activity-user-avatar"
                />
              </div>
              <div className="task-details-activity-content">
                <p>
                  <strong>{taskData.createdBy?.name}</strong> created this task
                </p>
                <span className="task-details-activity-time">
                  {formatDate(taskData.createdAt)} at {new Date(taskData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            {taskData.assignees?.map((assignee, index) => (
              <div key={assignee._id} className="task-details-activity-item">
                <div className="task-details-activity-avatar">
                  <img 
                    src={assignee.user?.avatarUrl} 
                    alt={assignee.user?.name}
                    className="task-details-activity-user-avatar"
                  />
                </div>
                <div className="task-details-activity-content">
                  <p>
                 <strong>{taskData.createdBy?.name}</strong> assigned    <strong>{assignee.user?.name}</strong> was assigned to this task
                  </p>
                  <span className="task-details-activity-time">
                    {formatDate(taskData.updatedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="task-details-comment-section">
          <div className="task-details-comment-input-container">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="task-details-comment-input"
              rows="3"
            />
            <button 
              className="task-details-send-btn"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <span className="task-details-send-icon">📤</span>
              Send
            </button>
          </div>
        </div>

        <div className="task-details-t-actions">
          <button onClick={handleSaveTask} className="task-details-act-btn task-details-primary">Save Changes</button>
          {/* <button className="task-details-act-btn task-details-secondary">Duplicate Task</button> */}
          <button onClick={handleDeleteTask} className="task-details-act-btn task-details-danger">Delete Milestone</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;