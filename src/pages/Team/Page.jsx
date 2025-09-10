import React, { useEffect, useState } from "react";
import "./Team.css";
import { useDispatch, useSelector } from "react-redux";
import { FetchTeamByProjectId } from "../../Slices/ProjectSlice";
import { useParams } from "react-router-dom";

export default function TeamPage() {
  const params = useParams();
  const projectId = params.id;
  const { projectError, team, ProjectLoading,ProjectDetails } = useSelector((state) => state.Project);
  const dispatch = useDispatch();
  const [selectedMember, setSelectedMember] = useState(null);
console.log(ProjectDetails);

  useEffect(() => {
    dispatch(FetchTeamByProjectId(projectId)).unwrap()
      .then((data) => {
        console.log(data);
      });
  }, [projectId,dispatch]);

  const handleViewDetail = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const getRoleBadgeClass = (role) => {
    return role === 'manager' ? 'role-badge manager' : 'role-badge employee';
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge ${status}`;
  };

  if (ProjectLoading) {
    return (
      <div className="team-container">
        <div className="load-spinner">
          <div className="spinner"></div>
          <p>Loading team members...</p>
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="team-container">
        <div className="error-message">
          <p>Error loading team members: {projectError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="team-container">
      <div className="team-header">
        <h1 className="team-title">Team Members ({team.length})</h1>
        <p className="team-subtitle">Project team overview and member details</p>
      </div>

      {team &&team.length > 0 ? (
        <div className="table-wrapper">
          <table className="team-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member._id} className="table-row">
                  <td className="member-cell">
                    <div className="member-info">
                      <img 
                        src={member.user.avatarUrl} 
                        alt={member.user.name} 
                        className="member-avatar"
                        onError={(e) => {
                          e.target.src = 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png';
                        }}
                      />
                      <div className="member-details">
                        <span className="member-name">{member.user.name}</span>
                        <span className="member-id">ID: {member.user._id.slice(-8)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={getRoleBadgeClass(member.role)}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </td>
                  <td className="email-cell">{member.user.email}</td>
                  <td>
                    <span className={getStatusBadgeClass(member.user.status)}>
                      {member.user.status.charAt(0).toUpperCase() + member.user.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-detail-btn"
                      onClick={() => handleViewDetail(member)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No team members found</h3>
          <p>No team members are assigned to this project yet.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Member Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-avatar-section">
                <img 
                  src={selectedMember.user.avatarUrl} 
                  alt={selectedMember.user.name}
                  className="detail-avatar"
                />
              </div>
              <div className="detail-info">
                <div className="detail-row">
                  <label>Full Name:</label>
                  <span>{selectedMember.user.name}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedMember.user.email}</span>
                </div>
                <div className="detail-row">
                  <label>Project Role:</label>
                  <span className={getRoleBadgeClass(selectedMember.role)}>
                    {selectedMember.role.charAt(0).toUpperCase() + selectedMember.role.slice(1)}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Account Status:</label>
                  <span className={getStatusBadgeClass(selectedMember.user.status)}>
                    {selectedMember.user.status.charAt(0).toUpperCase() + selectedMember.user.status.slice(1)}
                  </span>
                </div>
                <div className="detail-row">
                  <label>User ID:</label>
                  <span className="user-id">{selectedMember.user._id}</span>
                </div>
                <div className="detail-row">
                  <label>Joined:</label>
                  <span>{new Date(selectedMember.user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <label>Last Updated:</label>
                  <span>{new Date(selectedMember.user.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}