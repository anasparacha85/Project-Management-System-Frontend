import React, { useEffect, useState } from "react";
import "./ProjectMilestone.css";

import { Calendar, Plus, Filter, Search, ChevronDown, Edit3, Save, X, Target, Clock, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";

const EditableCell = ({ value, onSave, type = "text", options = [], placeholder = "Click to edit" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    if (type === "select") {
      return (
        <div className="project-milestone-editable-cell project-milestone-editing">
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            autoFocus
            className="project-milestone-cell-select"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === "date") {
      return (
        <div className="project-milestone-editable-cell project-milestone-editing">
          <input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="project-milestone-cell-input"
          />
        </div>
      );
    }

    return (
      <div className="project-milestone-editable-cell project-milestone-editing">
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="project-milestone-cell-input"
          placeholder={placeholder}
        />
        <div className="project-milestone-edit-actions">
          <button onClick={handleSave} className="project-milestone-save-btn">
            <Save size={12} />
          </button>
          <button onClick={handleCancel} className="project-milestone-cancel-btn">
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-milestone-editable-cell" onClick={() => setIsEditing(true)}>
      <span className={`project-milestone-cell-content ${!value ? 'project-milestone-empty' : ''}`}>
        {value || placeholder}
      </span>
      <Edit3 size={12} className="project-milestone-edit-icon" />
    </div>
  );
};

const StatusBadge = ({ status, onChange }) => {
  const statusConfig = {
    pending: { color: '#ef4444', bg: '#fef2f2', label: 'Pending' },
    inprogress: { color: '#f59e0b', bg: '#fffbeb', label: 'In Progress' },
    completed: { color: '#10b981', bg: '#f0fdf4', label: 'Completed' },
    onhold: { color: '#6b7280', bg: '#f9fafb', label: 'On Hold' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <EditableCell
      value={status}
      onSave={onChange}
      type="select"
      options={Object.keys(statusConfig).map(key => ({
        value: key,
        label: statusConfig[key].label
      }))}
    />
  );
};

const ProgressBar = ({ progress, onChange }) => {
  return (
    <div className="project-milestone-progress-container">
      <div className="project-milestone-progress-bar-wrapper">
        <div className="project-milestone-progress-bar">
          <div 
            className="project-milestone-progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="project-milestone-progress-text">{progress}%</span>
      </div>
      <EditableCell
        value={progress}
        onSave={onChange}
        type="number"
        placeholder="0"
      />
    </div>
  );
};

const ProjectMilestonesPage = () => {
  const [milestones, setMilestones] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const params = useParams();
 

const navigate=useNavigate()


  useEffect(() => {
    const fetchMilestones = async () => {
        setLoading(true);
      try {
        const data = await ApiServices.getMilestonesByProjectId(params.id);
        console.log(data);
        setMilestones(data || []);
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false)
      }
    };
    fetchMilestones();
  }, []);
  // Mock data matching your structure
  const mockMilestones = [
    {
      _id: "1",
      title: "Frontend Development Phase",
      description: "Complete all UI components and user interfaces",
      status: "inprogress",
      progress: 75,
      startDate: "2025-08-01",
      dueDate: "2025-09-15",
      assignees: [
        { user: { name: "John Doe", email: "john@example.com", avatarUrl: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png" } },
        { user: { name: "Jane Smith", email: "jane@example.com", avatarUrl: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png" } }
      ],
      priority: "High",
      subtasks: [
        { _id: "s1", title: "Dashboard Components", status: "completed", progress: 100 },
        { _id: "s2", title: "Navigation System", status: "inprogress", progress: 60 },
        { _id: "s3", title: "User Profile Pages", status: "pending", progress: 0 }
      ]
    },
    {
      _id: "2",
      title: "Backend API Development",
      description: "Build robust REST API with authentication and authorization",
      status: "pending",
      progress: 25,
      startDate: "2025-09-01",
      dueDate: "2025-10-30",
      assignees: [
        { user: { name: "Mike Johnson", email: "mike@example.com", avatarUrl: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png" } }
      ],
      priority: "Critical",
      subtasks: [
        { _id: "s4", title: "Authentication System", status: 'inprogress', progress: 40 },
        { _id: "s5", title: "Database Design", status: 'pending', progress: 0 }
      ]
    },
    {
      _id: "3",
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing of all features and bug fixes",
      status: "completed",
      progress: 100,
      startDate: "2025-07-15",
      dueDate: "2025-08-15",
      assignees: [
        { user: { name: "Sarah Wilson", email: "sarah@example.com", avatarUrl: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png" } }
      ],
      priority: "Medium",
      subtasks: []
    }
  ];

 

  const handleUpdateMilestone = (milestoneId, field, newValue) => {
    setMilestones(prev => prev.map(milestone => 
      milestone._id === milestoneId 
        ? { ...milestone, [field]: newValue }
        : milestone
    ));
  };

  const filteredMilestones = milestones.filter(milestone => {
    const matchesFilter = filter === "All" || milestone.status === filter;
    const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStats = () => {
    const stats = milestones.reduce((acc, milestone) => {
      acc[milestone.status] = (acc[milestone.status] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  const stats = getStatusStats();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="project-milestone-loading-state">
        <div className="project-milestone-loading-spinner"></div>
        <p>Loading milestones...</p>
      </div>
    );
  }

  return (
    <div className="project-milestone-container">
      {/* Header Section */}
      <div className="project-milestone-header-section">
        <div className="project-milestone-header-content">
          <h1 style={{color:"#1e293b"}} className="project-milestone-page-title">
            <Target className="project-milestone-title-icon" />
            Project Milestones
            <span className="project-milestone-count">({milestones.length})</span>
          </h1>
          <p style={{color:"#1e293b"}} className="project-milestone-page-subtitle">Track and manage project milestones with real-time progress</p>
        </div>
        <button className="project-milestone-create-btn" title="new milestone" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          New Milestone
        </button>
      </div>

      {/* Stats Overview */}
      <div className="project-milestone-stats-overview">
        <div className="project-milestone-stat-card">
          <div className="project-milestone-stat-icon project-milestone-pending">
            <Clock size={20} />
          </div>
          <div className="project-milestone-stat-content">
            <span className="project-milestone-stat-number">{stats.todo || 0}</span>
            <span className="project-milestone-stat-label">Todo</span>
          </div>
        </div>
        <div className="project-milestone-stat-card">
          <div className="project-milestone-stat-icon project-milestone-inprogress">
            <Target size={20} />
          </div>
          <div className="project-milestone-stat-content">
            <span className="project-milestone-stat-number">{stats.inprogress || 0}</span>
            <span className="project-milestone-stat-label">In Progress</span>
          </div>
        </div>
        <div className="project-milestone-stat-card">
          <div className="project-milestone-stat-icon project-milestone-completed">
            <Users size={20} />
          </div>
          <div className="project-milestone-stat-content">
            <span className="project-milestone-stat-number">{stats.completed || 0}</span>
            <span className="project-milestone-stat-label">Completed</span>
          </div>
        </div>
        <div className="project-milestone-stat-card">
          <div className="project-milestone-stat-icon project-milestone-total">
            <Filter size={20} />
          </div>
          <div className="project-milestone-stat-content">
            <span className="project-milestone-stat-number">{milestones.length}</span>
            <span className="project-milestone-stat-label">Total</span>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="project-milestone-controls-section">
        {/* <div className="project-milestone-search-container">
          <Search size={16} className="project-milestone-search-icon" />
          <input
            type="text"
            placeholder="Search milestones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="project-milestone-search-input"
          />
        </div> */}

        <div className="project-milestone-filter-container">
          <Filter size={16} className="project-milestone-filter-icon" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="project-milestone-filter-select"
          >
            <option value="All">All Status</option>
            <option value="pending">todo</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="onhold">On Hold</option>
          </select>
          <ChevronDown size={16} className="project-milestone-select-arrow" />
        </div>
      </div>

      {/* Table Section */}
      <div className="project-milestone-table-container">
        <table className="project-milestone-table">
          <thead>
            <tr>
              <th className="project-milestone-col-milestone">
                <span className="project-milestone-th-content">
                  <Target size={16} />
                  Milestone
                </span>
              </th>
              <th className="project-milestone-col-status">
                <span className="project-milestone-th-content">Status</span>
              </th>
              <th className="project-milestone-col-progress">
                <span className="project-milestone-th-content">Progress</span>
              </th>
              <th className="project-milestone-col-priority">
                <span className="project-milestone-th-content">Priority</span>
              </th>
              <th className="project-milestone-col-assignees">
                <span className="project-milestone-th-content">
                  <Users size={16} />
                  Assignees
                </span>
              </th>
              <th className="project-milestone-col-dates">
                <span className="project-milestone-th-content">
                  <Calendar size={16} />
                  Timeline
                </span>
              </th>
              <th className="project-milestone-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMilestones.map((milestone) => (
              <tr key={milestone._id} className="project-milestone-row">
                <td className="project-milestone-cell">
                  <div className="project-milestone-info">
                    <EditableCell
                      value={milestone.title}
                      onSave={(newValue) => handleUpdateMilestone(milestone._id, 'title', newValue)}
                      placeholder="Milestone title"
                    />
                    {/* <EditableCell
                      value={milestone.description}
                      onSave={(newValue) => handleUpdateMilestone(milestone._id, 'description', newValue)}
                      placeholder="Add description"
                    /> */}
                  </div>
                </td>
                
                <td className="project-milestone-status-cell">
                  <div className={`project-milestone-status-badge project-milestone-status-${milestone.status}`}>
                    <span className="project-milestone-status-dot"></span>
                    <EditableCell
                      value={milestone.status}
                      onSave={(newValue) => handleUpdateMilestone(milestone._id, 'status', newValue)}
                      type="select"
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'inprogress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'onhold', label: 'On Hold' }
                      ]}
                    />
                  </div>
                </td>
                
                <td className="project-milestone-progress-cell">
                  <ProgressBar
                    progress={milestone.progress}
                    onChange={(newValue) => handleUpdateMilestone(milestone._id, 'progress', Math.max(0, Math.min(100, newValue)))}
                  />
                </td>
                
                <td className="project-milestone-priority-cell">
                  <div className="project-milestone-priority-container">
                    <div 
                      className="project-milestone-priority-indicator"
                      style={{ backgroundColor: getPriorityColor(milestone.priority) }}
                    ></div>
                    <EditableCell
                      value={milestone.priority}
                      onSave={(newValue) => handleUpdateMilestone(milestone._id, 'priority', newValue)}
                      type="select"
                      options={[
                        { value: 'Low', label: 'Low' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High' },
                        { value: 'Critical', label: 'Critical' }
                      ]}
                    />
                  </div>
                </td>
                
                <td className="project-milestone-assignees-cell">
                  <div className="project-milestone-assignees-container">
                    {milestone.assignees?.slice(0, 3).map((assignee, index) => (
                      <div key={index} className="project-milestone-assignee-avatar" title={assignee.user.name}>
                        <img 
                          src={assignee.user.avatarUrl} 
                          alt={assignee.user.name}
                          className="project-milestone-avatar-img"
                        />
                      </div>
                    ))}
                    {milestone.assignees?.length > 3 && (
                      <div className="project-milestone-more-assignees">
                        +{milestone.assignees.length - 3}
                      </div>
                    )}
                    {/* <button className="project-milestone-add-assignee" title="Add assignee">
                      <Plus size={12} />
                    </button> */}
                  </div>
                </td>
                
                <td className="project-milestone-dates-cell">
                  <div className="project-milestone-dates-container">
                    <div className="project-milestone-date-item">
                      <span className="project-milestone-date-label">Start:</span>
                      <EditableCell
                        value={milestone.startDate}
                        onSave={(newValue) => handleUpdateMilestone(milestone._id, 'startDate', newValue)}
                        type="date"
                        placeholder="Set start date"
                      />
                    </div>
                    <div className="project-milestone-date-item">
                      <span className="project-milestone-date-label">Due:</span>
                      <EditableCell
                        value={milestone.dueDate}
                        onSave={(newValue) => handleUpdateMilestone(milestone._id, 'dueDate', newValue)}
                        type="date"
                        placeholder="Set due date"
                      />
                    </div>
                  </div>
                </td>
                
                <td className="project-milestone-actions-cell">
                  <div className="project-milestone-action-buttons">
                    <button onClick={()=>navigate(`/dashboard/milestone/${milestone._id}`)} className="project-milestone-action-btn project-milestone-view" title="View details">
                      👁️View Details 
                    </button>
                    {/* <button className="project-milestone-action-btn project-milestone-edit" title="Edit milestone">
                      ✏️
                    </button>
                    <button className="project-milestone-action-btn project-milestone-delete" title="Delete milestone">
                      🗑️
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMilestones.length === 0 && (
          <div className="project-milestone-empty-state">
            <Target size={48} className="project-milestone-empty-icon" />
            <h3>No milestones found</h3>
            <p>
              {searchTerm 
                ? `No milestones match "${searchTerm}"`
                : filter !== "All" 
                  ? `No milestones with status "${filter}"`
                  : "Start by creating your first milestone"
              }
            </p>
            <button className="project-milestone-create-first-btn" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Create First Milestone
            </button>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="project-milestone-summary-footer">
        <div className="project-milestone-summary-stats">
          <div className="project-milestone-summary-item">
            <span className="project-milestone-summary-label">Total Milestones:</span>
            <span className="project-milestone-summary-value">{milestones.length}</span>
          </div>
          <div className="project-milestone-summary-item">
            <span className="project-milestone-summary-label">Average Progress:</span>
            <span className="project-milestone-summary-value">
              {milestones.length > 0 
                ? Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length)
                : 0}%
            </span>
          </div>
          <div className="project-milestone-summary-item">
            <span className="project-milestone-summary-label">Completed:</span>
            <span className="project-milestone-summary-value">{stats.completed || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMilestonesPage;