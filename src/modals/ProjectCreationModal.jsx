import React, { useState, useRef, useMemo, useEffect } from "react";
import "./ProjectModal.css";
import useDebounce from "../hooks/usedebounce";
import ApiServices from "../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../Slices/ProjectSlice";

export default function ProjectModal({ onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    priority: "Medium",
    managerId: "",
    memberIds: [],
    files: [],
    teamName:''
  });
    // ✅ Load form data from localStorage on mount
  useEffect(() => {
    const savedForm = localStorage.getItem("create-project-form");
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, []);

  // ✅ Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("create-project-form", JSON.stringify(form));
  }, [form]);
  const [managers, setManagers] = useState([])
  const [error, setError] = useState(null)
  const [users, setusers] = useState([])
  const totalSteps = 3;
  const fileInputRef = useRef(null);
  const [searchMember, setSearchMember] = useState("");
  const debounceQuery = useDebounce(searchMember, 500)
  const [filteredUsers, setFilteredUsers] = useState(null)
  // const {users}=useSelector((state)=>state.Project)
  const dispatch=useDispatch()

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await ApiServices.fetchAllManagers();
        setManagers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const data = await ApiServices.fetchAllEmployees()
        console.log(data);
      setusers(data)
        setError('')
      } catch (error) {
        setError(error.message);
      }
    }
    fetchAllEmployees()
  }, [])
  
  const priorities = ["Low", "Medium", "High", "Critical"];
  
  const fetchEmployees = async () => {
    try {
      const data = await ApiServices.fetchEmployees(debounceQuery)
      setFilteredUsers(data)
      setError('')
    } catch (error) {
      setError(error.message);
      setFilteredUsers('')
    }
  }
  
  useEffect(() => {
    if (debounceQuery) {
      fetchEmployees()
    }
  }, [debounceQuery])

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleMember(userId) {
    setForm((f) => {
      const exists = f.memberIds.includes(userId);
      return {
        ...f,
        memberIds: exists
          ? f.memberIds.filter((id) => id !== userId)
          : [...f.memberIds, userId],
      };
    });
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    setForm((f) => ({ ...f, files: [...f.files, ...files] }));
  }

  function removeFile(index) {
    setForm((f) => {
      const newFiles = [...f.files];
      newFiles.splice(index, 1);
      return { ...f, files: newFiles };
    });
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("Please enter a project title");
      return;
    }
    if (!form.managerId) {
      alert("Please select a manager");
      return;
    }
    if (form.files.length >= 4) {
      alert('you can only select 3 files at a time')
      return
    }
    if (form.memberIds.length === 0) {
      alert("Please select at least one team member");
      return;
    }
    onSubmit(form);
    localStorage.removeItem('create-project-form')
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  
  const getSelectedMembers = () => {
    return users.filter(user => form.memberIds.includes(user._id));
  }
  
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!form.name.trim()) {
          setError("Please enter a project title");
          return false;
        }
        break;
      case 2:
        if (!form.startDate) {
          setError("Please select a start date");
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(form.startDate);

        if (startDate < today) {
          setError("Start date cannot be in the past");
          return false;
        }

        if (form.endDate) {
          const endDate = new Date(form.endDate);
          if (endDate < startDate) {
            setError("End date should be after the start date");
            return false;
          }
        }
        break
      case 3:
        if (!form.managerId) {
          setError("Please select a manager");
          return false;
        }
        if (form.memberIds.length === 0) {
          setError("Please select at least one team member");
          return false;
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="create-project-step-content">
            <div className="create-project-step-header">
              <h3>Project Information</h3>
              <p>Tell us about your project's basic details</p>
            </div>

            <div className="create-project-form-field">
              <label>Project Title <span className="create-project-required">*</span></label>
              <input
                name="name"
                type="text"
                placeholder="e.g., Website Revamp"
                value={form.name}
                onChange={handleChange}
                className="create-project-form-input"
              />
            </div>

            <div className="create-project-form-field">
              <label>Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe your project's scope, goals, and key deliverables..."
                value={form.description}
                onChange={handleChange}
                className="create-project-form-textarea"
              />
            </div>

            <div className="create-project-form-field">
              <label>Attach Documents</label>
              <div className="create-project-file-upload-area" onClick={() => fileInputRef.current?.click()}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p>Click to upload files or drag and drop</p>
                <span>PNG, JPEG, PDF, DOC, XLS up to 10MB</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
              />

              {form.files.length > 0 && (
                <div className="create-project-file-list">
                  {form.files.map((file, i) => (
                    <div key={i} className="create-project-file-item">
                      <div className="create-project-file-icon">📄</div>
                      <div className="create-project-file-details">
                        <span className="create-project-file-name">{file.name}</span>
                        <span className="create-project-file-size">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button
                        type="button"
                        className="create-project-file-remove"
                        onClick={() => removeFile(i)}
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
          <div className="create-project-step-content">
            <div className="create-project-step-header">
              <h3>Timeline & Budget</h3>
              <p>Set your project timeline and budget details</p>
            </div>

            <div className="create-project-form-row">
              <div className="create-project-form-field">
                <label>Estimated Start Date <span className="create-project-required">*</span></label>
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  className="create-project-form-input"
                />
              </div>
              <div className="create-project-form-field">
                <label>Estimated End Date</label>
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  className="create-project-form-input"
                />
              </div>
            </div>

            <div className="create-project-form-row">
              <div className="create-project-form-field">
                <label>Estimated Budget</label>
                <div className="create-project-input-with-prefix">
                  <span className="create-project-input-prefix">$</span>
                  <input
                    name="budget"
                    type="number"
                    placeholder="50,000"
                    value={form.budget}
                    onChange={handleChange}
                    className="create-project-form-input"
                  />
                </div>
              </div>
              <div className="create-project-form-field">
                <label>Priority Level</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="create-project-form-select"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="create-project-pri-indicator">
              <span className={`create-project-pri-badge create-project-priority-${form.priority.toLowerCase()}`}>
                {form.priority} Priority
              </span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="create-project-step-content">
            <div className="create-project-step-header">
              <h3>Team Assignment</h3>
              <p>Assign project manager and team members</p>
            </div>

            <div className="create-project-form-field">
            <div className="create-project-form-field">
                <label>Team Name</label>
                <div className="create-project-input-with-prefix">
                 
                  <input
                    name="teamName"
                    type="text"
                    placeholder="--project team--"
                    value={form.teamName}
                    onChange={handleChange}
                    className="create-project-form-input"
                  />
                </div>
              </div>
              <label>Project Manager <span className="create-project-required">*</span></label>
              <select
                name="managerId"
                value={form.managerId}
                onChange={handleChange}
                className="create-project-form-select"
              >
                <option value="">Select a manager...</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} — {m.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="create-project-form-field">
              <label>Team Members <span className="create-project-required">*</span></label>
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="create-project-form-input create-project-search-input"
              />

              {searchMember?.trim() && filteredUsers?.length > 0 && (
                <div className="create-project-member-search-results">
                  {filteredUsers?.map((u) => (
                    <label key={u._id} className="create-project-member-item horizontal-layout">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.memberIds.includes(u._id)}
                          onChange={() => toggleMember(u._id)}
                        />
                      </div>
                      <div className="create-project-member-details">
                        <div className="create-project-member-avatar">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="create-project-member-info">
                          <span className="create-project-member-name">{u.name}</span>
                          <span className="create-project-member-email">{u.email}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {getSelectedMembers()?.length > 0 && (
                <div className="create-project-selected-members">
                  <h4>Selected Members ({getSelectedMembers().length})</h4>
                  <div className="create-project-selected-member-list">
                    {getSelectedMembers().map((member) => (
                      <div key={member._id} className="create-project-selected-member">
                        <div className="create-project-member-avatar">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="create-project-member-info">
                          <span className="create-project-member-name">{member.name}</span>
                          <span className="create-project-member-email">{member.email}</span>
                        </div>
                        <button
                          type="button"
                          className="create-project-remove-member"
                          onClick={() => toggleMember(member._id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        
           
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-project-modal-backdrop" onClick={handleBackdropClick}>
      <div className="create-project-modal-container">
        <div className="create-project-modal-header">
          <h2>Create New Project</h2>
          <button className="create-project-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="create-project-progress-container">
          <div className="create-project-progress-bar">
            <div
              className="create-project-progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="create-project-step-indicators">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i + 1} className={`create-project-step-indicator ${currentStep >= i + 1 ? 'create-project-active' : ''} ${currentStep > i + 1 ? 'create-project-completed' : ''}`}>
                {currentStep > i + 1 ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="create-project-modal-form" >
          <div className="create-project-modal-content">
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

          <div className="create-project-modal-footer">
            <div className="create-project-footer-left">
              {currentStep > 1 && (
                <button type="button" className="create-project-btn-secondary" onClick={prevStep}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="create-project-footer-right">
              <button type="button" className="create-project-btn-ghost" onClick={onClose}>
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button type="button" className="create-project-btn-primary" onClick={nextStep}>
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              ) : (
                <button type="submit" onClick={handleSubmit} className="create-project-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Create Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}