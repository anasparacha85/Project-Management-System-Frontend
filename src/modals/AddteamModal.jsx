import React, { useState, useEffect } from "react";
import useDebounce from "../hooks/usedebounce";
import ApiServices from "../ApiService/ApiService";
import "./AddteamModal.css";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchProjectDetailsById } from "../Slices/ProjectSlice";

export default function AddTeamModal({ onClose, onSave, alreadySelected = [] }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(alreadySelected);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  console.log("already selected", alreadySelected);
  const params = useParams();
  const dispatch = useDispatch();
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedSearch) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await ApiServices.fetchEmployees(debouncedSearch);
        console.log("hi", data);
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [debouncedSearch]);

  const toggleSelect = (user) => {
    setSelected((prev) =>
      prev.some((u) => u.user._id === user._id)
        ? prev.filter((u) => u.user._id !== user._id)
        : [...prev, { user, role: "employee" }]
    );
  };

  const handleSave = async () => {
    console.log(selected);
    try {
      setIsSaving(true);
      const data = await ApiServices.InviteMoreMembersByProjectId({
        members: selected,
        projectId: params.id,
      });
      alert(data.SuccessMessage);
      dispatch(FetchProjectDetailsById(params.id));
      onClose();
    } catch (error) {
      alert(error.message || "Failed to send invite");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const clearSearch = () => {
    setSearch("");
    setUsers([]);
  };

  return (
    <div className="add-team-modal-backdrop" onClick={handleBackdropClick}>
      <div className="add-team-modal-container">
        {/* Header */}
        <div className="add-team-modal-header">
          <div className="add-team-modal-title-section">
            <h2 className="add-team-modal-title">Add Team Members</h2>
            <p className="add-team-modal-subtitle">
              Search and invite team members to your project
            </p>
          </div>
          <button className="add-team-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Search Section */}
        <div className="add-team-search-section">
          <div className="add-team-search-input-container">
            <svg className="add-team-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                stroke="currentColor"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="add-team-search-input"
            />
            {search && (
              <button className="add-team-clear-search-btn" onClick={clearSearch} aria-label="Clear search">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
          {search && (
            <div className="add-team-search-info">
              {isLoading ? (
                <span className="add-team-search-status add-team-loading">Searching...</span>
              ) : (
                <span className="add-team-search-status">
                  {users.length} result{users.length !== 1 ? "s" : ""} found
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="add-team-modal-content">
          {error && (
            <div className="add-team-error-message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 6V10M10 14H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="add-team-loading-container">
              <div className="add-team-loading-spinner"></div>
              <span>Searching for team members...</span>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && users?.length > 0 && (
            <div className="add-team-results-section">
              <h3 className="add-team-section-title">Search Results</h3>
              <div className="add-team-user-list">
                {users.map((user) => {
                  const isSelected = selected.some((sel) => sel.user._id === user._id);
                  return (
                    <div
                      key={user._id}
                      className={`add-team-user-item ${isSelected ? "add-team-selected" : ""}`}
                      onClick={() => toggleSelect(user)}
                    >
                      <div className="add-team-user-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(user)}
                          className="add-team-checkbox-input"
                        />
                        <div className="add-team-checkbox-custom">
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="add-team-user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="add-team-user-info">
                        <span className="add-team-user-name">{user.name}</span>
                        <span className="add-team-user-email">{user.email}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && search && users?.length === 0 && !error && (
            <div className="add-team-no-results">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M21 36C29.2843 36 36 29.2843 36 21C36 12.7157 29.2843 6 21 6C12.7157 6 6 12.7157 6 21C6 29.2843 12.7157 36 21 36Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M32.65 32.65L42 42"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3>No members found</h3>
              <p>Try searching with a different name or email address</p>
            </div>
          )}

          {/* Selected Members */}
          {selected?.length > 0 && (
            <div className="add-team-selected-section">
              <h3 className="add-team-section-title">
                Selected Members ({selected.length})
              </h3>
              <div className="add-team-selected-list">
                {selected.map((member) => (
                  <div key={member.user._id} className="add-team-selected-item">
                    <div className="add-team-user-avatar">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="add-team-user-info">
                      <span className="add-team-user-name">{member.user.name}</span>
                      <span className="add-team-user-email">{member.user.email}</span>
                    </div>
                    <div className="add-team-member-role">Employee</div>
                    <button
                      type="button"
                      className="add-team-remove-btn"
                      onClick={() => toggleSelect(member.user)}
                      aria-label="Remove member"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="add-team-modal-footer">
          <button className="add-team-btn add-team-btn-secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button
            className="add-team-btn add-team-btn-primary"
            onClick={handleSave}
            disabled={selected.length === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <div className="add-team-btn-spinner"></div>
                Inviting...
              </>
            ) : (
              `Invite ${selected.length} Member${selected.length !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}