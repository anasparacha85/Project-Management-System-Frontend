// import React, { useState } from "react";
// import ApiServices from "../ApiService/ApiService";
// import { useDispatch, useSelector } from "react-redux";
// import { FetchAllProjects } from "../Slices/ProjectSlice";

// export default function AIProjectAutomationModal({ onClose }) {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [automationType, setAutomationType] = useState("breakdown"); // 'breakdown' or 'tasks'
//   const [projectId, setProjectId] = useState("");
//   const [form, setForm] = useState({
//     projectDescription: "",
//     startDate: "",
//     endDate: "",
//     numberOfTasks: 5,
//     taskDescription: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [generatedData, setGeneratedData] = useState(null);
//   const [loadingMessage, setLoadingMessage] = useState("");
//   const dispatch = useDispatch();
//   const {projects, projectError, projectLoading} = useSelector((state) => state.Project)

//   const totalSteps = automationType === "breakdown" ? 3 : 3;

  

// //   React.useEffect(() => {
// //     if (automationType === "tasks") {
// //       fetchProjects();
// //     }
// //   }, [automationType]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const validateStep1 = () => {
//     setError(null);
//     if (automationType === "breakdown") {
//       if (!form.projectDescription.trim()) {
//         setError("Please describe your project");
//         return false;
//       }
//       if (!form.startDate || !form.endDate) {
//         setError("Please select project start and end dates");
//         return false;
//       }
//       const start = new Date(form.startDate);
//       const end = new Date(form.endDate);
//       if (end < start) {
//         setError("End date must be after start date");
//         return false;
//       }
//     } else {
//       if (!projectId) {
//         setError("Please select a project");
//         return false;
//       }
//       if (!form.taskDescription.trim()) {
//         setError("Please describe the tasks you want to generate");
//         return false;
//       }
//       if (form.numberOfTasks < 1 || form.numberOfTasks > 10) {
//         setError("Number of tasks should be between 1 and 10");
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleGenerateProjectBreakdown = async () => {
//     if (!validateStep1()) return;

//     setIsLoading(true);
//     setLoadingMessage("🤖 AI is analyzing your project requirements...");
//     try {
//       const data = await ApiServices.generateProjectBreakdown({
//         projectDescription: form.projectDescription,
//         startDate: form.startDate,
//         endDate: form.endDate,
//       });

//       setGeneratedData(data);
//       setCurrentStep(3);
//       setLoadingMessage("");
//     } catch (err) {
//       setError(err.message || "Failed to generate project breakdown");
//       setLoadingMessage("");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGenerateTasks = async () => {
//     if (!validateStep1()) return;

//     setIsLoading(true);
//     setLoadingMessage("🤖 AI is creating tasks for your project...");
//     try {
//       const data = await ApiServices.generateTasksForProject({
//         projectId,
//         taskDescription: form.taskDescription,
//         numberOfTasks: form.numberOfTasks,
//       });

//       setGeneratedData(data);
//       setCurrentStep(3);
//       setLoadingMessage("");
//     } catch (err) {
//       setError(err.message || "Failed to generate tasks");
//       setLoadingMessage("");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleConfirmGeneration = async () => {
//     setIsLoading(true);
//     setLoadingMessage("✅ Creating project and tasks...");
//     try {
//       // The generation endpoints already create the data,
//       // so we just need to confirm and close
//       dispatch(FetchAllProjects());
//       onClose();
//     } catch (err) {
//       setError(err.message || "Failed to confirm generation");
//     } finally {
//       setIsLoading(false);
//       setLoadingMessage("");
//     }
//   };

//   const nextStep = async () => {
//     if (currentStep === 1) {
//       if (automationType === "breakdown") {
//         await handleGenerateProjectBreakdown();
//       } else {
//         await handleGenerateTasks();
//       }
//     } else {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <div className="text-center mb-8">
//               <div className="flex justify-center gap-4 mb-6">
//                 <button
//                   onClick={() => {
//                     setAutomationType("breakdown");
//                     setError(null);
//                   }}
//                   className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
//                     automationType === "breakdown"
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-200 bg-gray-50 hover:border-gray-300"
//                   }`}
//                 >
//                   <div className="text-2xl mb-2">🎯</div>
//                   <h3 className="font-semibold text-gray-800 mb-1">
//                     Create Project
//                   </h3>
//                   <p className="text-xs text-gray-600">
//                     Generate full project breakdown with tasks
//                   </p>
//                 </button>

//                 <button
//                   onClick={() => {
//                     setAutomationType("tasks");
//                     setError(null);
//                   }}
//                   className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
//                     automationType === "tasks"
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-200 bg-gray-50 hover:border-gray-300"
//                   }`}
//                 >
//                   <div className="text-2xl mb-2">✅</div>
//                   <h3 className="font-semibold text-gray-800 mb-1">
                   
//                   </h3>
//                   <p className="text-xs text-gray-600">
//                     Generate tasks for existing project
//                   </p>
//                 </button>
//               </div>
//             </div>

//             {automationType === "breakdown" ? (
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Project Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     name="projectDescription"
//                     value={form.projectDescription}
//                     onChange={handleChange}
//                     placeholder="e.g., Create a modern e-commerce platform with payment integration, inventory management, and admin dashboard"
//                     rows="4"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Start Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={form.startDate}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       End Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={form.endDate}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Project <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={projectId}
//                     onChange={(e) => setProjectId(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   >
//                     <option value="">-- Choose a project --</option>
//                     {projects.map((p) => (
//                       <option key={p._id} value={p._id}>
//                         {p.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Task Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     name="taskDescription"
//                     value={form.taskDescription}
//                     onChange={handleChange}
//                     placeholder="e.g., API development, frontend components, database setup, testing"
//                     rows="4"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Number of Tasks (1-10)
//                   </label>
//                   <input
//                     type="number"
//                     name="numberOfTasks"
//                     value={form.numberOfTasks}
//                     onChange={handleChange}
//                     min="1"
//                     max="10"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-4">
//             <div className="text-center mb-8">
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 Review Generated Data
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 AI will create the following structure
//               </p>
//             </div>

//             <div className="space-y-4 max-h-96 overflow-y-auto">
//               {generatedData?.data?.projectName && (
//                 <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                   <h4 className="font-semibold text-gray-800 mb-2">
//                     📋 {generatedData.data.projectName}
//                   </h4>
//                   <p className="text-sm text-gray-600">
//                     {generatedData.data.projectDescription}
//                   </p>
//                   {generatedData.data.budget && (
//                     <p className="text-sm text-gray-700 mt-2">
//                       💰 Budget: ${generatedData.data.budget}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {generatedData?.data?.tasks?.length > 0 && (
//                 <div className="space-y-3">
//                   <h4 className="font-semibold text-gray-800">
//                     Tasks ({generatedData.data.tasks.length})
//                   </h4>
//                   {generatedData.data.tasks.map((task, idx) => (
//                     <div
//                       key={idx}
//                       className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <h5 className="font-medium text-gray-800">
//                           {idx + 1}. {task.title}
//                         </h5>
//                         <span
//                           className={`text-xs px-2 py-1 rounded-full font-medium ${
//                             task.priority === "High"
//                               ? "bg-red-100 text-red-700"
//                               : task.priority === "Medium"
//                               ? "bg-yellow-100 text-yellow-700"
//                               : "bg-green-100 text-green-700"
//                           }`}
//                         >
//                           {task.priority}
//                         </span>
//                       </div>
//                       <p className="text-xs text-gray-600 mb-2">
//                         {task.description}
//                       </p>
//                       <div className="text-xs text-gray-500 flex gap-4">
//                         <span>⏱️ {task.estimatedHours}h</span>
//                         {task.subtasks?.length > 0 && (
//                           <span>✓ {task.subtasks.length} subtasks</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   strokeWidth="2"
//                 >
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">
//                 Ready to Generate!
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 {automationType === "breakdown"
//                   ? "Your AI-powered project structure is ready. Click confirm to create the project with all tasks and subtasks."
//                   : "Your tasks are ready to be added to the project. Click confirm to create them."}
//               </p>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h4 className="font-semibold text-gray-800 mb-3">Summary:</h4>
//               <ul className="space-y-2 text-sm text-gray-700">
//                 {automationType === "breakdown" && (
//                   <>
//                     <li className="flex items-center gap-2">
//                       <span className="text-blue-600">✓</span>
//                       Project Name: <strong>{generatedData?.data?.projectName}</strong>
//                     </li>
//                     <li className="flex items-center gap-2">
//                       <span className="text-blue-600">✓</span>
//                       Total Tasks: <strong>{generatedData?.data?.tasks?.length}</strong>
//                     </li>
//                     <li className="flex items-center gap-2">
//                       <span className="text-blue-600">✓</span>
//                       Total Subtasks:{" "}
//                       <strong>
//                         {generatedData?.data?.tasks?.reduce(
//                           (sum, t) => sum + (t.subtasks?.length || 0),
//                           0
//                         )}
//                       </strong>
//                     </li>
//                   </>
//                 )}
//                 {automationType === "tasks" && (
//                   <>
//                     <li className="flex items-center gap-2">
//                       <span className="text-blue-600">✓</span>
//                       Tasks to Add: <strong>{generatedData?.data?.tasks?.length}</strong>
//                     </li>
//                     <li className="flex items-center gap-2">
//                       <span className="text-blue-600">✓</span>
//                       Total Subtasks:{" "}
//                       <strong>
//                         {generatedData?.data?.tasks?.reduce(
//                           (sum, t) => sum + (t.subtasks?.length || 0),
//                           0
//                         )}
//                       </strong>
//                     </li>
//                   </>
//                 )}
//               </ul>
//             </div>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//               <p className="text-sm text-gray-700">
//                 <strong>💡 Tip:</strong> You can review and adjust tasks after
//                 creation. Projects start in draft mode for your review.
//               </p>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-start justify-center z-50 p-5 animate-fadeIn"
//       onClick={handleBackdropClick}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slideUp">
//         <div className="flex items-center justify-between p-6 border-b border-gray-100 mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">🤖 AI Automation</h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Generate projects and tasks using AI
//             </p>
//           </div>
//           <button
//             className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//             onClick={onClose}
//             disabled={isLoading}
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               strokeWidth="2"
//             >
//               <line x1="18" y1="6" x2="6" y2="18" />
//               <line x1="6" y1="6" x2="18" y2="18" />
//             </svg>
//           </button>
//         </div>

//         <div className="px-6 pb-6">
//           <div className="h-1 bg-gray-200 rounded-full mb-4 overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300"
//               style={{ width: `${(currentStep / 3) * 100}%` }}
//             />
//           </div>
//           <div className="flex justify-between mb-8">
//             {Array.from({ length: 3 }, (_, i) => (
//               <div
//                 key={i + 1}
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
//                   currentStep > i + 1
//                     ? "bg-green-500 text-white"
//                     : currentStep === i + 1
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-500"
//                 }`}
//               >
//                 {currentStep > i + 1 ? "✓" : i + 1}
//               </div>
//             ))}
//           </div>
//         </div>

//         {loadingMessage && (
//           <div className="mx-6 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
//             <div className="animate-spin">
//               <svg
//                 className="w-5 h-5 text-blue-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   fill="none"
//                   opacity="0.1"
//                 />
//                 <path
//                   d="M4 12a8 8 0 0 1 8-8"
//                   strokeLinecap="round"
//                   strokeWidth="2"
//                 />
//               </svg>
//             </div>
//             <span className="text-sm font-medium text-blue-700">
//               {loadingMessage}
//             </span>
//           </div>
//         )}

//         <div className="flex flex-col flex-1 min-h-0">
//           <div className="flex-1 overflow-y-auto px-6">
//             <div className="min-h-[400px]">{renderStepContent()}</div>
//           </div>

//           {error && (
//             <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
//               <svg
//                 className="w-4 h-4 flex-shrink-0"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <line x1="15" y1="9" x2="9" y2="15" />
//                 <line x1="9" y1="9" x2="15" y2="15" />
//               </svg>
//               {error}
//             </div>
//           )}

//           <div className="flex items-center justify-between p-6 border-t border-gray-100 mt-auto">
//             <div className="flex items-center gap-3">
//               {currentStep > 1 && !isLoading && (
//                 <button
//                   type="button"
//                   className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
//                   onClick={prevStep}
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     strokeWidth="2"
//                   >
//                     <polyline points="15,18 9,12 15,6" />
//                   </svg>
//                   Previous
//                 </button>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 type="button"
//                 className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium text-sm disabled:opacity-50"
//                 onClick={onClose}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>

//               {currentStep < 3 ? (
//                 <button
//                   type="button"
//                   disabled={isLoading}
//                   className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={nextStep}
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg
//                         className="w-4 h-4 animate-spin"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           fill="none"
//                           opacity="0.1"
//                         />
//                         <path
//                           d="M4 12a8 8 0 0 1 8-8"
//                           strokeLinecap="round"
//                           strokeWidth="2"
//                         />
//                       </svg>
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       Next
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         strokeWidth="2"
//                       >
//                         <polyline points="9,18 15,12 9,6" />
//                       </svg>
//                     </>
//                   )}
//                 </button>
//               ) : (
//                 <button
//                   disabled={isLoading}
//                   type="submit"
//                   onClick={handleConfirmGeneration}
//                   className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg
//                         className="w-4 h-4 animate-spin"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           fill="none"
//                           opacity="0.1"
//                         />
//                         <path
//                           d="M4 12a8 8 0 0 1 8-8"
//                           strokeLinecap="round"
//                           strokeWidth="2"
//                         />
//                       </svg>
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         strokeWidth="2"
//                       >
//                         <polyline points="20,6 9,17 4,12" />
//                       </svg>
//                       Confirm & Generate
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//         .animate-slideUp {
//           animation: slideUp 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }
// import React, { useState } from "react";
// import { 
//   Sparkles, 
//   Target, 
//   CheckSquare, 
//   Calendar, 
//   Zap, 
//   ArrowRight, 
//   ArrowLeft, 
//   X, 
//   Check, 
//   Clock, 
//   Layers,
//   AlertCircle,
//   Loader2,
//   Brain,
//   Rocket,
//   Stars,
//   FolderKanban
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { FetchAllProjects } from "../Slices/ProjectSlice";



// export default function AIProjectAutomationModal({ onClose }) {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [automationType, setAutomationType] = useState("breakdown");
//   const [projectId, setProjectId] = useState("");
//   const [form, setForm] = useState({
//     projectDescription: "",
//     startDate: "",
//     endDate: "",
//     numberOfTasks: 5,
//     taskDescription: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [generatedData, setGeneratedData] = useState(null);
//   const [loadingMessage, setLoadingMessage] = useState("");
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const dispatch = useDispatch();
//   const { projects } = useSelector((state) => state?.Project || { projects: [] });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const validateStep1 = () => {
//     setError(null);
//     if (automationType === "breakdown") {
//       if (!form.projectDescription.trim()) {
//         setError("Please describe your project");
//         return false;
//       }
//       if (!form.startDate || !form.endDate) {
//         setError("Please select project start and end dates");
//         return false;
//       }
//       const start = new Date(form.startDate);
//       const end = new Date(form.endDate);
//       if (end < start) {
//         setError("End date must be after start date");
//         return false;
//       }
//     } else {
//       if (!projectId) {
//         setError("Please select a project");
//         return false;
//       }
//       if (!form.taskDescription.trim()) {
//         setError("Please describe the tasks you want to generate");
//         return false;
//       }
//       if (form.numberOfTasks < 1 || form.numberOfTasks > 10) {
//         setError("Number of tasks should be between 1 and 10");
//         return false;
//       }
//     }
//     return true;
//   };

//   const simulateProgress = () => {
//     setLoadingProgress(0);
//     const interval = setInterval(() => {
//       setLoadingProgress(prev => {
//         if (prev >= 95) {
//           clearInterval(interval);
//           return 95;
//         }
//         return prev + 5;
//       });
//     }, 150);
//     return interval;
//   };

//   const handleGenerateProjectBreakdown = async () => {
//     if (!validateStep1()) return;

//     setIsLoading(true);
//     setLoadingMessage("Analyzing your project requirements...");
//     const progressInterval = simulateProgress();
    
//     try {
//       const data = await ApiServices.generateProjectBreakdown({
//         projectDescription: form.projectDescription,
//         startDate: form.startDate,
//         endDate: form.endDate,
//       });

//       clearInterval(progressInterval);
//       setLoadingProgress(100);
//       setGeneratedData(data);
      
//       setTimeout(() => {
//         setCurrentStep(3);
//         setLoadingMessage("");
//         setIsLoading(false);
//         setLoadingProgress(0);
//       }, 500);
//     } catch (err) {
//       clearInterval(progressInterval);
//       setError(err.message || "Failed to generate project breakdown");
//       setLoadingMessage("");
//       setIsLoading(false);
//       setLoadingProgress(0);
//     }
//   };

//   const handleGenerateTasks = async () => {
//     if (!validateStep1()) return;

//     setIsLoading(true);
//     setLoadingMessage("Creating tasks for your project...");
//     const progressInterval = simulateProgress();
    
//     try {
//       const data = await ApiServices.generateTasksForProject({
//         projectId,
//         taskDescription: form.taskDescription,
//         numberOfTasks: form.numberOfTasks,
//       });

//       clearInterval(progressInterval);
//       setLoadingProgress(100);
//       setGeneratedData(data);
      
//       setTimeout(() => {
//         setCurrentStep(3);
//         setLoadingMessage("");
//         setIsLoading(false);
//         setLoadingProgress(0);
//       }, 500);
//     } catch (err) {
//       clearInterval(progressInterval);
//       setError(err.message || "Failed to generate tasks");
//       setLoadingMessage("");
//       setIsLoading(false);
//       setLoadingProgress(0);
//     }
//   };

//   const handleConfirmGeneration = async () => {
//     setIsLoading(true);
//     setLoadingMessage("Finalizing your project...");
//     const progressInterval = simulateProgress();
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       dispatch(FetchAllProjects());
//       clearInterval(progressInterval);
//       setLoadingProgress(100);
      
//       setTimeout(() => {
//         onClose();
//       }, 500);
//     } catch (err) {
//       clearInterval(progressInterval);
//       setError(err.message || "Failed to confirm generation");
//       setIsLoading(false);
//       setLoadingProgress(0);
//     }
//   };

//   const nextStep = async () => {
//     if (currentStep === 1) {
//       if (automationType === "breakdown") {
//         await handleGenerateProjectBreakdown();
//       } else {
//         await handleGenerateTasks();
//       }
//     } else {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget && !isLoading) {
//       onClose();
//     }
//   };

//   const LoadingScreen = () => (
//     <div className="flex flex-col items-center justify-center py-20 px-8">
//       <div className="relative mb-8">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
//         <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-8 shadow-2xl">
//           <Brain className="w-16 h-16 text-white animate-pulse" />
//         </div>
//       </div>
      
//       <div className="text-center mb-8 space-y-3">
//         <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           AI is Working Magic ✨
//         </h3>
//         <p className="text-gray-600 text-lg font-medium">{loadingMessage}</p>
//       </div>

//       <div className="w-full max-w-md mb-6">
//         <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
//           <div 
//             className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
//             style={{ width: `${loadingProgress}%` }}
//           >
//             <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
//           </div>
//         </div>
//         <p className="text-center text-sm text-gray-500 mt-3 font-medium">{loadingProgress}% Complete</p>
//       </div>

//       <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-8">
//         <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
//           <Zap className="w-6 h-6 text-blue-600 mb-2" />
//           <span className="text-xs font-semibold text-blue-700">Analyzing</span>
//         </div>
//         <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
//           <Stars className="w-6 h-6 text-purple-600 mb-2" />
//           <span className="text-xs font-semibold text-purple-700">Generating</span>
//         </div>
//         <div className="flex flex-col items-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
//           <Rocket className="w-6 h-6 text-pink-600 mb-2" />
//           <span className="text-xs font-semibold text-pink-700">Optimizing</span>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStepContent = () => {
//     if (isLoading) {
//       return <LoadingScreen />;
//     }

//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-8">
//             <div className="text-center">
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-6">
//                 <Sparkles className="w-4 h-4 text-blue-600" />
//                 <span className="text-sm font-semibold text-gray-700">Choose Your Path</span>
//               </div>
              
//               <div className="grid grid-cols-2 gap-6">
//                 <button
//                   onClick={() => {
//                     setAutomationType("breakdown");
//                     setError(null);
//                   }}
//                   className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
//                     automationType === "breakdown"
//                       ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105"
//                       : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
//                   }`}
//                 >
//                   <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
//                     automationType === "breakdown" 
//                       ? "bg-blue-500 scale-100" 
//                       : "bg-gray-200 scale-0"
//                   }`}>
//                     <Check className="w-4 h-4 text-white" />
//                   </div>
                  
//                   <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
//                     automationType === "breakdown"
//                       ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
//                       : "bg-gray-100 group-hover:bg-blue-50"
//                   }`}>
//                     <Target className={`w-8 h-8 transition-colors duration-300 ${
//                       automationType === "breakdown" ? "text-white" : "text-gray-600 group-hover:text-blue-600"
//                     }`} />
//                   </div>
                  
//                   <h3 className="font-bold text-lg text-gray-800 mb-2">
//                     Create New Project
//                   </h3>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     Generate a complete project structure with tasks, milestones, and timelines
//                   </p>
//                 </button>

//                 <button
//                   onClick={() => {
//                     setAutomationType("tasks");
//                     setError(null);
//                   }}
//                   className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
//                     automationType === "tasks"
//                       ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105"
//                       : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
//                   }`}
//                 >
//                   <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
//                     automationType === "tasks" 
//                       ? "bg-purple-500 scale-100" 
//                       : "bg-gray-200 scale-0"
//                   }`}>
//                     <Check className="w-4 h-4 text-white" />
//                   </div>
                  
//                   <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
//                     automationType === "tasks"
//                       ? "bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg"
//                       : "bg-gray-100 group-hover:bg-purple-50"
//                   }`}>
//                     <CheckSquare className={`w-8 h-8 transition-colors duration-300 ${
//                       automationType === "tasks" ? "text-white" : "text-gray-600 group-hover:text-purple-600"
//                     }`} />
//                   </div>
                  
//                   <h3 className="font-bold text-lg text-gray-800 mb-2">
//                     Add Milestones
//                   </h3>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     Generate milestones and checkpoints for an existing project
//                   </p>
//                 </button>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
//               {automationType === "breakdown" ? (
//                 <div className="space-y-6">
//                   <div>
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
//                       <FolderKanban className="w-4 h-4 text-blue-600" />
//                       Project Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       name="projectDescription"
//                       value={form.projectDescription}
//                       onChange={handleChange}
//                       placeholder="Describe your project in detail... e.g., Create a modern e-commerce platform with payment integration, inventory management, and admin dashboard"
//                       rows="4"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white shadow-sm"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-6">
//                     <div>
//                       <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
//                         <Calendar className="w-4 h-4 text-green-600" />
//                         Start Date <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={form.startDate}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
//                         <Calendar className="w-4 h-4 text-red-600" />
//                         End Date <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="date"
//                         name="endDate"
//                         value={form.endDate}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div>
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
//                       <Layers className="w-4 h-4 text-purple-600" />
//                       Select Project <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={projectId}
//                       onChange={(e) => setProjectId(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
//                     >
//                       <option value="">-- Choose a project --</option>
//                       {projects?.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
//                       <CheckSquare className="w-4 h-4 text-purple-600" />
//                       Milestones Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       name="taskDescription"
//                       value={form.taskDescription}
//                       onChange={handleChange}
//                       placeholder="Describe the milestones you need... e.g., API development, frontend components, database setup, testing"
//                       rows="4"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none bg-white shadow-sm"
//                     />
//                   </div>

//                   <div>
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
//                       <Layers className="w-4 h-4 text-pink-600" />
//                       Number of Milestones (1-10)
//                     </label>
//                     <input
//                       type="number"
//                       name="numberOfTasks"
//                       value={form.numberOfTasks}
//                       onChange={handleChange}
//                       min="1"
//                       max="10"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-8">
//             <div className="text-center">
//               <div className="relative inline-block mb-6">
//                 <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
//                 <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
//                   <Check className="w-10 h-10 text-white" strokeWidth={3} />
//                 </div>
//               </div>
              
//               <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
//                 Ready to Launch! 🚀
//               </h3>
//               <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
//                 {automationType === "breakdown"
//                   ? "Your AI-powered project structure is ready. Click confirm to create the project with all tasks and subtasks."
//                   : "Your milestones are ready to be added to the project. Click confirm to create them."}
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                   <Sparkles className="w-5 h-5 text-white" />
//                 </div>
//                 <h4 className="font-bold text-xl text-gray-800">Project Summary</h4>
//               </div>
              
//               <div className="space-y-3">
//                 {automationType === "breakdown" && (
//                   <>
//                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100">
//                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Target className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm text-gray-600">Project Name</p>
//                         <p className="font-semibold text-gray-800">{generatedData?.data?.projectName}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100">
//                       <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Layers className="w-4 h-4 text-purple-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm text-gray-600">Total Milestones</p>
//                         <p className="font-semibold text-gray-800">{generatedData?.data?.tasks?.length}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
//                       <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <CheckSquare className="w-4 h-4 text-pink-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm text-gray-600">Total Checkpoints</p>
//                         <p className="font-semibold text-gray-800">
//                           {generatedData?.data?.tasks?.reduce(
//                             (sum, t) => sum + (t.subtasks?.length || 0),
//                             0
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </>
//                 )}
//                 {automationType === "tasks" && (
//                   <>
//                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100">
//                       <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Layers className="w-4 h-4 text-purple-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm text-gray-600">Milestones to Add</p>
//                         <p className="font-semibold text-gray-800">{generatedData?.data?.tasks?.length}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
//                       <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <CheckSquare className="w-4 h-4 text-pink-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm text-gray-600">Total Checkpoints</p>
//                         <p className="font-semibold text-gray-800">
//                           {generatedData?.data?.tasks?.reduce(
//                             (sum, t) => sum + (t.subtasks?.length || 0),
//                             0
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
//               <div className="flex gap-4">
//                 <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
//                   <Zap className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     You can review and adjust milestones after creation. Projects start in draft mode for your review.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
//       onClick={handleBackdropClick}
//     >
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-slideUp overflow-hidden">
//         {/* Header */}
//         <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8">
//           <div className="absolute inset-0 bg-black/10"></div>
//           <div className="relative flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
//                 <Sparkles className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-3xl font-bold text-white flex items-center gap-2">
//                   AI Project Automation
//                 </h2>
//                 <p className="text-blue-100 mt-1">
//                   Generate projects and milestones using artificial intelligence
//                 </p>
//               </div>
//             </div>
//             <button
//               className="w-10 h-10 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-xl transition-all duration-200 flex items-center justify-center border border-white/30 group"
//               onClick={onClose}
//               disabled={isLoading}
//             >
//               <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
//             </button>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         {!isLoading && (
//           <div className="px-8 pt-8 pb-4">
//             <div className="relative">
//               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
//                   style={{ width: `${(currentStep / 3) * 100}%` }}
//                 />
//               </div>
//               <div className="flex justify-between mt-4">
//                 {[
//                   { num: 1, label: "Setup", icon: Target },
//                   { num: 2, label: "Generate", icon: Brain },
//                   { num: 3, label: "Confirm", icon: Rocket }
//                 ].map(({ num, label, icon: Icon }) => (
//                   <div
//                     key={num}
//                     className="flex flex-col items-center"
//                   >
//                     <div
//                       className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 mb-2 ${
//                         currentStep > num
//                           ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg scale-110"
//                           : currentStep === num
//                           ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110"
//                           : "bg-gray-100 text-gray-400"
//                       }`}
//                     >
//                       {currentStep > num ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
//                     </div>
//                     <span className={`text-xs font-semibold ${
//                       currentStep >= num ? "text-gray-700" : "text-gray-400"
//                     }`}>
//                       {label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto px-8 pb-8">
//           <div className="min-h-[500px]">
//             {renderStepContent()}
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && !isLoading && (
//           <div className="mx-8 mb-4">
//             <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700">
//               <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <AlertCircle className="w-5 h-5 text-red-600" />
//               </div>
//               <p className="font-medium">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         {!isLoading && (
//           <div className="flex items-center justify-between p-8 border-t-2 border-gray-100 bg-gray-50">
//             <div className="flex items-center gap-3">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 font-semibold"
//                   onClick={prevStep}
//                 >
//                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
//                   Previous
//                 </button>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 type="button"
//                 className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 font-semibold"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>

//               {currentStep < 3 ? (
//                 <button
//                   type="button"
//                   className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
//                   onClick={nextStep}
//                 >
//                   Generate with AI
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   onClick={handleConfirmGeneration}
//                   className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
//                 >
//                   <Check className="w-4 h-4" />
//                   Confirm & Generate
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//         .animate-slideUp {
//           animation: slideUp 0.4s ease-out;
//         }
//         .animate-shimmer::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: -100%;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(
//             90deg,
//             transparent,
//             rgba(255, 255, 255, 0.4),
//             transparent
//           );
//           animation: shimmer 2s infinite;
//         }
//       `}</style>
//     </div>
//   );
// }
import React, { useState } from "react";
import { 
  Sparkles, 
  Target, 
  Calendar, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Check, 
  Layers,
  AlertCircle,
  Brain,
  Rocket,
  Stars,
  FolderKanban,
  CheckSquare
} from "lucide-react";
import { useDispatch } from "react-redux";
import { FetchAllProjects } from "../Slices/ProjectSlice";
import ApiServices from "../ApiService/ApiService";

export default function AICreateProjectModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    projectDescription: "",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validateStep1 = () => {
    setError(null);
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
        setCurrentStep(2);
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

  const handleConfirmGeneration = async () => {
    setIsLoading(true);
    setLoadingMessage("Finalizing your project...");
    const progressInterval = simulateProgress();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch(FetchAllProjects());
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      setTimeout(() => {
        onClose();
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
      await handleGenerateProjectBreakdown();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
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
                <span className="text-sm font-semibold text-gray-700">Create New Project</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
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

                <div className="grid grid-cols-2 gap-6">
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
            </div>
          </div>
        );

      case 2:
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
                Your AI-powered project structure is ready. Click confirm to create the project with all tasks and subtasks.
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
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-slideUp overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  Create New Project with AI
                </h2>
                <p className="text-blue-100 mt-1">
                  Generate a complete project with AI-powered milestones
                </p>
              </div>
            </div>
            <button
              className="w-10 h-10 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-xl transition-all duration-200 flex items-center justify-center border border-white/30 group"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isLoading && (
          <div className="px-8 pt-8 pb-4">
            <div className="relative">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-4">
                {[
                  { num: 1, label: "Setup", icon: Target },
                  { num: 2, label: "Confirm", icon: Rocket }
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
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="min-h-[500px]">
            {renderStepContent()}
          </div>
        </div>

        {/* Error Message */}
        {error && !isLoading && (
          <div className="mx-8 mb-4">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isLoading && (
          <div className="flex items-center justify-between p-8 border-t-2 border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 font-semibold"
                  onClick={prevStep}
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 font-semibold"
                onClick={onClose}
              >
                Cancel
              </button>

              {currentStep < 2 ? (
                <button
                  type="button"
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                  onClick={nextStep}
                >
                  Generate with AI
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleConfirmGeneration}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                >
                  <Check className="w-4 h-4" />
                  Confirm & Generate
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .animate-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}