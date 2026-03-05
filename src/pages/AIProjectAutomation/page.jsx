import React, { useState } from "react";
import { 
  Sparkles, 
  Target, 
  CheckSquare, 
  Calendar, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Clock, 
  Layers,
  AlertCircle,
  Brain,
  Rocket,
  Stars,
  FolderKanban
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ApiServices from "../../ApiService/ApiService";
import { FetchAllProjects } from "../../Slices/ProjectSlice";
import { useNavigate } from "react-router-dom";

export default function AIAutomationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [automationType, setAutomationType] = useState("breakdown");
  const [projectId, setProjectId] = useState("");
  const [form, setForm] = useState({
    projectDescription: "",
    startDate: "",
    endDate: "",
    numberOfTasks: 5,
    taskDescription: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state?.Project || { projects: [] });
  const navigate=useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validateStep1 = () => {
    setError(null);
    if (automationType === "breakdown") {
      if (!form.projectDescription.trim()) {
        setError("Please describe your project");
        return false;
      }
      if (!form.startDate || !form.endDate) {
        setError("Please select project start and end dates");
        return false;
      }
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end < start) {
        setError("End date must be after start date");
        return false;
      }
    } else {
      if (!projectId) {
        setError("Please select a project");
        return false;
      }
      if (!form.taskDescription.trim()) {
        setError("Please describe the tasks you want to generate");
        return false;
      }
      if (form.numberOfTasks < 1 || form.numberOfTasks > 10) {
        setError("Number of tasks should be between 1 and 10");
        return false;
      }
    }
    return true;
  };

  const simulateProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);
    return interval;
  };

  const handleGenerateProjectBreakdown = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    setLoadingMessage("Analyzing your project requirements...");
    const progressInterval = simulateProgress();
    
    try {
      const data = await ApiServices.generateProjectBreakdown({
        projectDescription: form.projectDescription,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      clearInterval(progressInterval);
      setLoadingProgress(100);
      setGeneratedData(data);
      
      setTimeout(() => {
        setCurrentStep(3);
        setLoadingMessage("");
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || "Failed to generate project breakdown");
      setLoadingMessage("");
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleGenerateTasks = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    setLoadingMessage("Creating tasks for your project...");
    const progressInterval = simulateProgress();
    
    try {
      const data = await ApiServices.generateTasksForProject({
        projectId,
        taskDescription: form.taskDescription,
        numberOfTasks: form.numberOfTasks,
      });

      clearInterval(progressInterval);
      setLoadingProgress(100);
      setGeneratedData(data);
      
      setTimeout(() => {
        setCurrentStep(3);
        setLoadingMessage("");
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || "Failed to generate tasks");
      setLoadingMessage("");
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleConfirmGeneration = async () => {
    setIsLoading(true);
    setLoadingMessage("Finalizing your project...");
    const progressInterval = simulateProgress();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch(FetchAllProjects());

      clearInterval(progressInterval);
      setLoadingProgress(100);
      navigate('/dashboard')
      setTimeout(() => {
        setCurrentStep(1);
        setForm({
          projectDescription: "",
          startDate: "",
          endDate: "",
          numberOfTasks: 5,
          taskDescription: "",
        });
        setProjectId("");
        setGeneratedData(null);
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || "Failed to confirm generation");
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      if (automationType === "breakdown") {
        await handleGenerateProjectBreakdown();
      } else {
        await handleGenerateTasks();
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-8 shadow-2xl">
          <Brain className="w-16 h-16 text-white animate-pulse" />
        </div>
      </div>
      
      <div className="text-center mb-8 space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI is Working Magic ✨
        </h3>
        <p className="text-gray-600 text-lg font-medium">{loadingMessage}</p>
      </div>

      <div className="w-full max-w-md mb-6">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${loadingProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-3 font-medium">{loadingProgress}% Complete</p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-8">
        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <Zap className="w-6 h-6 text-blue-600 mb-2" />
          <span className="text-xs font-semibold text-blue-700">Analyzing</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <Stars className="w-6 h-6 text-purple-600 mb-2" />
          <span className="text-xs font-semibold text-purple-700">Generating</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
          <Rocket className="w-6 h-6 text-pink-600 mb-2" />
          <span className="text-xs font-semibold text-pink-700">Optimizing</span>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Choose Your Path</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => {
                    setAutomationType("breakdown");
                    setError(null);
                  }}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    automationType === "breakdown"
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    automationType === "breakdown" 
                      ? "bg-blue-500 scale-100" 
                      : "bg-gray-200 scale-0"
                  }`}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    automationType === "breakdown"
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                      : "bg-gray-100 group-hover:bg-blue-50"
                  }`}>
                    <Target className={`w-8 h-8 transition-colors duration-300 ${
                      automationType === "breakdown" ? "text-white" : "text-gray-600 group-hover:text-blue-600"
                    }`} />
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Create New Project
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Generate a complete project structure with tasks, milestones, and timelines
                  </p>
                </button>

                <button
                  onClick={() => {
                    setAutomationType("tasks");
                    setError(null);
                  }}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    automationType === "tasks"
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    automationType === "tasks" 
                      ? "bg-purple-500 scale-100" 
                      : "bg-gray-200 scale-0"
                  }`}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    automationType === "tasks"
                      ? "bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg"
                      : "bg-gray-100 group-hover:bg-purple-50"
                  }`}>
                    <CheckSquare className={`w-8 h-8 transition-colors duration-300 ${
                      automationType === "tasks" ? "text-white" : "text-gray-600 group-hover:text-purple-600"
                    }`} />
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Add Milestones
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Generate milestones and checkpoints for an existing project
                  </p>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
              {automationType === "breakdown" ? (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FolderKanban className="w-4 h-4 text-blue-600" />
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="projectDescription"
                      value={form.projectDescription}
                      onChange={handleChange}
                      placeholder="Describe your project in detail... e.g., Create a modern e-commerce platform with payment integration, inventory management, and admin dashboard"
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Calendar className="w-4 h-4 text-green-600" />
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Calendar className="w-4 h-4 text-red-600" />
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Layers className="w-4 h-4 text-purple-600" />
                      Select Project <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    >
                      <option value="">-- Choose a project --</option>
                      {projects?.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <CheckSquare className="w-4 h-4 text-purple-600" />
                      Tell which Milestones You want to Add? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="taskDescription"
                      value={form.taskDescription}
                      onChange={handleChange}
                      placeholder="Name the milestones and its corresponding checkpoints you need... e.g., API development, frontend components, database setup, testing"
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none bg-white shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Layers className="w-4 h-4 text-pink-600" />
                      Number of Milestones (1-10)
                    </label>
                    <input
                      type="number"
                      name="numberOfTasks"
                      value={form.numberOfTasks}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                Ready to Launch! 🚀
              </h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                {automationType === "breakdown"
                  ? "Your AI-powered project structure is ready. Click confirm to create the project with all tasks and subtasks."
                  : "Your milestones are ready to be added to the project. Click confirm to create them."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-xl text-gray-800">Project Summary</h4>
              </div>
              
              <div className="space-y-3">
                {automationType === "breakdown" && (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Project Name</p>
                        <p className="font-semibold text-gray-800">{generatedData?.data?.projectName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layers className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Total Milestones</p>
                        <p className="font-semibold text-gray-800">{generatedData?.data?.tasks?.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckSquare className="w-4 h-4 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Total Checkpoints</p>
                        <p className="font-semibold text-gray-800">
                          {generatedData?.data?.tasks?.reduce(
                            (sum, t) => sum + (t.subtasks?.length || 0),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {automationType === "tasks" && (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layers className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Milestones to Add</p>
                        <p className="font-semibold text-gray-800">{generatedData?.data?.tasks?.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckSquare className="w-4 h-4 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Total Checkpoints</p>
                        <p className="font-semibold text-gray-800">
                          {generatedData?.data?.tasks?.reduce(
                            (sum, t) => sum + (t.subtasks?.length || 0),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    You can review and adjust milestones after creation. Projects start in draft mode for your review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  AI Project Automation
                </h2>
                <p className="text-blue-100 mt-1">
                  Generate projects and milestones using artificial intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {!isLoading && (
            <div className="px-8 pt-8 pb-4">
              <div className="relative">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  {[
                    { num: 1, label: "Setup", icon: Target },
                    { num: 2, label: "Generate", icon: Brain },
                    { num: 3, label: "Confirm", icon: Rocket }
                  ].map(({ num, label, icon: Icon }) => (
                    <div
                      key={num}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 mb-2 ${
                          currentStep > num
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg scale-110"
                            : currentStep === num
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {currentStep > num ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-semibold ${
                        currentStep >= num ? "text-gray-700" : "text-gray-400"
                      }`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-8 pb-8">
            <div className="min-h-[500px]">
              {renderStepContent()}
            </div>
          </div>

          {/* Error Message */}
          {error && !isLoading && (
            <div className="px-8 pb-4">
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="px-8 pb-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                {currentStep > 1 && (
                  <button onClick={prevStep} className="px-4 py-2 border rounded text-gray-700">Previous</button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setForm({ projectDescription: "", startDate: "", endDate: "", numberOfTasks: 5, taskDescription: "" });
                    setProjectId("");
                    setGeneratedData(null);
                    setError(null);
                  }}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Reset
                </button>

                {currentStep < 3 ? (
                  <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded">{isLoading ? loadingMessage || 'Working...' : 'Generate with AI'}</button>
                ) : (
                  <button onClick={handleConfirmGeneration} className="px-4 py-2 bg-green-600 text-white rounded">Confirm</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}