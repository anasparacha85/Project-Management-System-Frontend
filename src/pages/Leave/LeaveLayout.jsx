import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LeaveLayout() {
  const { user } = useSelector(state => state.User);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* NAV TABS */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <nav className="flex gap-4 overflow-x-auto">
              {user.role === "employee" ? (
                <>
                  <NavLink
                    to="request"
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm rounded-lg ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                      }`
                    }
                  >
                    Request Leave
                  </NavLink>

                  <NavLink
                    to="my-leaves"
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm rounded-lg ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                      }`
                    }
                  >
                    My Leaves
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="manager-requests"
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm rounded-lg ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                      }`
                    }
                  >
                    Leave Requests
                  </NavLink>

                  <NavLink
                    to="manager-summary"
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm rounded-lg ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                      }`
                    }
                  >
                    Team Summary
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* ROUTES RENDER */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
