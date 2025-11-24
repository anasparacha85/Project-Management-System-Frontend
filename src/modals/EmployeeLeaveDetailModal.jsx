import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ApiServices from "../ApiService/ApiService";

const EmployeeLeaveDetailsModal = ({ open, onClose, selectedId }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployeeLeaveDetails = async () => {
    if (!selectedId) return;
    try {
      setIsLoading(true);
      setError("");
      const response = await ApiServices.GetEMployeeLeavesDetailsById(selectedId);
      console.log(response);
      
      if (!response || !response.employeeName) {
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
    fetchEmployeeLeaveDetails();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Leave History – {selectedEmployee?.employeeName || "Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leave history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Leave History Table */}
        {!isLoading && !error && (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">From</th>
                <th className="p-2 text-left">To</th>
                <th className="p-2 text-left">Days</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedEmployee?.leaveHistory?.length > 0 ? (
                selectedEmployee.leaveHistory.map((l, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 capitalize">{l.leaveType}</td>
                    <td className="p-2">{new Date(l.startDate).toLocaleDateString()}</td>
                    <td className="p-2">{new Date(l.endDate).toLocaleDateString()}</td>
                    <td className="p-2">{l.numberOfDays}</td>
                    <td className="p-2 capitalize">{l.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={5}>
                    No previous leave history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeaveDetailsModal;
