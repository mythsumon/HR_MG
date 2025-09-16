'use client';

import React from 'react';
import Layout from '@/components/Layout';

export default function LeavePage() {
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [leaveRequest, setLeaveRequest] = React.useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    halfDay: false,
    halfDayPeriod: 'morning'
  });

  const leaveTypes = [
    { value: 'vacation', label: 'Vacation Leave', color: 'blue' },
    { value: 'sick', label: 'Sick Leave', color: 'red' },
    { value: 'personal', label: 'Personal Leave', color: 'green' },
    { value: 'maternity', label: 'Maternity Leave', color: 'purple' },
    { value: 'paternity', label: 'Paternity Leave', color: 'indigo' },
    { value: 'emergency', label: 'Emergency Leave', color: 'orange' }
  ];

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Leave request submitted:', leaveRequest);
    setShowRequestModal(false);
    // Reset form
    setLeaveRequest({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      emergencyContact: '',
      halfDay: false,
      halfDayPeriod: 'morning'
    });
  };

  const calculateLeaveDays = () => {
    if (!leaveRequest.startDate || !leaveRequest.endDate) return 0;
    const start = new Date(leaveRequest.startDate);
    const end = new Date(leaveRequest.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return leaveRequest.halfDay ? 0.5 : daysDiff;
  };
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600">Manage leave requests and balances</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vacation</h3>
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Allocated</span>
                <span className="text-sm font-medium text-gray-900">20 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Used</span>
                <span className="text-sm font-medium text-red-600">8 days</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-gray-900">Remaining</span>
                <span className="text-sm font-bold text-green-600">12 days</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sick Leave</h3>
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Allocated</span>
                <span className="text-sm font-medium text-gray-900">10 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Used</span>
                <span className="text-sm font-medium text-red-600">2 days</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-gray-900">Remaining</span>
                <span className="text-sm font-bold text-green-600">8 days</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal</h3>
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Allocated</span>
                <span className="text-sm font-medium text-gray-900">5 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Used</span>
                <span className="text-sm font-medium text-red-600">1 day</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-gray-900">Remaining</span>
                <span className="text-sm font-bold text-green-600">4 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leave Requests</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-gray-900">Vacation Leave</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Dec 25 - Dec 29, 2024 (5 days)</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowRequestModal(false)}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Request Leave</h2>
                    <p className="text-gray-600">Submit a new leave request</p>
                  </div>
                  <button 
                    onClick={() => setShowRequestModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  {/* Leave Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Leave Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {leaveTypes.map((type) => (
                        <div key={type.value}>
                          <input
                            type="radio"
                            id={type.value}
                            name="leaveType"
                            value={type.value}
                            checked={leaveRequest.leaveType === type.value}
                            onChange={(e) => setLeaveRequest(prev => ({ ...prev, leaveType: e.target.value }))}
                            className="sr-only"
                          />
                          <label
                            htmlFor={type.value}
                            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              leaveRequest.leaveType === type.value
                                ? `border-${type.color}-500 bg-${type.color}-50`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full bg-${type.color}-500 mr-3`}></div>
                            <span className="text-sm font-medium text-gray-900">{type.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Half Day Option */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="halfDay"
                      checked={leaveRequest.halfDay}
                      onChange={(e) => setLeaveRequest(prev => ({ ...prev, halfDay: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="halfDay" className="text-sm font-medium text-gray-700">
                      This is a half day leave
                    </label>
                  </div>
                  
                  {/* Half Day Period */}
                  {leaveRequest.halfDay && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Half Day Period</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="halfDayPeriod"
                            value="morning"
                            checked={leaveRequest.halfDayPeriod === 'morning'}
                            onChange={(e) => setLeaveRequest(prev => ({ ...prev, halfDayPeriod: e.target.value }))}
                            className="mr-2 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Morning (9 AM - 1 PM)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="halfDayPeriod"
                            value="afternoon"
                            checked={leaveRequest.halfDayPeriod === 'afternoon'}
                            onChange={(e) => setLeaveRequest(prev => ({ ...prev, halfDayPeriod: e.target.value }))}
                            className="mr-2 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Afternoon (1 PM - 6 PM)</span>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="date"
                          value={leaveRequest.startDate}
                          onChange={(e) => setLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                          className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="date"
                          value={leaveRequest.endDate}
                          onChange={(e) => setLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                          className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required={!leaveRequest.halfDay}
                          disabled={leaveRequest.halfDay}
                        />
                      </div>
                      {leaveRequest.halfDay && (
                        <p className="text-xs text-gray-500 mt-1">End date not required for half day leave</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Leave Duration Display */}
                  {(leaveRequest.startDate && (leaveRequest.endDate || leaveRequest.halfDay)) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-800">
                          Total Leave Duration: {calculateLeaveDays()} {calculateLeaveDays() === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave</label>
                    <textarea
                      value={leaveRequest.reason}
                      onChange={(e) => setLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                      rows={3}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Please provide a brief reason for your leave request..."
                      required
                    />
                  </div>
                  
                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={leaveRequest.emergencyContact}
                        onChange={(e) => setLeaveRequest(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button 
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      Submit Request
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