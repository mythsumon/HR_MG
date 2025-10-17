'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import HRLeaveManagement from './hr-leave-management';

export default function LeavePage() {
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [leaveRequest, setLeaveRequest] = React.useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [userRole, setUserRole] = useState('employee');

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
    { value: 'vacation', label: 'Vacation Leave' }
  ];

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'employee';
    setUserRole(role);
  }, []);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Leave request submitted:', leaveRequest);
    setShowRequestModal(false);
    // Reset form
    setLeaveRequest({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  // Show HR management view for managers
  if (userRole === 'manager') {
    return (
      <Layout>
        <HRLeaveManagement />
      </Layout>
    );
  }
  // Employee view
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Leave Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Check your leave balances and requests</p>
          </div>
          <button 
            onClick={() => setShowRequestModal(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 font-medium shadow-sm"
          >
            <span>📝</span>
            <span>Request Leave</span>
          </button>
        </div>

        {/* Leave Balances */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Annual Leave</h3>
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Allocated</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">7 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                <span className="text-sm font-medium text-red-600">0 days</span>
              </div>
              <div className="flex justify-between border-t pt-2 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Remaining</span>
                <span className="text-sm font-bold text-green-600">7 days</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sick Leave</h3>
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Allocated</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">7 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                <span className="text-sm font-medium text-red-600">0 days</span>
              </div>
              <div className="flex justify-between border-t pt-2 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Remaining</span>
                <span className="text-sm font-bold text-green-600">7 days</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unpaid Leave</h3>
              <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Allocated</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Unlimited</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                <span className="text-sm font-medium text-red-600">0 days</span>
              </div>
              <div className="flex justify-between border-t pt-2 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Remaining</span>
                <span className="text-sm font-bold text-green-600">Unlimited</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vacation Leave</h3>
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Allocated</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">3-4 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                <span className="text-sm font-medium text-red-600">0 days</span>
              </div>
              <div className="flex justify-between border-t pt-2 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Remaining</span>
                <span className="text-sm font-bold text-green-600">3-4 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leave Requests</h3>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 dark:text-white">Annual Leave</span>
                  <span className="text-gray-500 dark:text-gray-400">|</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Dec 25 – Dec 29 (5 days)</span>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                ✅ Approved
              </span>
            </div>
            
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 dark:text-white">Sick Leave</span>
                  <span className="text-gray-500 dark:text-gray-400">|</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Nov 15 – Nov 16 (2 days)</span>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                🕰️ Pending
              </span>
            </div>
            
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 dark:text-white">Vacation Leave</span>
                  <span className="text-gray-500 dark:text-gray-400">|</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Oct 22 (1 day)</span>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                ❌ Rejected
              </span>
            </div>
          </div>
        </div>

        {/* Leave Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowRequestModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request Leave</h2>
                    <p className="text-gray-600 dark:text-gray-400">Submit a new leave request</p>
                  </div>
                  <button 
                    onClick={() => setShowRequestModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  {/* Leave Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leave Type</label>
                    <select
                      value={leaveRequest.leaveType}
                      onChange={(e) => setLeaveRequest(prev => ({ ...prev, leaveType: e.target.value }))}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select leave type</option>
                      {leaveTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
                      <input
                        type="date"
                        value={leaveRequest.startDate}
                        onChange={(e) => setLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                      <input
                        type="date"
                        value={leaveRequest.endDate}
                        onChange={(e) => setLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason (Optional)</label>
                    <textarea
                      value={leaveRequest.reason}
                      onChange={(e) => setLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                      rows={3}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Please provide a brief reason for your leave request..."
                    />
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      Submit
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