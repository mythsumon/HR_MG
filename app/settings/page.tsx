'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = React.useState('profile');
  const [userRole, setUserRole] = React.useState<'employee' | 'manager'>('employee');
  const [userName, setUserName] = React.useState('John Doe');
  const [userEmail, setUserEmail] = React.useState('employee@company.com');
  const [userAvatar, setUserAvatar] = React.useState('JD');
  
  // Load user data from localStorage
  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'employee' | 'manager';
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedAvatar = localStorage.getItem('userAvatar');
    
    if (storedRole) setUserRole(storedRole);
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
    if (storedAvatar) setUserAvatar(storedAvatar);
  }, []);

  // Profile Settings State
  const [profileData, setProfileData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    avatar: null as File | null
  });

  // Account & Security State
  const [securityData, setSecurityData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  // Notifications State
  const [notificationSettings, setNotificationSettings] = React.useState({
    emailNotifications: true,
    pushNotifications: true,
    attendanceReminders: true,
    payrollUpdates: true
  });

  // Language & Region State
  const [regionSettings, setRegionSettings] = React.useState({
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY'
  });

  // Appearance State
  const [appearanceSettings, setAppearanceSettings] = React.useState({
    theme: 'light',
    autoMode: false
  });

  // System Preferences State
  const [systemSettings, setSystemSettings] = React.useState({
    defaultAttendanceView: 'month',
    exportFormat: 'csv'
  });

  React.useEffect(() => {
    setProfileData({
      fullName: userName,
      email: userEmail,
      phone: '+1 (555) 123-4567',
      jobTitle: userRole === 'manager' ? 'HR Manager' : 'Employee',
      avatar: null
    });
  }, [userName, userEmail, userRole]);

  const handleProfileSave = () => {
    console.log('Saving profile:', profileData);
    localStorage.setItem('userName', profileData.fullName);
    localStorage.setItem('userEmail', profileData.email);
    setUserName(profileData.fullName);
    setUserEmail(profileData.email);
  };

  const handlePasswordChange = () => {
    console.log('Changing password');
    setSecurityData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleSystemReset = () => {
    setRegionSettings({
      language: 'en',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY'
    });
    setAppearanceSettings({
      theme: 'light',
      autoMode: false
    });
    setSystemSettings({
      defaultAttendanceView: 'month',
      exportFormat: 'csv'
    });
    setNotificationSettings({
      emailNotifications: true,
      pushNotifications: true,
      attendanceReminders: true,
      payrollUpdates: true
    });
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'security', label: 'Account & Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'region', label: 'Language & Region', icon: '🌐' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'system', label: 'System Preferences', icon: '⚙️' }
  ];

  const recentLogins = [
    { device: 'Windows PC', location: 'New York, NY', time: '2024-01-15 09:30', current: true },
    { device: 'iPhone 15', location: 'New York, NY', time: '2024-01-14 18:45', current: false },
    { device: 'MacBook Pro', location: 'New York, NY', time: '2024-01-13 08:15', current: false }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and system preferences</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Navigation Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Panel - Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              
              {/* Profile Settings */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
                    <p className="text-gray-600">Update your personal information and profile picture</p>
                  </div>
                  
                  {/* Avatar Upload */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">{userAvatar}</span>
                      </div>
                      <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-primary-700 transition-colors">
                        ✏️
                      </button>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Profile Picture</h4>
                      <p className="text-sm text-gray-500">Click the edit icon to upload a new avatar</p>
                    </div>
                  </div>
                  
                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={profileData.jobTitle}
                        onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProfileSave}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* Account & Security */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Account & Security</h3>
                    <p className="text-gray-600">Manage your password and security settings</p>
                  </div>
                  
                  {/* Change Password */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                  
                  {/* Two Factor Authentication */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securityData.twoFactorEnabled}
                          onChange={(e) => setSecurityData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Recent Login Activity */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Recent Login Activity</h4>
                    <div className="space-y-3">
                      {recentLogins.map((login, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600">💻</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{login.device}</p>
                              <p className="text-sm text-gray-500">{login.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{login.time}</p>
                            {login.current && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
                    <p className="text-gray-600">Choose what notifications you'd like to receive</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📧</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Push Notifications</h4>
                          <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">⏰</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Attendance Reminders</h4>
                          <p className="text-sm text-gray-600">Get reminded about clock-in and clock-out times</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.attendanceReminders}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, attendanceReminders: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💰</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Payroll Updates</h4>
                          <p className="text-sm text-gray-600">Notifications about payroll and salary updates</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.payrollUpdates}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, payrollUpdates: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Language & Region */}
              {activeSection === 'region' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Language & Region</h3>
                    <p className="text-gray-600">Set your language, timezone, and regional preferences</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={regionSettings.language}
                        onChange={(e) => setRegionSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="en">🇺🇸 English</option>
                        <option value="es">🇪🇸 Spanish</option>
                        <option value="fr">🇫🇷 French</option>
                        <option value="de">🇩🇪 German</option>
                        <option value="zh">🇨🇳 Chinese</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                      <select
                        value={regionSettings.timezone}
                        onChange={(e) => setRegionSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Date Format</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="dateFormat"
                          value="MM/DD/YYYY"
                          checked={regionSettings.dateFormat === 'MM/DD/YYYY'}
                          onChange={(e) => setRegionSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">MM/DD/YYYY (12/31/2024)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="dateFormat"
                          value="DD/MM/YYYY"
                          checked={regionSettings.dateFormat === 'DD/MM/YYYY'}
                          onChange={(e) => setRegionSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">DD/MM/YYYY (31/12/2024)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Appearance</h3>
                    <p className="text-gray-600">Customize the look and feel of your interface</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Theme Preference</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'light' }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          appearanceSettings.theme === 'light' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-full h-20 bg-white border border-gray-200 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-2xl">☀️</span>
                        </div>
                        <h4 className="font-medium text-gray-900">Light</h4>
                        <p className="text-sm text-gray-600">Clean and bright interface</p>
                      </div>
                      
                      <div
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'dark' }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          appearanceSettings.theme === 'dark' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-full h-20 bg-gray-800 border border-gray-600 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-2xl">🌙</span>
                        </div>
                        <h4 className="font-medium text-gray-900">Dark</h4>
                        <p className="text-sm text-gray-600">Easy on the eyes</p>
                      </div>
                      
                      <div
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'auto' }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          appearanceSettings.theme === 'auto' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-full h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-2xl">🔄</span>
                        </div>
                        <h4 className="font-medium text-gray-900">Auto</h4>
                        <p className="text-sm text-gray-600">Matches system preference</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Preferences */}
              {activeSection === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">System Preferences</h3>
                    <p className="text-gray-600">Configure system-wide settings and defaults</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Attendance View</label>
                      <select
                        value={systemSettings.defaultAttendanceView}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, defaultAttendanceView: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="month">📅 Month View</option>
                        <option value="week">📆 Week View</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                      <select
                        value={systemSettings.exportFormat}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, exportFormat: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="csv">📊 CSV Format</option>
                        <option value="pdf">📄 PDF Format</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSystemReset}
                      className="bg-red-100 text-red-700 px-6 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}