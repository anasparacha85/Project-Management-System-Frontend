import React, { useState, useRef, useMemo, useEffect } from "react";
import useDebounce from "../hooks/usedebounce";
import ApiServices from "../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllProjects, setUsers } from "../Slices/ProjectSlice";
import DescriptionField from "../components/CustomFields/DescriptionField";
import "react-quill/dist/quill.snow.css";

export default function ProjectModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    budget: "",
    priority: "Medium",
    managerId: "",
    memberIds: [],
    files: [],
    teamName: ''
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

  const [managers, setManagers] = useState([]);
  const [error, setError] = useState(null);
  const [users, setusers] = useState([]);
  const totalSteps = 3;
  const fileInputRef = useRef(null);
  const [searchMember, setSearchMember] = useState("");
  const debounceQuery = useDebounce(searchMember, 500);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state?.User || {});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await ApiServices.fetchAllManagers();
        setManagers(data);
      } catch (error) {
        setError(error?.message);
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const data = await ApiServices.fetchAllEmployees();
        console.log(data);
        setusers(data);
        setError('');
      } catch (error) {
        setError(error?.message);
      }
    };
    fetchAllEmployees();
  }, []);

  const priorities = ["Low", "Medium", "High", "Critical"];

  const fetchEmployees = async () => {
    try {
      const data = await ApiServices.fetchEmployees(debounceQuery);
      setFilteredUsers(data);
      setError('');
    } catch (error) {
      setError(error?.message);
      setFilteredUsers('');
    }
  };

  useEffect(() => {
    if (debounceQuery) {
      fetchEmployees();
    }
  }, [debounceQuery]);

  function handleChange(e) {
    const { name, value } = e?.target || {};
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleMember(userId) {
    setForm((f) => {
      const exists = f?.memberIds?.includes(userId);
      return {
        ...f,
        memberIds: exists
          ? f?.memberIds?.filter((id) => id !== userId) || []
          : [...(f?.memberIds || []), userId],
      };
    });
  }

  function handleFileChange(e) {
    const files = Array.from(e?.target?.files || []);
    setForm((f) => ({ ...f, files: [...(f?.files || []), ...files] }));
  }

  function removeFile(index) {
    setForm((f) => {
      const newFiles = [...(f?.files || [])];
      newFiles?.splice(index, 1);
      return { ...f, files: newFiles };
    });
  }

  const handleSubmit = async () => {
    if (!form?.name?.trim()) {
      setError("Please enter a project title");
      return;
    }

    if (form?.files?.length >= 4) {
      setError('You can only select 3 files at a time');
      return;
    }
    if (form?.memberIds?.length === 0) {
      setError("Please select at least one team member");
      return;
    }
    setIsSubmitting(true);
    const projectData = form;
    const formData = new FormData();

    // append normal fields
    formData.append("name", projectData?.name || '');
    formData.append("description", projectData?.description || '');
    formData.append("startDate", projectData?.startDate || '');
    formData.append("endDate", projectData?.endDate || '');
    formData.append("budget", projectData?.budget || '');
    formData.append("priority", projectData?.priority || '');
    formData.append("teamName", projectData?.teamName || '');

    // memberIds ek array hai → isko loop se bhejna hoga
    projectData?.memberIds?.forEach((id) => {
      formData.append("memberIds[]", id);
    });

    // files bhi ek array hai
    projectData?.files?.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const data = await ApiServices.createProject(formData);
      console.log("data", data);
      alert(data?.SuccessMessage || 'Project created successfully');
      onClose?.();
      dispatch(FetchAllProjects());
    } catch (error) {
      console.log(error?.message);
      setError(error?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }

    localStorage.removeItem('create-project-form');
  };

  function handleBackdropClick(e) {
    if (e?.target === e?.currentTarget) {
      onClose?.();
    }
  }

  const getSelectedMembers = () => {
    return users?.filter(user => form?.memberIds?.includes(user?._id)) || [];
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!form?.name?.trim()) {
          setError("Please enter a project title");
          return false;
        }
        break;
      case 2:
        if (!form?.startDate) {
          setError("Please select a start date");
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(form?.startDate);

        if (form?.endDate) {
          const endDate = new Date(form?.endDate);
          if (endDate < startDate) {
            setError("End date should be after the start date");
            return false;
          }
        }
        break;
      case 3:
        if (!form?.managerId) {
          setError("Please select a manager");
          return false;
        }
        if (form?.memberIds?.length === 0) {
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Project Information</h3>
              <p className="text-gray-600 text-sm">Tell us about your project's basic details</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g., Website Revamp"
                value={form?.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

           
              
             <DescriptionField
  description={form.description}
  setDescription={(value) => setForm({ ...form, description: value })}
  name={form.name}
  type={"project"}
  parent={""}
/>

         

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Attach Documents</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p className="font-medium text-gray-700 mb-1">Click to upload files</p>
                <span className="text-xs text-gray-500">PNG, JPEG, PDF, DOC, XLS up to 10MB</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
              />

              {form?.files?.length > 0 && (
                <div className="space-y-2 mt-4">
                  {form?.files?.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl">📄</div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium text-gray-700 text-sm truncate">{file?.name}</span>
                        <span className="text-xs text-gray-500">{(file?.size / 1024)?.toFixed(1)} KB</span>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors duration-200"
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Timeline & Budget</h3>
              <p className="text-gray-600 text-sm">Set your project timeline and budget details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Estimated Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="startDate"
                  type="date"
                  value={form?.startDate || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Estimated End Date</label>
                <input
                  name="endDate"
                  type="date"
                  value={form?.endDate || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Estimated Budget</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    name="budget"
                    type="number"
                    placeholder="50,000"
                    value={form?.budget || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Priority Level</label>
                <select
                  name="priority"
                  value={form?.priority || 'Medium'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {priorities?.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase ${
                form?.priority?.toLowerCase() === 'low' ? 'bg-green-100 text-green-800' :
                form?.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                form?.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                'bg-red-200 text-red-900'
              }`}>
                {form?.priority || 'Medium'} Priority
              </span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Team Assignment</h3>
              <p className="text-gray-600 text-sm">Assign project manager and team members</p>
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <div className="relative">
                  <input
                    name="teamName"
                    type="text"
                    placeholder="--project team--"
                    value={form?.teamName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Team Members <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={searchMember || ''}
                onChange={(e) => setSearchMember(e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />

              {searchMember?.trim() && filteredUsers?.length > 0 && (
                <div className="border border-gray-200 rounded-lg mt-2 max-h-72 overflow-y-auto">
                  {filteredUsers?.map((u) => (
                    <label key={u?._id} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form?.memberIds?.includes(u?._id)}
                          onChange={() => toggleMember(u?._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                          {u?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-medium text-gray-700 text-sm">{u?.name}</span>
                          <span className="block text-xs text-gray-500">{u?.email}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {getSelectedMembers()?.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3">
                    Selected Members ({getSelectedMembers()?.length})
                  </h4>
                  <div className="space-y-2">
                    {getSelectedMembers()?.map((member) => (
                      <div key={member?._id} className="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                          {member?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-medium text-gray-700 text-sm">{member?.name}</span>
                          <span className="block text-xs text-gray-500">{member?.email}</span>
                        </div>
                        <button
                          type="button"
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                          onClick={() => toggleMember(member?._id)}
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
    <div 
      className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-start justify-center z-50 p-5 animate-fadeIn"
      // onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
          <button 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="h-1 bg-gray-200 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mb-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div 
                key={i + 1} 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep > i + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === i + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > i + 1 ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6">
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex items-center justify-between p-6 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
                  onClick={prevStep}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={onClose}
              >
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm"
                  onClick={nextStep}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              ) : (
                <button 
                  disabled={IsSubmitting}
                  type="submit" 
                  onClick={handleSubmit} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  {IsSubmitting ? "Creating project..." : "Create Project"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}