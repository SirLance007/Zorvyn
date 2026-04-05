import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'ANALYST') {
    navItems.push({ name: 'Transactions', path: '/transactions', icon: <ArrowRightLeft className="w-5 h-5" /> });
  }

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Manage Users', path: '/users', icon: <Users className="w-5 h-5" /> });
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-black tracking-widest bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            ZORVYN
          </h1>
        </div>
        <button
          onClick={logout}
          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-xl hidden md:flex flex-col relative z-20">
        <div className="p-8 border-b border-zinc-900">
          <h1 className="text-3xl font-black tracking-widest bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-xl">
            ZORVYN
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-bold">Finance OS</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-white font-medium border border-purple-500/20 shadow-lg shadow-purple-500/5' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border hover:border-zinc-800 border border-transparent'
                }`}
              >
                <div className={`${isActive ? 'text-purple-400' : 'text-zinc-500'}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg">
              {user?.name?.charAt(0) || 'Z'}
            </div>
            <div>
              <p className="font-bold text-sm truncate max-w-[120px]">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-all border border-transparent hover:border-red-900/30"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 flex justify-around items-center p-2 pb-6">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${
                isActive ? 'text-purple-400' : 'text-zinc-500'
              }`}
            >
              <div className="p-1">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
};

export default SidebarLayout;
