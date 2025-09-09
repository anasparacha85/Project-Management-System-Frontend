import React, { useState } from "react";
import "./SubTasksTable.css";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubTaskTable = ({ subtasks, onSubTaskUpdate, onSubTaskDelete,onViewSubTask }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedSubtasks, setExpandedSubtasks] = useState({});
  const navigate=useNavigate()

  // Sort subtasks
  const sortedSubtasks = React.useMemo(() => {
    if (!sortConfig.key) return subtasks;
    
    return [...subtasks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [subtasks, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const toggleExpand = (subtaskId) => {
    setExpandedSubtasks(prev => ({
      ...prev,
      [subtaskId]: !prev[subtaskId]
    }));
  };

  const handleStatusChange = (subtaskId, newStatus) => {
    onSubTaskUpdate(subtaskId, { status: newStatus });
  };

  const handleProgressChange = (subtaskId, newProgress) => {
    onSubTaskUpdate(subtaskId, { progress: newProgress });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'todo': return 'subtask-status-todo';
      case 'in-progress': return 'subtask-status-progress';
      case 'review': return 'subtask-status-review';
      case 'completed': return 'subtask-status-completed';
      default: return 'subtask-status-default';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'subtask-priority-high';
      case 'Medium': return 'subtask-priority-medium';
      case 'Low': return 'subtask-priority-low';
      default: return 'subtask-priority-medium';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return '-';
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return 'Due today';
    return `${diffDays} days left`;
  };


  if (!subtasks || subtasks.length === 0) {
    return (
      <div className="subtask-table-empty">
        <div className="subtask-table-empty-icon">📋</div>
        <h3>No subtasks yet</h3>
        <p>Create your first subtask to get started</p>
      </div>
    );
  }

  return (
    <div className="subtask-table-container">
      <div className="subtask-table-header">
        <h3>Subtasks ({subtasks.length})</h3>
        {/* <div className="subtask-table-actions">
          <button className="subtask-table-action-btn">
            <span>📊</span>
            Export
          </button>
          <button className="subtask-table-action-btn">
            <span>⚙️</span>
            View Options
          </button>
        </div> */}
      </div>

      <div className="subtask-table-wrapper">
        <table className="subtask-table">
          <thead>
            <tr>
              <th className="subtask-table-expand"></th>
              <th 
                className="subtask-table-title"
                onClick={() => requestSort('title')}
              >
                Title {sortConfig.key === 'title' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="subtask-table-status"
                onClick={() => requestSort('status')}
              >
                Status {sortConfig.key === 'status' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="subtask-table-assignees"
                onClick={() => requestSort('assignees')}
              >
                Assignees {sortConfig.key === 'assignees' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="subtask-table-priority"
                onClick={() => requestSort('priority')}
              >
                Priority {sortConfig.key === 'priority' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="subtask-table-progress"
                onClick={() => requestSort('progress')}
              >
                Progress {sortConfig.key === 'progress' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="subtask-table-due-date"
                onClick={() => requestSort('dueDate')}
              >
                Due Date {sortConfig.key === 'dueDate' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="subtask-table-actions-header">Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {sortedSubtasks.map((subtask) => (
              <React.Fragment key={subtask._id}>
                <tr className="subtask-table-row">
                  <td className="subtask-table-expand">
                    <button 
                      className="subtask-expand-btn"
                      onClick={() => toggleExpand(subtask._id)}
                    >
                      {expandedSubtasks[subtask._id] ? '▼' : '►'}
                    </button>
                  </td>
                  <td className="subtask-table-title">
                    <div className="subtask-title-content">
                      <span className="subtask-title-text">{subtask.title}</span>
                      {subtask.description && (
                        <span className="subtask-has-description">📝</span>
                      )}
                    </div>
                  </td>
                  <td className="subtask-table-status">
                    <select
                      value={subtask.status}
                      onChange={(e) => handleStatusChange(subtask._id, e.target.value)}
                      className={`subtask-status-select ${getStatusBadgeClass(subtask.status)}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="subtask-table-assignees">
                    <div className="subtask-assignees">
                      {subtask.assignees && subtask.assignees.length > 0 ? (
                        <div className="subtask-assignee-avatars">
                          {subtask.assignees.slice(0, 3).map((assignee, index) => (
                            <div 
                              key={assignee.user?._id || index}
                              className="subtask-assignee-avatar"
                              title={assignee.user?.name || 'Unassigned'}
                            >
                              {assignee.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          ))}
                          {subtask.assignees.length > 3 && (
                            <div className="subtask-assignee-more">
                              +{subtask.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="subtask-no-assignees">Unassigned</span>
                      )}
                    </div>
                  </td>
                  <td className="subtask-table-priority">
                    <span className={`subtask-priority-badge ${getPriorityBadgeClass(subtask.priority)}`}>
                      {subtask.priority}
                    </span>
                  </td>
                  <td className="subtask-table-progress">
                    <div className="subtask-progress-container">
                      <div className="subtask-progress-bar">
                        <div 
                          className="subtask-progress-fill"
                          style={{ width: `${subtask.progress}%` }}
                        ></div>
                      </div>
                      <span className="subtask-progress-text">{subtask.progress}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={subtask.progress}
                        onChange={(e) => handleProgressChange(subtask._id, parseInt(e.target.value))}
                        className="subtask-progress-slider"
                      />
                    </div>
                  </td>
                  <td className="subtask-table-due-date">
                    <div className="subtask-due-date-content">
                      <div className="subtask-due-date">{formatDate(subtask.dueDate)}</div>
                      <div className="subtask-days-remaining">
                        {calculateDaysRemaining(subtask.dueDate)}
                      </div>
                    </div>
                  </td>
                  <td className="subtask-table-actions">
                    <div className="subtask-action-buttons">
                      <button 
                      onClick={()=>navigate(`/dashboard/subTask/${subtask._id}`)}
                        className="subtask-action-btn subtask-edit-btn"
                        title="view Details"
                      >
                        view Details <Eye/>
                      </button>
                     
                    </div>
                  </td>
                </tr>
                {expandedSubtasks[subtask._id] && (
                  <tr className="subtask-detail-row">
                    <td colSpan="8">
                      <div className="subtask-detail-content">
                        <div className="subtask-detail-section">
                          <h4>Description</h4>
                          <p>{subtask.description || 'No description provided'}</p>
                        </div>
                        <div className="subtask-detail-section">
                          <h4>Dates</h4>
                          <div className="subtask-detail-dates">
                            <div>
                              <strong>Start Date:</strong> {formatDate(subtask.startDate)}
                            </div>
                            <div>
                              <strong>Due Date:</strong> {formatDate(subtask.dueDate)}
                            </div>
                            <div>
                              <strong>Created:</strong> {formatDate(subtask.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="subtask-detail-section">
                          <h4>Assignees</h4>
                          <div className="subtask-detail-assignees">
                            {subtask.assignees && subtask.assignees.length > 0 ? (
                              subtask.assignees.map((assignee) => (
                                <div key={assignee.user?._id} className="subtask-detail-assignee">
                                  <div className="subtask-detail-assignee-avatar">
                                    {assignee.user?.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                  <div className="subtask-detail-assignee-info">
                                    <div className="subtask-detail-assignee-name">
                                      {assignee.user?.name || 'Unassigned'}
                                    </div>
                                    <div className="subtask-detail-assignee-status">
                                      Status: {assignee.status}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No assignees</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="subtask-table-footer">
        <div className="subtask-table-summary">
          <span>
            Completed: {subtasks.filter(st => st.status === 'completed').length} of {subtasks.length}
          </span>
          <span>
            Progress: {Math.round(subtasks.reduce((sum, st) => sum + st.progress, 0) / subtasks.length)}% avg
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubTaskTable;