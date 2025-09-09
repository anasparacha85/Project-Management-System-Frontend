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
console.log("already selected",alreadySelected);
const params=useParams()
const dispatch=useDispatch()
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (debouncedSearch) {
          const data = await ApiServices.fetchEmployees(debouncedSearch);
          console.log("hi",data);
          
          setUsers(data);
          setError(null);
        } else {
          setUsers([]);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUsers();
  }, [debouncedSearch]);

const toggleSelect = (user) => {
  setSelected((prev) =>
    prev.some((u) => u.user._id === user._id)
      ? prev.filter((u) => u.user._id !== user._id)
      : [...prev, { user, role: "employee" }] // default role, changeable later
  );
};


  const handleSave =async () => {
    console.log(selected);
    try {
      const data=await ApiServices.InviteMoreMembersByProjectId({members:selected,projectId:params.id})
      alert(data.SuccessMessage)
      
          dispatch(FetchProjectDetailsById(params.id))
          onClose()
      
        
    } catch (error) {
      alert(error.message ||'failed to send invite')
      
    }
    // onSave(selected);
    // onClose();
  };

  return (
    <div
      className="add-members-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="add-members-modal-container">
        {/* Header */}
        <div className="add-members-modal-header">
          <h2>Add Team Members</h2>
          <button className="add-members-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="add-members-input"
          />
        </div>

        {/* Results */}
        <div className="add-members-modal-content">
          {error && <p className="text-red-500">{error}</p>}

          {users?.length > 0 && (
            <div className="add-members-results">
              {users?.map((u) => (
                <label key={u._id} className="add-members-item">
                  <input
                    type="checkbox"
                    checked={selected.some((sel) => sel.user._id === u._id)}
                    onChange={() => toggleSelect(u)}
                  />
                  <div className="add-members-avatar">
                    {u?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="add-members-info">
                    <span className="add-members-name">{u.name}</span>
                    <span className="add-members-email">{u.email}</span>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Selected Members */}
          {selected?.length > 0 && (
            <div className="add-members-selected">
              <h4>Selected Members ({selected.length})</h4>
              <div className="add-members-selected-list">
                {selected?.map((member) => (
                  <div key={member._id} className="add-members-selected-item">
                    <div className="add-members-avatar">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="add-members-info">
                      <span className="add-members-name">{member.user.name}</span>
                      <span className="add-members-email">{member.user.email}</span>
                    </div>
                    <button
                      type="button"
                      className="add-members-remove"
                      onClick={() => toggleSelect(member.user)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="add-members-modal-footer">
          <button className="add-members-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="add-members-btn save" onClick={handleSave}>
            Save Members
          </button>
        </div>
      </div>
    </div>
  );
}
