import { X, Calendar, Clock, Filter, Download, Search, User, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import ApiServices from "../ApiService/ApiService";
import useDebounce from "../hooks/usedebounce";

const EmployeeLeaveDetailsModal = ({ open, onClose, selectedId }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    leaveType: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
    searchTerm: "",
  });

  const debouncedSearch = useDebounce(filters.searchTerm, 700);
  const debounceStatus= useDebounce(filters.status,700);
  const debounceLeaveType= useDebounce(filters.leaveType,700);
  const debouncedateFrom= useDebounce(filters.dateFrom,700);
  const debouncedateTo= useDebounce(filters.dateTo,700);

  const leaveTypes = ["sick", "casual", "earned", "unpaid", "maternity", "paternity"];
  const leaveStatuses = ["approved", "pending", "rejected"];

  const fetchEmployeeLeaveDetails = async () => {
    if (!selectedId) return;
    try {
      setIsLoading(true);
      setError("");

      const params = {
        ...(debounceLeaveType !== "all" && { leaveType: debounceLeaveType }),
        ...(debounceStatus !== "all" && { status: debounceStatus }),
        ...(debouncedateFrom && { dateFrom: debouncedateFrom }),
        ...(debouncedateTo && { dateTo: debouncedateTo}),
        ...(debouncedSearch && { search: debouncedSearch }),
      };

      const response = await ApiServices.GetEMployeeLeavesDetailsById(selectedId, params);
      if (!response) throw new Error("Employee details not found.");

      setSelectedEmployee(response);
    } catch (err) {
      setError(err.message || "Failed to load leave history.");
      setSelectedEmployee(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && selectedId) {
      setFilters({
        leaveType: "all",
        status: "all",
        dateFrom: "",
        dateTo: "",
        searchTerm: "",
      });
      fetchEmployeeLeaveDetails();
    }
  }, [open, selectedId]);

  useEffect(() => {
    if (open && selectedId) {
      fetchEmployeeLeaveDetails();
    }
  }, [debounceStatus,debouncedateFrom,debouncedateTo, debounceLeaveType, debouncedSearch, open, selectedId]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-semibold border";
    switch (status?.toLowerCase()) {
      case "approved":
        return `${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200`;
      case "pending":
        return `${baseClasses} bg-amber-50 text-amber-700 border-amber-200`;
      case "rejected":
        return `${baseClasses} bg-rose-50 text-rose-700 border-rose-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-600 border-gray-200`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Leave History</h2>
              {selectedEmployee?.leaveHistory?.[0]?.employee && (
                <div className="mt-3 flex items-center gap-6 text-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold">
                        {selectedEmployee.leaveHistory[0].employee.name}
                      </p>
                      <p className="text-sm opacity-90">
                        {selectedEmployee.leaveHistory[0].employee.department || "No Department"} •{" "}
                        {selectedEmployee.leaveHistory[0].employee.position || "Employee"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Filters</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leaves..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={filters.leaveType}
                onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Leave Types</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                {leaveStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          <div className="p-8">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                <p className="text-lg font-medium text-gray-700">Loading leave history...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="max-w-md mx-auto text-center py-20">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl">
                  <p className="font-semibold">Failed to Load Data</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Table */}
            {!isLoading && !error && selectedEmployee && (
              <>
                {selectedEmployee.leaveHistory.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Leave Records</h3>
                    <p className="text-gray-500">
                      {Object.values(filters).some((f) => f && f !== "all")
                        ? "Try adjusting your filters"
                        : "This employee has not taken any leave yet."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Leave Type
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            From
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            To
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Days
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedEmployee.leaveHistory.map((leave, index) => (
                          <tr
                            key={index}
                            className="hover:bg-indigo-50/30 transition-colors duration-150"
                          >
                            <td className="px-6 py-5">
                              <span className="font-medium text-gray-900 capitalize">
                                {leave.leaveType}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-gray-600">
                              {formatDate(leave.startDate)}
                            </td>
                            <td className="px-6 py-5 text-gray-600">
                              {formatDate(leave.endDate)}
                            </td>
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center justify-center min-w-12 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                                {leave.numberOfDays}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <span className={getStatusBadge(leave.status)}>
                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-gray-600 text-sm max-w-xs">
                              <p className="truncate" title={leave.reason}>
                                {leave.reason || "—"}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveDetailsModal;