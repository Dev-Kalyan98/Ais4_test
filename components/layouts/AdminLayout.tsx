
import React, { useContext } from 'react';
import { Outlet, NavLink, Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogoIcon, DashboardIcon, UsersIcon, QuestionIcon, LogoutIcon } from '../Icon';

const AdminLayout: React.FC = () => {
  const { isAdmin, logout, user } = useContext(AuthContext);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navLinkClass = "flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors duration-200";
  const activeNavLinkClass = "flex items-center px-4 py-3 bg-primary text-white rounded-md font-semibold shadow-inner";

  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col shadow-lg">
        <div className="flex items-center justify-center h-20 border-b border-slate-700">
           <Link to="/admin/dashboard" className="flex items-center">
             <LogoIcon className="h-16 w-auto" />
           </Link>
        </div>
        <nav className="flex-grow p-4 space-y-2">
           <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}>
             <DashboardIcon className="h-5 w-5 mr-3" />
             Dashboard
           </NavLink>
           <NavLink to="/admin/users" className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}>
             <UsersIcon className="h-5 w-5 mr-3" />
             Users
           </NavLink>
           <NavLink to="/admin/questions" className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}>
             <QuestionIcon className="h-5 w-5 mr-3" />
             Questions
           </NavLink>
        </nav>
         <div className="p-4 border-t border-slate-700">
          <button 
            onClick={logout} 
            className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors duration-200"
          >
            <LogoutIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 z-10">
            <h1 className="text-xl font-semibold text-dark">Admin Console</h1>
            <p className="text-sm text-dark-700">Welcome, {user?.name || 'Admin'}</p>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
