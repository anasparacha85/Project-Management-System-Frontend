import React from "react";

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
    <div className="bg-white rounded-2xl border border-slate-300 p-6 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-slate-400 group">
      {/* Top gradient border on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="mb-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight flex-1">{project.name}</h3>
          <div className="flex flex-col items-end gap-1.5">
            <span 
              className="text-white text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wide"
              style={{ backgroundColor: getPriorityColor(project.priority) }}
            >
              {project.priority}
            </span>
            <span className="text-xs text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded border border-green-200">
              {project.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-5">
        {project.description && (
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            {project.description.length > 120 
              ? `${project.description.substring(0, 120)}...` 
              : project.description
            }
          </p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          {project.startDate && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Started {formatDate(project.startDate)}</span>
            </div>
          )}

          {project.endDate && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>
                Due {formatDate(project.endDate)}
                {daysRemaining !== null && (
                  <span className={`font-medium ml-1 ${
                    daysRemaining < 0 ? 'text-red-500' : 
                    daysRemaining <= 7 ? 'text-orange-500' : ''
                  }`}>
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
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>{formatBudget(project.budget)} budget</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>{project.team ? project.team.length : 0} team members</span>
          </div>
        </div>

        {project.files && project.files.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600 px-3 py-2 bg-slate-50 rounded-lg mt-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            <span>{project.files.length} file{project.files.length !== 1 ? 's' : ''} attached</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-400">
          <span>Created {formatDate(project.createdAt)}</span>
        </div>
        <button 
          className="bg-blue-500 text-white border-none px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex items-center gap-1.5"
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