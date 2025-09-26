import { Bell, ChevronDown, Menu, Plus, Search, X } from "lucide-react";
import './Header.css'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Header Component
export const Header = ({ onToggleSidebar, isMobileMenuOpen }) => {
  const {user}=useSelector((state)=>state.User)
  const navigate = useNavigate()
  const onLogout = () => {
    navigate('/logout')
  }
  
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="logo">
          <div className="logo-icon">
            <div className="logo-gradient"></div>
            <span>A</span>
          </div>
          <span className="logo-text">CareerFlix</span>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <Search className="search-icon" size={16} />
          <input 
            type="text" 
            placeholder="Search tasks, projects, or team members..." 
            className="search-input"
          />
          <div className="search-shortcut">⌘K</div>
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-actions">
          <button className="header-btn new-btn">
            <Plus size={16} />
            <span className="header-btn-text">New</span>
          </button>
          <button className="header-btn notification-btn">
            <Bell size={16} />
            <div className="notification-badge">3</div>
          </button>
        </div>
        <div className="user-profile">
          <div className="profile-image">
            <img title={user.name} src={user.avatarUrl} alt="Profile" />
            <div className="status-indicator"></div>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-location">{user.email}</span>
          </div>
          <ChevronDown size={14} className="dropdown-icon" />
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;