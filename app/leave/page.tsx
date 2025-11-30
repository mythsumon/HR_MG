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
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    timeOption: 'all_day', // 'all_day', 'specific_time'
    reason: ''
  });
  const [userRole, setUserRole] = useState('employee');
  const [showLeaveDetailModal, setShowLeaveDetailModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
    { value: 'vacation', label: 'Vacation Leave' }
  ];

  // Sample leave data for calendar
  const sampleLeaves = [
    { id: 1, type: 'annual', label: 'Annual Leave', startDate: '2024-12-25', endDate: '2024-12-29', duration: 5, status: 'approved', reason: 'Family vacation during holidays' },
    { id: 2, type: 'sick', label: 'Sick Leave', startDate: '2024-11-15', endDate: '2024-11-16', duration: 2, status: 'pending', reason: 'Medical appointment' },
    { id: 3, type: 'vacation', label: 'Vacation Leave', startDate: '2024-10-22', endDate: '2024-10-22', duration: 1, status: 'rejected', reason: 'Personal day', rejectionReason: 'Team capacity issue' },
    { id: 4, type: 'annual', label: 'Annual Leave', startDate: '2024-11-01', endDate: '2024-11-03', duration: 3, status: 'approved', reason: 'Extended weekend trip' },
    { id: 5, type: 'sick', label: 'Sick Leave', startDate: '2024-10-31', endDate: '2024-10-31', duration: 1, status: 'approved', reason: 'Flu symptoms' }
  ];

  // Get calendar days for current month
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = new Date(firstDay);
    startDay.setDate(firstDay.getDate() - firstDay.getDay());
    const endDay = new Date(lastDay);
    endDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDay = new Date(startDay);
    
    while (currentDay <= endDay) {
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Get leaves for a specific date
  const getLeavesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sampleLeaves.filter(leave => 
      leave.startDate <= dateStr && leave.endDate >= dateStr
    );
  };

  // Get leave type color
  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-500';
      case 'sick': return 'bg-yellow-500';
      case 'unpaid': return 'bg-gray-500';
      case 'vacation': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">✅ Approved</span>;
      case 'pending': return <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">⏳ Pending</span>;
      case 'rejected': return <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">❌ Rejected</span>;
      default: return null;
    }
  };

  const handleLeaveClick = (leave: any) => {
    setSelectedLeave(leave);
    setShowLeaveDetailModal(true);
  };

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
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      timeOption: 'all_day',
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

        {/* Leave Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📅 My Leave Calendar</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(currentDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ◀
              </button>
              <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[120px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(currentDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-100 dark:bg-gray-700 p-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-lg">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getMonthDays(currentDate).map((dayInfo, index) => {
              const { date, isCurrentMonth } = dayInfo;
              const dayLeaves = getLeavesForDate(date);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border rounded-lg ${
                    isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'
                  } ${
                    isWeekend ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                  } ${
                    isToday ? 'ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'
                        : isCurrentMonth
                          ? 'text-gray-900 dark:text-white font-medium'
                          : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </span>
                  </div>
                  
                  {/* Leave labels */}
                  <div className="space-y-1">
                    {dayLeaves.map((leave) => {
                      const isStartDate = leave.startDate === date.toISOString().split('T')[0];
                      const isEndDate = leave.endDate === date.toISOString().split('T')[0];
                      const isMiddle = !isStartDate && !isEndDate;
                      
                      return (
                        <div
                          key={leave.id}
                          onClick={() => handleLeaveClick(leave)}
                          className={`text-xs px-2 py-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity ${
                            getLeaveTypeColor(leave.type)
                          } ${
                            leave.status === 'pending' ? 'opacity-70 border border-yellow-300' : ''
                          } ${
                            leave.status === 'rejected' ? 'opacity-50 line-through' : ''
                          }`}
                          title={`Click to view details`}
                        >
                          {isStartDate ? '🏁 ' : isEndDate ? '🏁 ' : ''}
                          {leave.label.split(' ')[0]}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>Annual Leave</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span>Sick Leave</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Vacation Leave</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-gray-500"></div>
              <span>Unpaid Leave</span>
            </div>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leave Requests</h3>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sampleLeaves.map((leave) => (
              <div key={leave.id} className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => handleLeaveClick(leave)}>
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900 dark:text-white">{leave.label}</span>
                    <span className="text-gray-500 dark:text-gray-400">|</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({leave.duration} {leave.duration === 1 ? 'day' : 'days'})
                    </span>
                  </div>
                </div>
                {getStatusBadge(leave.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Leave Detail Modal */}
        {showLeaveDetailModal && selectedLeave && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowLeaveDetailModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Details</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedLeave.label}</p>
                  </div>
                  <button 
                    onClick={() => setShowLeaveDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Leave Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Leave Type:</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getLeaveTypeColor(selectedLeave.type)}`}></div>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedLeave.label}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                        {getStatusBadge(selectedLeave.status)}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Start Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedLeave.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">End Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedLeave.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedLeave.duration} {selectedLeave.duration === 1 ? 'day' : 'days'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason:</label>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-gray-900 dark:text-white">{selectedLeave.reason}</p>
                    </div>
                  </div>
                  
                  {/* Rejection Reason if rejected */}
                  {selectedLeave.status === 'rejected' && selectedLeave.rejectionReason && (
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">Rejection Reason:</label>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-sm text-red-900 dark:text-red-100">{selectedLeave.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Action button for pending leaves */}
                  {selectedLeave.status === 'pending' && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        ⏳ This leave request is pending approval. You will be notified once it's reviewed.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Close Button */}
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => setShowLeaveDetailModal(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={leaveRequest.startDate}
                        onChange={(e) => setLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                      <input
                        type="date"
                        value={leaveRequest.endDate}
                        onChange={(e) => setLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Time Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Options</label>
                    <div className="space-y-3">
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="timeOption"
                            checked={leaveRequest.timeOption === 'all_day'}
                            onChange={() => setLeaveRequest(prev => ({ ...prev, timeOption: 'all_day' }))}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">All Day</span>
                        </label>
                      </div>
                      
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="timeOption"
                            checked={leaveRequest.timeOption === 'specific_time'}
                            onChange={() => setLeaveRequest(prev => ({ ...prev, timeOption: 'specific_time' }))}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">Specific Time</span>
                        </label>
                      </div>
                      
                      {leaveRequest.timeOption === 'specific_time' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 mt-2">
                          <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                            <div className="flex space-x-2">
                              <select
                                value={leaveRequest.startTime.split(' ')[0].split(':')[0] || '09'}
                                onChange={(e) => {
                                  const minutes = leaveRequest.startTime.split(' ')[0].split(':')[1] || '00';
                                  const period = leaveRequest.startTime.split(' ')[1] || 'AM';
                                  setLeaveRequest(prev => ({ ...prev, startTime: `${e.target.value}:${minutes} ${period}` }));
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                              >
                                {[...Array(12)].map((_, i) => {
                                  const hour = i === 0 ? 12 : i;
                                  return <option key={i} value={hour.toString().padStart(2, '0')}>{hour}</option>;
                                })}
                              </select>
                              <span className="self-center">:</span>
                              <select
                                value={leaveRequest.startTime.split(' ')[0].split(':')[1] || '00'}
                                onChange={(e) => {
                                  const hours = leaveRequest.startTime.split(' ')[0].split(':')[0] || '09';
                                  const period = leaveRequest.startTime.split(' ')[1] || 'AM';
                                  setLeaveRequest(prev => ({ ...prev, startTime: `${hours}:${e.target.value} ${period}` }));
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                              >
                                {[0, 15, 30, 45].map(minute => (
                                  <option key={minute} value={minute.toString().padStart(2, '0')}>{minute.toString().padStart(2, '0')}</option>
                                ))}
                              </select>
                              <select
                                value={leaveRequest.startTime.split(' ')[1] || 'AM'}
                                onChange={(e) => {
                                  const timePart = leaveRequest.startTime.split(' ')[0];
                                  setLeaveRequest(prev => ({ ...prev, startTime: `${timePart} ${e.target.value}` }));
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                            <div className="flex space-x-2">
                              <select
                                value={leaveRequest.endTime.split(' ')[0].split(':')[0] || '05'}
                                onChange={(e) => {
                                  const minutes = leaveRequest.endTime.split(' ')[0].split(':')[1] || '00';
                                  const period = leaveRequest.endTime.split(' ')[1] || 'PM';
                                  setLeaveRequest(prev => ({ ...prev, endTime: `${e.target.value}:${minutes} ${period}` }));
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                              >
                                {[...Array(12)].map((_, i) => {
                                  const hour = i === 0 ? 12 : i;
                                  return <option key={i} value={hour.toString().padStart(2, '0')}>{hour}</option>;
                                })}
                              </select>
                              <span className="self-center">:</span>
                              <select
                                value={leaveRequest.endTime.split(' ')[0].split(':')[1] || '00'}
                                onChange={(e) => {
                                  const hours = leaveRequest.endTime.split(' ')[0].split(':')[0] || '05';
                                  const period = leaveRequest.endTime.split(' ')[1] || 'PM';
                                  setLeaveRequest(prev => ({ ...prev, endTime: `${hours}:${e.target.value} ${period}` }));
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                              >
                                {[0, 15, 30, 45].map(minute => (
                                  <option key={minute} value={minute.toString().padStart(2, '0')}>{minute.toString().padStart(2, '0')}</option>
                                ))}
                              </select>
                              <select
                                value={leaveRequest.endTime.split(' ')[1] || 'PM'}
                                onChange={(e) => {
                                  const timePart = leaveRequest.endTime.split(' ')[0];
                                  setLeaveRequest(prev => ({ ...prev, endTime: `${timePart} ${e.target.value}` }));
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
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