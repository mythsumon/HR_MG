'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  role?: 'all' | 'employee' | 'manager';
  group: 'core' | 'hr' | 'system';
  badge?: string;
}

const navigation: NavigationItem[] = [
  // Core Group
  { name: 'Dashboard', href: '/dashboard', icon: '🏠', role: 'all', group: 'core' },
  { name: 'Employees', href: '/employees', icon: '👥', role: 'all', group: 'core' },
  { name: 'Attendance', href: '/attendance', icon: '⏰', role: 'all', group: 'core' },
  { name: 'Tasks', href: '/tasks', icon: '📋', role: 'all', group: 'core' },
  
  // HR Functions Group
  { name: 'Leave Requests', href: '/leave', icon: '📅', role: 'all', group: 'hr', badge: '3' },
  { name: 'Payroll', href: '/payroll', icon: '💰', role: 'manager', group: 'hr' },
  { name: 'Reports', href: '/reports', icon: '📊', role: 'manager', group: 'hr' },
  
  // HR Manager specific items
  { name: 'Approvals', href: '/approvals', icon: '✅', role: 'manager', group: 'hr' },
  { name: 'Team Attendance', href: '/team-attendance', icon: '👥⏰', role: 'manager', group: 'hr' },
  { name: 'Task Assignments', href: '/task-assignments', icon: '📋👥', role: 'manager', group: 'hr' },
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  // const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false); // Disabled collapsible feature
  const [darkMode, setDarkMode] = React.useState(false);
  const [language, setLanguage] = React.useState('en');
  const [userRole, setUserRole] = React.useState<'employee' | 'manager'>('employee');
  const [userName, setUserName] = React.useState('John Doe');
  const [userAvatar, setUserAvatar] = React.useState('JD');
  
  // Load user data from localStorage on component mount
  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'employee' | 'manager';
    const storedName = localStorage.getItem('userName');
    const storedAvatar = localStorage.getItem('userAvatar');
    
    if (storedRole) setUserRole(storedRole);
    if (storedName) setUserName(storedName);
    if (storedAvatar) setUserAvatar(storedAvatar);
  }, []);
  
  // Function to switch to HR Manager view
  const switchToManagerView = () => {
    // Update to manager account info
    setUserRole('manager');
    setUserName('Sarah Johnson');
    setUserAvatar('SJ');
    
    // Update localStorage
    localStorage.setItem('userRole', 'manager');
    localStorage.setItem('userName', 'Sarah Johnson');
    localStorage.setItem('userAvatar', 'SJ');
    localStorage.setItem('userEmail', 'manager@company.com');
  };
  
  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => 
    item.role === 'all' || item.role === userRole
  );

  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-1 lg:grid-cols-[256px_1fr]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0 lg:h-screen lg:overflow-y-auto lg:scrollbar-hide ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}>
        <div className="flex h-full flex-col">
          {/* Header Section */}
          <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-4 justify-center">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">HR</span>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{userAvatar}</span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userRole === 'manager' ? 'HR Manager' : 'Employee'}
                </p>
              </div>
            </div>
            <Link
              href="/profile"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              View Profile →
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
            {/* Core Group */}
            <div className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Main
              </h3>
              {filteredNavigation.filter(item => item.group === 'core').map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* HR Functions Group */}
            <div className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                HR Functions
              </h3>
              {filteredNavigation.filter(item => item.group === 'hr').map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* System Section */}
          <div className="border-t border-gray-200 p-3 space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              System
            </h3>
            
            {/* Settings */}
            <Link
              href="/settings"
              className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg mr-3">⚙️</span>
              Settings
            </Link>
            
            {/* Language Selector */}
            <div className="px-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Language</span>
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors w-full justify-between"
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">{darkMode ? '🌙' : '☀️'}</span>
                Theme
              </div>
              <span className="text-xs text-gray-500">{darkMode ? 'Dark' : 'Light'}</span>
            </button>
            
            {/* Sign Out */}
            <button
              onClick={() => {
                // Clear user data from localStorage
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                localStorage.removeItem('userAvatar');
                localStorage.removeItem('userEmail');
                router.push('/login');
              }}
              className="flex items-center px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors w-full font-medium"
            >
              <span className="text-lg mr-3">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col min-w-0 h-screen">
        {/* Top header for mobile */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden flex-shrink-0">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HR</span>
              </div>
            </div>

            <button
              onClick={() => {
                // Clear user data from localStorage
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                localStorage.removeItem('userAvatar');
                localStorage.removeItem('userEmail');
                router.push('/login');
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}