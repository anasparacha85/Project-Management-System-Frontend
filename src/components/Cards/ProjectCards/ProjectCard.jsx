import React from "react";
import "./ProjectCard.css";

export default function ProjectCard({ project, onViewProject }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatBudget = (budget) => {
    if (!budget) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#64748b';
    }
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(project.endDate);

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-title-section">
          <h3 className="project-title">{project.name}</h3>
          <div className="project-meta">
            <span 
              className="priority-badge" 
              style={{ backgroundColor: getPriorityColor(project.priority) }}
            >
              {project.priority}
            </span>
            <span className="project-status">{project.status}</span>
          </div>
        </div>
      </div>

      <div className="project-card-content">
        {project.description && (
          <p className="project-description">
            {project.description.length > 120 
              ? `${project.description.substring(0, 120)}...` 
              : project.description
            }
          </p>
        )}

        <div className="project-details">
          {project.startDate && (
            <div className="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Started {formatDate(project.startDate)}</span>
            </div>
          )}

          {project.endDate && (
            <div className="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>
                Due {formatDate(project.endDate)}
                {daysRemaining !== null && (
                  <span className={`days-remaining ${daysRemaining < 0 ? 'overdue' : daysRemaining <= 7 ? 'urgent' : ''}`}>
                    {daysRemaining < 0 
                      ? `(${Math.abs(daysRemaining)} days overdue)`
                      : `(${daysRemaining} days left)`
                    }
                  </span>
                )}
              </span>
            </div>
          )}

          {project.budget && (
            <div className="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>{formatBudget(project.budget)} budget</span>
            </div>
          )}

          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>{project.team ? project.team.length : 0} team members</span>
          </div>
        </div>

        {project.files && project.files.length > 0 && (
          <div className="project-attachments">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            <span>{project.files.length} file{project.files.length !== 1 ? 's' : ''} attached</span>
          </div>
        )}
      </div>

      <div className="project-card-footer">
        <div className="project-created">
          <span>Created {formatDate(project.createdAt)}</span>
        </div>
        <button 
          className="view-project-btn"
          onClick={() => onViewProject(project._id)}
        >
          View Project
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="7" y1="17" x2="17" y2="7"/>
            <polyline points="7,7 17,7 17,17"/>
          </svg>
        </button>
      </div>
    </div>
  );
}