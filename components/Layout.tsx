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
  { name: 'Employees', href: '/employees', icon: '👥', role: 'manager', group: 'core' },
  { name: 'Attendance', href: '/attendance', icon: '⏰', role: 'all', group: 'core' },
  { name: 'Tasks', href: '/tasks', icon: '📋', role: 'all', group: 'core' },
  
  // HR Functions Group
  { name: 'Leave', href: '/leave', icon: '📅', role: 'all', group: 'hr', badge: '3' },
  { name: 'Holiday', href: '/holiday', icon: '📅', role: 'all', group: 'hr' },
  { name: 'Leave Types', href: '/leave/types', icon: '📋', role: 'manager', group: 'hr' },
  { name: 'Leave Assignment', href: '/leave/assignment', icon: '📌', role: 'manager', group: 'hr' },
  { name: 'Loading UI', href: '/loading-ui', icon: '🔄', role: 'all', group: 'hr' },
  { name: 'Schedule Management', href: '/schedule', icon: '🗓️', role: 'manager', group: 'hr' },
  { name: 'Personal Schedule', href: '/personal-schedule', icon: '📅', role: 'all', group: 'hr' },
  { name: 'Organization', href: '/organization', icon: '🏢', role: 'all', group: 'hr' },
  { name: 'Payroll', href: '/payroll', icon: '💰', role: 'manager', group: 'hr' },
  { name: 'Reports', href: '/reports', icon: '📊', role: 'manager', group: 'hr' },
  { name: 'Office Management', href: '/office', icon: '🏢', role: 'manager', group: 'hr' },
  { name: 'Activity Log', href: '/activity-log', icon: '📝', role: 'manager', group: 'hr' },
  { name: 'Notice Board', href: '/notice-board', icon: '📢', role: 'all', group: 'hr', badge: 'NEW' },
  { name: 'FAQ', href: '/faq', icon: '❓', role: 'all', group: 'hr' },
  { name: 'Q&A / Helpdesk', href: '/helpdesk', icon: '💬', role: 'all', group: 'hr' },
  { name: 'Settings', href: '/settings', icon: '⚙️', role: 'all', group: 'hr' }
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
  const [currentView, setCurrentView] = React.useState<'employee' | 'hr'>('employee'); // New view state
  
  // Load user data from localStorage on component mount
  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'employee' | 'manager';
    const storedName = localStorage.getItem('userName');
    const storedAvatar = localStorage.getItem('userAvatar');
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    const storedLanguage = localStorage.getItem('language') || 'en';
    
    if (storedRole) setUserRole(storedRole);
    if (storedName) setUserName(storedName);
    if (storedAvatar) setUserAvatar(storedAvatar);
    setDarkMode(storedDarkMode);
    setLanguage(storedLanguage);
    
    // HR managers always use HR view
    if (storedRole === 'manager') {
      setCurrentView('hr');
      localStorage.setItem('currentView', 'hr');
    } else {
      setCurrentView('employee');
    }
  }, []);

  // Apply dark mode to document
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Save language preference
  React.useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
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
    
    // HR managers always use HR view
    setCurrentView('hr');
    localStorage.setItem('currentView', 'hr');
  };
  
  // Filter navigation based on user role (HR always shows full navigation)
  const getFilteredNavigation = () => {
    if (userRole === 'employee') {
      // Employee view: show only employee-relevant items
      return navigation.filter(item => 
        item.role === 'all' || item.role === 'employee'
      );
    } else {
      // HR view: show all items based on user role
      return navigation.filter(item => 
        item.role === 'all' || item.role === userRole
      );
    }
  };

  const filteredNavigation = getFilteredNavigation();

  return (
    <div className={`min-h-screen grid grid-cols-1 lg:grid-cols-[256px_1fr] ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0 lg:h-screen lg:overflow-y-auto lg:scrollbar-hide ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:block ${
        darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white'
      }`}>
        <div className="flex h-full flex-col">
          {/* User Profile Section */}
          <div className={`border-b p-4 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{userAvatar}</span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <Link
                  href="/settings"
                  className="block"
                  onClick={() => setSidebarOpen(false)}
                >
                  <p className={`text-sm font-medium truncate hover:text-primary-600 transition-colors cursor-pointer ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {userName}
                  </p>
                </Link>
                <p className={`text-xs truncate ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {userRole === 'manager' ? 'HR Manager' : 'Employee'}
                </p>
              </div>
            </div>
            
            {/* Language and Theme Section - Under User Profile */}
            <div className="space-y-3 mb-4">
              {/* Language Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Language</span>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="ko">🇰🇷 한국어 (Korean)</option>
                  <option value="mn">🇲🇳 Монгол (Mongolia)</option>
                  <option value="my">🇲🇲 မြန်မာစာ (Myanmar)</option>
                </select>
              </div>
              
              {/* Theme Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Theme</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{darkMode ? '🌙' : '☀️'}</span>
                    <span className={`font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
                    darkMode ? 'bg-primary-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      darkMode ? 'translate-x-5' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
            {/* Core Group */}
            <div className="mb-4">
              <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
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
                        ? darkMode 
                          ? 'bg-primary-900 text-primary-300 border-r-2 border-primary-500'
                          : 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.badge === 'NEW' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r ${
                        darkMode ? 'bg-primary-500' : 'bg-primary-600'
                      }`}></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* HR Functions Group */}
            <div className="mb-4">
              <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
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
                        ? darkMode 
                          ? 'bg-primary-900 text-primary-300 border-r-2 border-primary-500'
                          : 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.badge === 'NEW' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r ${
                        darkMode ? 'bg-primary-500' : 'bg-primary-600'
                      }`}></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* System Section */}
          <div className={`border-t p-3 space-y-2 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              System
            </h3>
            
            {/* Sign Out */}
            <button
              onClick={() => {
                // Clear user data from localStorage (Session Management Specification)
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                localStorage.removeItem('userAvatar');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('darkMode');
                localStorage.removeItem('language');
                // Use replace to prevent back navigation
                router.replace('/login');
              }}
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors w-full font-medium ${
                darkMode 
                  ? 'text-red-400 hover:bg-red-900 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
              }`}
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
        <header className={`shadow-sm border-b lg:hidden flex-shrink-0 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`transition-colors ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            {/* Empty space where HR icon was */}
            <div></div>

            <button
              onClick={() => {
                // Clear user data from localStorage (Session Management Specification)
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                localStorage.removeItem('userAvatar');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('darkMode');
                localStorage.removeItem('language');
                // Use replace to prevent back navigation
                router.replace('/login');
              }}
              className={`text-sm transition-colors ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 p-4 lg:p-6 overflow-y-auto ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}