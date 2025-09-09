import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Calendar, MessageSquare, Paperclip, User, Grid3X3, CheckCircle2, Users, Clock } from 'lucide-react';
import Header from '../../components/Header/Header';
import { NavLink, Outlet } from 'react-router-dom';
import './dashboard.css';

// Sidebar Component
const Sidebar = ({ activeItem, setActiveItem, isCollapsed, isMobileOpen, onClose }) => {
  const menuItems = [
    { id: 'project', label: 'Projects', icon: Grid3X3, count: 12, link: '/dashboard' },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2, count: 24, link: '/dashboard/tasks' },
    { id: 'workload', label: 'Workload', icon: Users, count: null, link: '/workload' },
    { id: 'performance', label: 'Analytics', icon: Clock, count: null, link: '/performance' },
    { id: 'settings', label: 'Settings', icon: User, count: null, link: '/settings' }
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <nav className="sidebar-nav">
          <div className="nav-section">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.id} 
                  to={item.link} 
                  className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <div className="sidebar-item-content">
                    <Icon size={18} className="sidebar-icon" />
                    <span className="sidebar-label">{item.label}</span>
                    {item.count && (
                      <span className="item-count">{item.count}</span>
                    )}
                  </div>
                  {activeItem === item.id && <div className="active-indicator" />}
                </NavLink>
              );
            })}
          </div>
          
          <div className="sidebar-footer">
            <div className="storage-indicator">
              <div className="storage-bar">
                <div className="storage-used" style={{ width: '65%' }}></div>
              </div>
              <span className="storage-text">6.5GB of 10GB used</span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('tasks');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <div className="dashboard">
      <Header onToggleSidebar={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      
      <div className="dashboard-body">
        <Sidebar 
          activeItem={activeMenuItem} 
          setActiveItem={setActiveMenuItem}
          isCollapsed={sidebarCollapsed && !isMobileMenuOpen}
          isMobileOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
        
        <main className={`main-content ${isMobileMenuOpen ? 'menu-open' : ''}`}>
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;