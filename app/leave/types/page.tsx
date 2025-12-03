'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';

interface LeaveType {
  id: string;
  name: string;
  description: string;
  defaultDays: number;
  maxDays: number;
  isUnlimited: boolean;
  isActive: boolean;
  color: string;
}

export default function LeaveTypesPage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    {
      id: '1',
      name: 'Annual Leave',
      description: 'Paid time off for vacation and personal use',
      defaultDays: 7,
      maxDays: 30,
      isUnlimited: false,
      isActive: true,
      color: 'blue'
    },
    {
      id: '2',
      name: 'Sick Leave',
      description: 'Paid time off for illness or medical appointments',
      defaultDays: 7,
      maxDays: 15,
      isUnlimited: false,
      isActive: true,
      color: 'red'
    },
    {
      id: '3',
      name: 'Unpaid Leave',
      description: 'Unpaid time off for personal reasons',
      defaultDays: 0,
      maxDays: 0,
      isUnlimited: true,
      isActive: true,
      color: 'gray'
    },
    {
      id: '4',
      name: 'Vacation Leave',
      description: 'Paid time off for vacation',
      defaultDays: 4,
      maxDays: 10,
      isUnlimited: false,
      isActive: true,
      color: 'green'
    }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<'employee' | 'manager'>('employee');
  const [currentLeaveType, setCurrentLeaveType] = useState<LeaveType>({
    id: '',
    name: '',
    description: '',
    defaultDays: 0,
    maxDays: 0,
    isUnlimited: false,
    isActive: true,
    color: 'blue'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Check user role
  useEffect(() => {
    const role = localStorage.getItem('userRole') as 'employee' | 'manager' || 'employee';
    setCurrentUserRole(role);
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setCurrentLeaveType(prev => ({
      ...prev,
      [name]: val
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing leave type
      setLeaveTypes(prev => prev.map(type => 
        type.id === currentLeaveType.id ? currentLeaveType : type
      ));
    } else {
      // Add new leave type
      const newLeaveType = {
        ...currentLeaveType,
        id: Date.now().toString()
      };
      setLeaveTypes(prev => [...prev, newLeaveType]);
    }
    
    setShowModal(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setCurrentLeaveType({
      id: '',
      name: '',
      description: '',
      defaultDays: 0,
      maxDays: 0,
      isUnlimited: false,
      isActive: true,
      color: 'blue'
    });
    setIsEditing(false);
  };

  // Edit leave type
  const handleEdit = (leaveType: LeaveType) => {
    setCurrentLeaveType(leaveType);
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete leave type
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      setLeaveTypes(prev => prev.filter(type => type.id !== id));
    }
  };

  // Toggle active status
  const toggleActiveStatus = (id: string) => {
    setLeaveTypes(prev => prev.map(type => 
      type.id === id ? { ...type, isActive: !type.isActive } : type
    ));
  };

  // Get color class for leave type
  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      case 'pink': return 'bg-pink-500';
      case 'indigo': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  // If not HR manager, show access denied message
  if (currentUserRole !== 'manager') {
    return (
      <Layout>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access this page. Only HR managers can manage leave types.
          </p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </Layout>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(leaveTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaveTypes = leaveTypes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Types Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage leave types and their configurations</p>
          </div>
          <button 
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <span>+</span>
            <span>Add Leave Type</span>
          </button>
        </div>

        {/* Leave Types List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Allocation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedLeaveTypes.map((leaveType) => (
                  <tr key={leaveType.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getColorClass(leaveType.color)} mr-3`}></div>
                        <div className="font-medium text-gray-900 dark:text-white">{leaveType.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">{leaveType.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {leaveType.isUnlimited ? (
                          <span className="font-medium">Unlimited</span>
                        ) : (
                          <>
                            <span className="font-medium">{leaveType.defaultDays}</span> days
                            {leaveType.maxDays > 0 && (
                              <span className="text-gray-500 dark:text-gray-400"> (max {leaveType.maxDays})</span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        leaveType.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {leaveType.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => toggleActiveStatus(leaveType.id)}
                          className={`px-3 py-1 rounded text-xs ${
                            leaveType.isActive
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800'
                              : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                          }`}
                        >
                          {leaveType.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEdit(leaveType)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(leaveType.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {leaveTypes.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={leaveTypes.length}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isEditing ? 'Edit Leave Type' : 'Add New Leave Type'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isEditing ? 'Update leave type details' : 'Create a new leave type'}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentLeaveType.name}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Annual Leave"
                      required
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={currentLeaveType.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of this leave type..."
                    />
                  </div>
                  
                  {/* Unlimited Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isUnlimited"
                      checked={currentLeaveType.isUnlimited}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Unlimited Leave
                    </label>
                  </div>
                  
                  {/* Allocation Fields */}
                  {!currentLeaveType.isUnlimited && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Default Days *
                        </label>
                        <input
                          type="number"
                          name="defaultDays"
                          value={currentLeaveType.defaultDays}
                          onChange={handleInputChange}
                          min="0"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Maximum Days
                        </label>
                        <input
                          type="number"
                          name="maxDays"
                          value={currentLeaveType.maxDays}
                          onChange={handleInputChange}
                          min="0"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'].map((color) => (
                        <div
                          key={color}
                          onClick={() => setCurrentLeaveType(prev => ({ ...prev, color }))}
                          className={`w-full h-8 rounded cursor-pointer flex items-center justify-center ${
                            getColorClass(color)
                          } ${currentLeaveType.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        >
                          {currentLeaveType.color === color && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={currentLeaveType.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </label>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {isEditing ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}