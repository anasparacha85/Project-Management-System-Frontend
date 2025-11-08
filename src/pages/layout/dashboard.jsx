// import React, { useState, useEffect } from 'react';
// import { Search, Bell, ChevronDown, Calendar, MessageSquare, Paperclip, User, Grid3X3, CheckCircle2, Users, Clock } from 'lucide-react';
// import Header from '../../components/Header/Header';
// import { NavLink, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import ApiServices from '../../ApiService/ApiService';
// import { setUser } from '../../Slices/UserSlice';

// // Sidebar Component
// const Sidebar = ({ activeItem, setActiveItem, isCollapsed, isMobileOpen, onClose }) => {
//   const menuItems = [
//     { id: 'project', label: 'Projects', icon: Grid3X3, count: 12, link: '/dashboard' },
//     { id: 'tasks', label: 'Tasks', icon: CheckCircle2, count: 24, link: '/dashboard/tasks' },
//     { id: 'workload', label: 'Workload', icon: Users, count: null, link: '/workload' },
//     { id: 'performance', label: 'Analytics', icon: Clock, count: null, link: '/performance' },
//     { id: 'settings', label: 'Settings', icon: User, count: null, link: '/settings' }
//   ];

//   return (
//     <>
//       {/* Overlay */}
//       <div 
//         className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 md:hidden ${
//           isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
//         }`} 
//         onClick={onClose}
//       />
      
//       {/* Sidebar */}
//       <aside 
//         className={`fixed top-16 left-0 bottom-0 w-64 bg-[rgb(246,244,243)] backdrop-blur-xl border-r border-white border-opacity-20 py-6 z-50 overflow-y-auto transition-all duration-300 md:translate-x-0 ${
//           isCollapsed ? 'w-20' : 'w-64'
//         } ${
//           isMobileOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:static md:z-auto`}
//       >
//         <nav className="flex flex-col h-full px-4">
//           {/* Navigation Items */}
//           <div className="flex-1">
//            {menuItems.map(item => {
//   const Icon = item.icon;
//   return (
//     <NavLink
//       key={item.id}
//       to={item.link}
//       className={({ isActive }) =>
//         `relative flex items-center mb-1 cursor-pointer transition-all duration-300 rounded-xl overflow-hidden no-underline ${
//           isActive ? 'bg-blue-50 bg-opacity-10' : 'hover:bg-white hover:bg-opacity-80'
//         }`
//       }
//       onClick={onClose}
//     >
//       {({ isActive }) => (
//         <div className="flex items-center gap-3 px-4 py-3 w-full relative">
//           <Icon
//             size={18}
//             className={`transition-colors duration-300 ${
//               isActive ? 'text-blue-600' : 'text-gray-500'
//             }`}
//           />
//           <span
//             className={`text-sm font-medium transition-all duration-300 ${
//               isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
//             } ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
//           >
//             {item.label}
//           </span>
//           {item.count && (
//             <span
//               className={`bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold min-w-5 text-center transition-all duration-300 ${
//                 isCollapsed ? 'opacity-0' : 'opacity-100'
//               }`}
//             >
//               {item.count}
//             </span>
//           )}
//           {isActive && (
//             <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-blue-600 rounded-r" />
//           )}
//         </div>
//       )}
//     </NavLink>
//   );
// })}

//           </div>
          
//           {/* Footer */}
//           <div className="mt-auto pt-4 border-t border-white border-opacity-20">
//             <div className="bg-white bg-opacity-80 p-3 rounded-xl">
//               <div className="w-full h-1 bg-gray-200 rounded overflow-hidden mb-2">
//                 <div 
//                   className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
//                   style={{ width: '65%' }}
//                 />
//               </div>
//               <span className="text-xs text-gray-600 font-medium">6.5GB of 10GB used</span>
//             </div>
//           </div>
//         </nav>
//       </aside>
//     </>
//   );
// };

// const Dashboard = () => {
//   const [activeMenuItem, setActiveMenuItem] = useState('tasks');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await ApiServices.getUserData();
//         dispatch(setUser(response));
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchUser();
//   }, [dispatch]);

//   const { user } = useSelector((state) => state.User);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div 
//       className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 bg-400% bg-animate-gradient"
//       style={{
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         backgroundSize: '400% 400%',
//         animation: 'gradientShift 15s ease infinite'
//       }}
//     >
//       <style jsx>{`
//         @keyframes gradientShift {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//       `}</style>
      
//       <Header onToggleSidebar={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      
//       <div className="flex min-h-[calc(100vh-64px)] relative">
//         <Sidebar 
//           activeItem={activeMenuItem} 
//           setActiveItem={setActiveMenuItem}
//           isCollapsed={sidebarCollapsed && !isMobileMenuOpen}
//           isMobileOpen={isMobileMenuOpen}
//           onClose={closeMobileMenu}
//         />
        
//        <main 
//   className={`flex-1 overflow-y-auto bg-opacity-10 backdrop-blur-xl transition-all duration-300 ${
//     isMobileMenuOpen ? 'ml-0' : 'ml-0 '
//   } ${sidebarCollapsed ? 'md:ml-6' : 'md:ml-2'}`}
// >
//   <Outlet/>
// </main>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Calendar, MessageSquare, Paperclip, User, Grid3X3, CheckCircle2, Users, Clock } from 'lucide-react';
import Header from '../../components/Header/Header';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ApiServices from '../../ApiService/ApiService';
import { setUser } from '../../Slices/UserSlice';

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
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`} 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-16 left-0 bottom-0 bg-white shadow-xl z-50 transition-all duration-300 
        ${isCollapsed ? 'w-20' : 'w-64'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0`}
      >
        <nav className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-6 px-3">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center mb-2 px-4 py-3 rounded-lg transition-all duration-200 no-underline group ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                  onClick={onClose}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        className={`flex-shrink-0 transition-colors duration-200 ${
                          isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                        }`}
                      />
                      <span
                        className={`ml-3 text-sm font-medium transition-all duration-200 ${
                          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.count && !isCollapsed && (
                        <span
                          className={`ml-auto bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isActive ? 'bg-blue-100 text-blue-600' : ''
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
          
          {/* Footer - Storage Info */}
          <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'px-2' : ''}`}>
            {!isCollapsed && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">Storage</span>
                  <span className="text-xs font-bold text-gray-900">65%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: '65%' }}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2 block">6.5 GB of 10 GB used</span>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">65%</span>
                </div>
              </div>
            )}
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
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiServices.getUserData();
        dispatch(setUser(response));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [dispatch]);

  const { user } = useSelector((state) => state.User);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
      <div 
      className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 bg-400% bg-animate-gradient"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <Header onToggleSidebar={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      
      <div className="flex pt-16">
        <Sidebar 
          activeItem={activeMenuItem} 
          setActiveItem={setActiveMenuItem}
          isCollapsed={sidebarCollapsed}
          isMobileOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
        
        {/* Main Content Area */}
        <main 
          className={`flex-1 min-h-[calc(100vh-4rem)] overflow-y-auto  transition-all duration-300 ${
            sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;