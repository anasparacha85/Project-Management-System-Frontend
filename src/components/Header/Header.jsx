import { Bell, ChevronDown, Menu, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import NotificationPopup from "../NotificationPopup";
import { useSocket } from "../../Contexts/notificationcontext";
import ApiServices from "../../ApiService/ApiService";
import { setNotifications } from "../../Slices/NotificationSLice";
import { useDispatch } from "react-redux";

export const Header = ({ onToggleSidebar, isMobileMenuOpen }) => {
  const { user } = useSelector((state) => state.User);
  const navigate = useNavigate();
  const [openNotif, setOpenNotif] = useState(false);
const { unreadCount } = useSelector((state) => state.Notification);
const dispatch = useDispatch();
  const GetNotificationByUserId=async()=>{
    try {
      const response=await ApiServices.GetNotifications();
      console.log(...response.notifications);
      

      dispatch(setNotifications(response.notifications))
    } catch (error) {
      console.error("Error fetching notifications:", error);
      
    }
  }
  useEffect(()=>{
    GetNotificationByUserId()
  },[])
  const onLogout = () => {
    navigate('/logout');
  };

  return (
    <header className="flex items-center justify-between px-6 h-16 bg-white/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 border-none bg-transparent rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl text-white font-bold text-base flex items-center justify-center overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] animate-[gradientRotate_3s_linear_infinite]"></div>
            <span className="relative z-10">A</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight lg:block hidden">
            CareerFlix
          </span>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-2xl mx-8 lg:mx-8 md:mx-4 sm:mx-3 xs:mx-2">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400 z-10" size={16} />
          <input
            type="text"
            placeholder="Search tasks, projects, or team members..."
            className="w-full py-3 px-12 pr-16 border border-gray-200 rounded-xl text-sm bg-white transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <div className="absolute right-4 bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-medium">
            ⌘K
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 py-2 px-4 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 lg:flex hidden">
            <Plus size={16} />
            <span>New</span>
          </button>
          <button 
  onClick={() => setOpenNotif(!openNotif)}
  className="relative flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
>
  <Bell size={18} />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</button>

{openNotif && (
  <NotificationPopup onClose={() => setOpenNotif(false)} />
)}

        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer py-1.5 px-3 rounded-xl bg-white/80 transition-all duration-200 hover:bg-white hover:shadow-sm lg:flex hidden">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <img 
              title={user.name} 
              src={user.avatarUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              {user?.name}
            </span>
            <span className="text-xs text-gray-500 leading-tight lg:block hidden">
              {user.email}
            </span>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="py-2 px-3 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-200  block"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;