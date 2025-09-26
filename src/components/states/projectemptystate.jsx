import React from "react";
import "./projectemptystate.css";
import { useSelector } from "react-redux";

export default function EmptyState({ onCreateProject }) {
  const {user}=useSelector((state)=>state.User)
  const role=user?.role
  return (
    <div className="em-state">
      <div className="em-state-content">
        <div className="em-state-icon">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <path d="M8 14h.01"/>
            <path d="M12 14h.01"/>
            <path d="M16 14h.01"/>
            <path d="M8 18h.01"/>
            <path d="M12 18h.01"/>
            <path d="M16 18h.01"/>
          </svg>
        </div>
        {role==='manager'?<>
           <h2 style={{color:'white'}}>No projects yet</h2>
        <p  style={{color:'white'}}>
          Get started by creating your first project. Organize your team, 
          set deadlines, and track progress all in one place.
        </p>
        
        <button 
          className="btn-crate-first"
          onClick={onCreateProject}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Your First Project
        </button>
        </>:<>
           <h2 style={{color:'white'}}>No projects assigned to you</h2>
        <p  style={{color:'white'}}>
          You have been not assigned to any project by your reporting manager .
        </p>
        </>}
       
        {role==='manager' &&
        <div className="empty-state-features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h4>Team Collaboration</h4>
              <p>Invite team members and assign roles</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <div>
              <h4>Task Management</h4>
              <p>Break projects into manageable tasks</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <div>
              <h4>Progress Tracking</h4>
              <p>Monitor deadlines and project milestones</p>
            </div>
          </div>
        </div>
        }
      </div>
      
    </div>
  );
}