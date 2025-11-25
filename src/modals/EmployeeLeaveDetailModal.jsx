// import { X } from "lucide-react";
// import { useEffect, useState } from "react";
// import ApiServices from "../ApiService/ApiService";

// const EmployeeLeaveDetailsModal = ({ open, onClose, selectedId }) => {
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchEmployeeLeaveDetails = async () => {
//     if (!selectedId) return;
//     try {
//       setIsLoading(true);
//       setError("");
//       const response = await ApiServices.GetEMployeeLeavesDetailsById(selectedId);
//       console.log(response);
      
//       if (!response ) {
//         throw new Error("Employee details not found.");
//       }
//       setSelectedEmployee(response);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to fetch employee leave details.");
//       setSelectedEmployee(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Fetch when modal is opened and a selectedId is present, or when selectedId changes
//     if (!open || !selectedId) return;
//     fetchEmployeeLeaveDetails();
//   }, [open, selectedId]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl relative">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">
//             Leave History – {selectedEmployee?.employeeName || "Employee"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="text-center py-10">
//             <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading leave history...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="text-center py-10 text-red-600 font-medium">
//             {error}
//           </div>
//         )}

//         {/* Leave History Table */}
//         {!isLoading && !error && (
//           <table className="w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 text-left">Type</th>
//                 <th className="p-2 text-left">From</th>
//                 <th className="p-2 text-left">To</th>
//                 <th className="p-2 text-left">Days</th>
//                 <th className="p-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedEmployee?.leaveHistory?.length > 0 ? (
//                 selectedEmployee.leaveHistory.map((l, i) => (
//                   <tr key={i} className="border-b">
//                     <td className="p-2 capitalize">{l.leaveType}</td>
//                     <td className="p-2">{new Date(l.startDate).toLocaleDateString()}</td>
//                     <td className="p-2">{new Date(l.endDate).toLocaleDateString()}</td>
//                     <td className="p-2">{l.numberOfDays}</td>
//                     <td className="p-2 capitalize">{l.status}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="p-4 text-center text-gray-500" colSpan={5}>
//                     No previous leave history
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeLeaveDetailsModal;

import { X, Calendar, Clock, Filter, Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ApiServices from "../ApiService/ApiService";

const EmployeeLeaveDetailsModal = ({ open, onClose, selectedId }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Filter states
  const [filters, setFilters] = useState({
    leaveType: "all",
    status: "all",
    dateRange: "all",
    searchTerm: ""
  });
  
  
  const [filterOptions, setFilterOptions] = useState({
    leaveTypes: [],
    statuses: [],
    dateRanges: [
      { value: "all", label: "All Time" },
      { value: "lastMonth", label: "Last Month" },
      { value: "last3Months", label: "Last 3 Months" },
      { value: "last6Months", label: "Last 6 Months" },
      { value: "thisYear", label: "This Year" }
    ]
  });

  // Fetch filter options from backend
  const fetchFilterOptions = async () => {
    try {
      // Fetch available filter options from backend
      // Uncomment when backend endpoint is ready
      // const filterResponse = await ApiServices.GetLeaveFilterOptions();
      // setFilterOptions(prev => ({
      //   ...prev,
      //   leaveTypes: filterResponse.leaveTypes || [],
      //   statuses: filterResponse.statuses || []
      // }));
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
    }
  };

  const fetchEmployeeLeaveDetails = async () => {
    if (!selectedId) return;
    try {
      setIsLoading(true);
      setError("");
      
      // Build query params with filters
      const params = {
        employeeId: selectedId,
        ...(filters.leaveType !== "all" && { leaveType: filters.leaveType }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.dateRange !== "all" && { dateRange: filters.dateRange }),
        ...(filters.searchTerm && { search: filters.searchTerm })
      };
      
      const response = await ApiServices.GetEMployeeLeavesDetailsById(selectedId);
      console.log(response);
      
      if (!response) {
        throw new Error("Employee details not found.");
      }
      
      setSelectedEmployee(response);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch employee leave details.");
      setSelectedEmployee(null);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (!open || !selectedId) return;
    
    // Fetch filter options when modal opens
    fetchFilterOptions();
    
    // Reset filters when modal opens
    setFilters({
      leaveType: "all",
      status: "all",
      dateRange: "all",
      searchTerm: ""
    });
    
    fetchEmployeeLeaveDetails();
  }, [open, selectedId]);

  // Re-fetch data when filters change
  useEffect(() => {
    if (!open || !selectedId) return;
    
    // Debounce search input
    const timeoutId = setTimeout(() => {
      fetchEmployeeLeaveDetails();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters.leaveType, filters.status, filters.dateRange, filters.searchTerm]);

  // No client-side filtering needed - backend handles it
  const displayedLeaveHistory = selectedEmployee?.leaveHistory || [];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleExport = () => {
    // Export functionality placeholder
    console.log("Exporting leave history...");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Leave History</h2>
              {selectedEmployee && (
                <div className="flex items-center gap-6 text-blue-100 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{displayedLeaveHistory[0]?.employee?.name || "no name"}</span>
                    <span className="opacity-75">•</span>
        
                  </div>

                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

       

        {/* Filters Section */}
        {!isLoading && !error && selectedEmployee && (
          <div className="p-6 bg-white border-b space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Leave Type Filter */}
              <select
                value={filters.leaveType}
                onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-gray-700 bg-white"
              >
                <option value="all">All Leave Types</option>
                {filterOptions.leaveTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-gray-700 bg-white"
              >
                <option value="all">All Statuses</option>
                {filterOptions.statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>

              {/* Date Range Filter */}
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-gray-700 bg-white"
              >
                {filterOptions.dateRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content Area with Scroll */}
        <div className="flex-1 overflow-auto p-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading leave history...</p>
              <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 max-w-md text-center">
                <p className="font-semibold mb-1">Error Loading Data</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Leave History Table */}
          {!isLoading && !error && selectedEmployee && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Days
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedLeaveHistory.length > 0 ? (
                    displayedLeaveHistory.map((leave, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{leave.leaveType}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(leave.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(leave.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
                            {leave.numberOfDays}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                          {leave.reason || "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">No leave records found</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {filters.leaveType !== "all" || filters.status !== "all" || filters.searchTerm
                              ? "Try adjusting your filters"
                              : "This employee has no leave history yet"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveDetailsModal;