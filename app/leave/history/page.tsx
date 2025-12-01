'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  team: string;
  leaveType: 'annual' | 'sick' | 'unpaid' | 'vacation';
  startDate: string;
  endDate: string;
  duration: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason: string;
  requestedOn: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'L001', employeeId: 'E123', employeeName: 'John Kim', department: 'Engineering', team: 'Frontend',
    leaveType: 'annual', startDate: '2025-09-15', endDate: '2025-09-17', duration: 3,
    status: 'approved', reason: 'Family vacation', requestedOn: '2025-09-01'
  },
  {
    id: 'L002', employeeId: 'E456', employeeName: 'Sarah Johnson', department: 'Marketing', team: 'Digital',
    leaveType: 'sick', startDate: '2025-09-18', endDate: '2025-09-18', duration: 1,
    status: 'approved', reason: 'Medical appointment', requestedOn: '2025-09-17'
  },
  {
    id: 'L003', employeeId: 'E789', employeeName: 'Michael Chen', department: 'Engineering', team: 'Backend',
    leaveType: 'vacation', startDate: '2025-09-20', endDate: '2025-09-25', duration: 6,
    status: 'pending', reason: 'Personal travel', requestedOn: '2025-09-10'
  },
  {
    id: 'L004', employeeId: 'E234', employeeName: 'Emma Wilson', department: 'HR', team: 'Recruitment',
    leaveType: 'annual', startDate: '2025-09-22', endDate: '2025-09-24', duration: 3,
    status: 'rejected', reason: 'Team project deadline', requestedOn: '2025-09-05'
  },
  {
    id: 'L005', employeeId: 'E345', employeeName: 'David Brown', department: 'Finance', team: 'Accounting',
    leaveType: 'unpaid', startDate: '2025-09-28', endDate: '2025-09-30', duration: 3,
    status: 'approved', reason: 'Personal matters', requestedOn: '2025-09-15'
  },
  {
    id: 'L006', employeeId: 'E556', employeeName: 'Mike Johnson', department: 'Sales', team: 'Enterprise',
    leaveType: 'vacation', startDate: '2025-09-10', endDate: '2025-09-12', duration: 3,
    status: 'rejected', reason: 'Team meeting conflict', requestedOn: '2025-09-05'
  },
  {
    id: 'L007', employeeId: 'E123', employeeName: 'John Kim', department: 'Engineering', team: 'Frontend',
    leaveType: 'sick', startDate: '2025-10-17', endDate: '2025-10-18', duration: 2,
    status: 'approved', reason: 'Medical checkup', requestedOn: '2025-10-15'
  },
  {
    id: 'L008', employeeId: 'E667', employeeName: 'Emma Wilson', department: 'Engineering', team: 'Frontend',
    leaveType: 'annual', startDate: '2025-10-17', endDate: '2025-10-19', duration: 3,
    status: 'approved', reason: 'Annual leave', requestedOn: '2025-10-10'
  },
  {
    id: 'L009', employeeId: 'E778', employeeName: 'Robert Brown', department: 'Engineering', team: 'Backend',
    leaveType: 'vacation', startDate: '2025-10-17', endDate: '2025-10-17', duration: 1,
    status: 'pending', reason: 'Personal vacation', requestedOn: '2025-10-14'
  }
];

const departments = ['All', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales'];
const leaveTypes = ['All', 'annual', 'sick', 'unpaid', 'vacation'];
const statuses = ['All', 'pending', 'approved', 'rejected', 'cancelled'];

export default function LeaveHistoryPage() {
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLeaveType, setSelectedLeaveType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let result = [...mockLeaveRequests];
    
    if (selectedDepartment !== 'All') {
      result = result.filter(request => request.department === selectedDepartment);
    }
    
    if (selectedLeaveType !== 'All') {
      result = result.filter(request => request.leaveType === selectedLeaveType);
    }
    
    if (selectedStatus !== 'All') {
      result = result.filter(request => request.status === selectedStatus);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(request => 
        request.employeeName.toLowerCase().includes(term) ||
        request.employeeId.toLowerCase().includes(term) ||
        request.reason.toLowerCase().includes(term)
      );
    }
    
    setFilteredRequests(result);
  }, [selectedDepartment, selectedLeaveType, selectedStatus, searchTerm]);

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'annual': return '📅';
      case 'sick': return '🤒';
      case 'unpaid': return '⏸️';
      case 'vacation': return '🌴';
      default: return '📅';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'rejected':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Cancelled</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave History</h1>
            <p className="text-gray-600 dark:text-gray-400">View and filter all employee leave requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Employee name, ID, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {/* Leave Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Type</label>
              <select
                value={selectedLeaveType}
                onChange={(e) => setSelectedLeaveType(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">{filteredRequests.length}</span> of <span className="font-medium">{mockLeaveRequests.length}</span> leave requests
          </p>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Requested On</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No leave requests match the selected filters
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {leave.employeeName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{leave.employeeName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{leave.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {leave.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {getLeaveTypeIcon(leave.leaveType)}
                          </span>
                          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{leave.leaveType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {leave.duration} {leave.duration === 1 ? 'day' : 'days'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {leave.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(leave.requestedOn).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}