'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function EmployeesPage() {
  const router = useRouter();
  const [userRole, setUserRole] = React.useState<'employee' | 'manager'>('employee');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<any>(null);
  const [editEmployee, setEditEmployee] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('active'); // Default to active for employees
  const [sortBy, setSortBy] = React.useState('newest');
  
  // Load user role from localStorage
  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'employee' | 'manager';
    if (storedRole) {
      setUserRole(storedRole);
      // For employees, default to showing only active employees
      if (storedRole === 'employee') {
        setStatusFilter('active');
      }
    }
  }, []);
  const [newEmployee, setNewEmployee] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    department: '',
    position: '',
    employeeId: '',
    employmentType: 'full-time',
    status: 'active',
    profilePhoto: null as File | null,
    resume: null as File | null,
    idProof: null as File | null
  });

  // Mock employee data with today's attendance
  const employees = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'active',
      joinDate: '2023-01-15',
      avatar: 'SJ',
      todayStatus: 'present',
      clockIn: '09:05'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      status: 'active',
      joinDate: '2023-03-20',
      avatar: 'MC',
      todayStatus: 'present',
      clockIn: '08:45'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      department: 'HR',
      position: 'HR Specialist',
      status: 'active',
      joinDate: '2023-06-10',
      avatar: 'ER',
      todayStatus: 'late',
      clockIn: '09:30'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      status: 'inactive',
      joinDate: '2022-11-05',
      avatar: 'DW',
      todayStatus: 'absent',
      clockIn: null
    },
    {
      id: 5,
      name: 'Lisa Park',
      email: 'lisa.park@company.com',
      department: 'Design',
      position: 'UX Designer',
      status: 'active',
      joinDate: '2024-01-08',
      avatar: 'LP',
      todayStatus: 'present',
      clockIn: '08:55'
    },
    {
      id: 6,
      name: 'John Smith',
      email: 'employee@company.com',
      department: 'Operations',
      position: 'Operations Manager',
      status: 'active',
      joinDate: '2023-05-12',
      avatar: 'JS',
      todayStatus: 'present',
      clockIn: '09:05'
    }
  ];

  const departments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Design', 'Sales', 'Operations', 'Legal'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case 'a-z': return a.name.localeCompare(b.name);
      case 'z-a': return b.name.localeCompare(a.name);
      case 'newest': return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default: return 0;
    }
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding employee:', newEmployee);
    setShowAddModal(false);
    // Reset form
    setNewEmployee({
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      department: '',
      position: '',
      employeeId: '',
      employmentType: 'full-time',
      status: 'active',
      profilePhoto: null,
      resume: null,
      idProof: null
    });
  };

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEditEmployee = (employee: any) => {
    setEditEmployee({
      ...employee,
      fullName: employee.name,
      employeeId: `EMP${employee.id.toString().padStart(3, '0')}`,
      employmentType: 'full-time',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      phone: '+1234567890',
      profilePhoto: null,
      resume: null,
      idProof: null
    });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating employee:', editEmployee);
    setShowEditModal(false);
    setEditEmployee(null);
  };

  const handleDeleteEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const confirmDeleteEmployee = () => {
    console.log('Deleting employee:', selectedEmployee);
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setNewEmployee(prev => ({ ...prev, [field]: file }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userRole === 'employee' ? 'Team Directory' : 'Employees'}
            </h1>
            <p className="text-gray-600">
              {userRole === 'employee' 
                ? 'View your colleagues and today\'s attendance status' 
                : 'Manage your organization\'s employees'
              }
            </p>
          </div>
          {userRole === 'manager' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 font-medium shadow-sm"
            >
              <span>➕</span>
              <span>Add Employee</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userRole === 'employee' ? (
            // Employee View - Today's Attendance Stats
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-50">
                    <span className="text-green-600 text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Present Today</p>
                    <p className="text-2xl font-bold text-green-600">{employees.filter(emp => emp.status === 'active' && emp.todayStatus === 'present').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-50">
                    <span className="text-orange-600 text-2xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Late Today</p>
                    <p className="text-2xl font-bold text-orange-600">{employees.filter(emp => emp.status === 'active' && emp.todayStatus === 'late').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-50">
                    <span className="text-red-600 text-2xl">❌</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Absent Today</p>
                    <p className="text-2xl font-bold text-red-600">{employees.filter(emp => emp.status === 'active' && emp.todayStatus === 'absent').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50">
                    <span className="text-blue-600 text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Active Team</p>
                    <p className="text-2xl font-bold text-blue-600">{employees.filter(emp => emp.status === 'active').length}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Manager View - Original Stats
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50">
                    <span className="text-blue-600 text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-50">
                    <span className="text-green-600 text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Active Employees</p>
                    <p className="text-2xl font-bold text-green-600">{employees.filter(emp => emp.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-50">
                    <span className="text-purple-600 text-2xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-50">
                    <span className="text-orange-600 text-2xl">🎆</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search + Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search Field */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search by name, email, or department"
              />
            </div>
            
            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            {/* Status Filter */}
            {userRole === 'manager' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
            
            {/* Sort Option */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </select>
          </div>
        </div>
        {/* Employee List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Employee Directory ({sortedEmployees.length})</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {sortedEmployees.map((employee) => (
              <div key={employee.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{employee.avatar}</span>
                    </div>
                    
                    {/* Employee Info */}
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{employee.name}</h4>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="text-sm text-gray-600">{employee.department} • {employee.position}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {employee.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        {userRole === 'employee' && employee.status === 'active' && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            employee.todayStatus === 'present' ? 'bg-green-100 text-green-800' :
                            employee.todayStatus === 'late' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {employee.todayStatus === 'present' && `✅ Present ${employee.clockIn ? `(${employee.clockIn})` : ''}`}
                            {employee.todayStatus === 'late' && `⚠️ Late ${employee.clockIn ? `(${employee.clockIn})` : ''}`}
                            {employee.todayStatus === 'absent' && '❌ Absent'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewEmployee(employee)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Employee"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {userRole === 'manager' && (
                      <>
                        <button 
                          onClick={() => handleEditEmployee(employee)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(employee)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Employee Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
                    <p className="text-gray-600">Fill in details to add a new employee to the system</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleAddEmployee} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={newEmployee.fullName}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, fullName: e.target.value }))}
                            className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                          <input
                            type="email"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter email address"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <input
                            type="tel"
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                            className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          value={newEmployee.gender}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, gender: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="date"
                            value={newEmployee.dateOfBirth}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Job Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Job Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                          value={newEmployee.department}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position/Role</label>
                        <input
                          type="text"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter position or role"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                          type="text"
                          value={newEmployee.employeeId}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter employee ID"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                        <select
                          value={newEmployee.employmentType}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, employmentType: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="status"
                              value="active"
                              checked={newEmployee.status === 'active'}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, status: e.target.value }))}
                              className="mr-2 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="status"
                              value="inactive"
                              checked={newEmployee.status === 'inactive'}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, status: e.target.value }))}
                              className="mr-2 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">Inactive</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Documents Upload Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Documents Upload</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Profile Photo Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('profilePhoto', e.target.files?.[0] || null)}
                            className="hidden"
                            id="profile-photo"
                          />
                          <label htmlFor="profile-photo" className="cursor-pointer">
                            <div className="text-gray-400 mb-2">
                              <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">Click to upload photo</p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                          </label>
                          {newEmployee.profilePhoto && (
                            <p className="text-sm text-green-600 mt-2">✓ {newEmployee.profilePhoto.name}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Resume Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload('resume', e.target.files?.[0] || null)}
                            className="hidden"
                            id="resume"
                          />
                          <label htmlFor="resume" className="cursor-pointer">
                            <div className="text-gray-400 mb-2">
                              <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">Click to upload resume</p>
                            <p className="text-xs text-gray-400">PDF, DOC up to 5MB</p>
                          </label>
                          {newEmployee.resume && (
                            <p className="text-sm text-green-600 mt-2">✓ {newEmployee.resume.name}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* ID Proof Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('idProof', e.target.files?.[0] || null)}
                            className="hidden"
                            id="id-proof"
                          />
                          <label htmlFor="id-proof" className="cursor-pointer">
                            <div className="text-gray-400 mb-2">
                              <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 112 0v2m-6 4h6m-6 4h6" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">Click to upload ID</p>
                            <p className="text-xs text-gray-400">PDF, JPG up to 2MB</p>
                          </label>
                          {newEmployee.idProof && (
                            <p className="text-sm text-green-600 mt-2">✓ {newEmployee.idProof.name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      Save Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Employee Modal */}
        {showViewModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
                    <p className="text-gray-600">View employee information</p>
                  </div>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Employee Profile */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{selectedEmployee.avatar}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h3>
                      <p className="text-gray-600">{selectedEmployee.position}</p>
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-1 ${
                        selectedEmployee.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedEmployee.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Employee Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{selectedEmployee.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">+1 (555) 123-4567</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Job Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Department</label>
                          <p className="text-gray-900">{selectedEmployee.department}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Join Date</label>
                          <p className="text-gray-900">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                          <p className="text-gray-900">EMP{selectedEmployee.id.toString().padStart(3, '0')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditEmployee(selectedEmployee);
                      }}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      Edit Employee
                    </button>
                    <button 
                      onClick={() => setShowViewModal(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {showEditModal && editEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Employee</h2>
                    <p className="text-gray-600">Update employee information</p>
                  </div>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleUpdateEmployee} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editEmployee.fullName}
                          onChange={(e) => setEditEmployee((prev: any) => ({ ...prev, fullName: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={editEmployee.email}
                          onChange={(e) => setEditEmployee((prev: any) => ({ ...prev, email: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={editEmployee.phone}
                          onChange={(e) => setEditEmployee((prev: any) => ({ ...prev, phone: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Job Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Job Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                          value={editEmployee.department}
                          onChange={(e) => setEditEmployee((prev: any) => ({ ...prev, department: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position/Role</label>
                        <input
                          type="text"
                          value={editEmployee.position}
                          onChange={(e) => setEditEmployee((prev: any) => ({ ...prev, position: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={editEmployee.status}
                          onChange={(e) => setEditEmployee((prev: any) => ({ ...prev, status: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button 
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      Update Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
            <div className="bg-white rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Employee</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete <strong>{selectedEmployee.name}</strong>? 
                    This action cannot be undone.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDeleteEmployee}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}