'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';

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
    id: 'L001', employeeId: 'E123', employeeName: 'John Smith', department: 'Engineering', team: 'Frontend',
    leaveType: 'annual', startDate: '2025-09-15', endDate: '2025-09-17', duration: 3,
    status: 'approved', reason: 'Family vacation', requestedOn: '2025-09-01'
  },
  {
    id: 'L002', employeeId: 'E456', employeeName: 'Sarah Johnson', department: 'Marketing', team: 'Digital',
    leaveType: 'sick', startDate: '2025-09-18', endDate: '2025-09-18', duration: 1,
    status: 'approved', reason: 'Medical appointment', requestedOn: '2025-09-17'
  },
  {
    id: 'L003', employeeId: 'E123', employeeName: 'John Smith', department: 'Engineering', team: 'Backend',
    leaveType: 'vacation', startDate: '2025-09-20', endDate: '2025-09-25', duration: 6,
    status: 'pending', reason: 'Personal travel', requestedOn: '2025-09-10'
  },
  {
    id: 'L004', employeeId: 'E234', employeeName: 'Emma Wilson', department: 'HR', team: 'Recruitment',
    leaveType: 'annual', startDate: '2025-09-22', endDate: '2025-09-24', duration: 3,
    status: 'rejected', reason: 'Team project deadline', requestedOn: '2025-09-05'
  },
  {
    id: 'L005', employeeId: 'E123', employeeName: 'John Smith', department: 'Engineering', team: 'Frontend',
    leaveType: 'unpaid', startDate: '2025-09-28', endDate: '2025-09-30', duration: 3,
    status: 'approved', reason: 'Personal matters', requestedOn: '2025-09-15'
  },
  {
    id: 'L006', employeeId: 'E556', employeeName: 'Mike Johnson', department: 'Sales', team: 'Enterprise',
    leaveType: 'vacation', startDate: '2025-09-10', endDate: '2025-09-12', duration: 3,
    status: 'rejected', reason: 'Team meeting conflict', requestedOn: '2025-09-05'
  },
  {
    id: 'L007', employeeId: 'E123', employeeName: 'John Smith', department: 'Engineering', team: 'Frontend',
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

// Updated leave types and statuses for employee view
const leaveTypes = ['All', 'annual', 'sick', 'unpaid', 'vacation'];
const statuses = ['All', 'pending', 'approved', 'rejected', 'cancelled'];
const departments = ['All', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Design'];

export default function LeaveHistoryPage() {
  const [currentUser, setCurrentUser] = useState<{name: string, role: string} | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Get current user info from localStorage
  useEffect(() => {
    const userName = localStorage.getItem('userName') || 'John Smith'; // Default to John Smith for demo
    const userRole = localStorage.getItem('userRole') || 'employee';
    setCurrentUser({ name: userName, role: userRole });
  }, []);

  // Filter requests based on current user and other filters
  useEffect(() => {
    if (!currentUser) return;

    // Start with all requests
    let result = [...mockLeaveRequests];
    
    // For employees, filter by their own requests only
    if (currentUser.role === 'employee') {
      result = result.filter(request => request.employeeName === currentUser.name);
    }
    
    // Apply department filter (for HR)
    if (selectedDepartment !== 'All') {
      result = result.filter(request => request.department === selectedDepartment);
    }
    
    // Apply leave type filter
    if (selectedLeaveType !== 'All') {
      result = result.filter(request => request.leaveType === selectedLeaveType);
    }
    
    // Apply status filter
    if (selectedStatus !== 'All') {
      result = result.filter(request => request.status === selectedStatus);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(request => 
        request.reason.toLowerCase().includes(term) ||
        request.employeeName.toLowerCase().includes(term) ||
        (currentUser.role === 'manager' && request.employeeId.toLowerCase().includes(term))
      );
    }
    
    // Apply date range filter
    if (startDate) {
      result = result.filter(request => request.startDate >= startDate);
    }
    
    if (endDate) {
      result = result.filter(request => request.endDate <= endDate);
    }
    
    setFilteredRequests(result);
  }, [currentUser, selectedDepartment, selectedLeaveType, selectedStatus, searchTerm, startDate, endDate]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

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

  const resetFilters = () => {
    setSelectedDepartment('All');
    setSelectedLeaveType('All');
    setSelectedStatus('All');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1); // Reset to first page when filters are reset
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentUser.role === 'employee' ? 'My Leave History' : 'Leave History'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentUser.role === 'employee' 
                ? 'View your leave request history' 
                : 'View and filter all employee leave requests'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {currentUser.role === 'employee' ? 'Search by reason' : 'Search by name/reason'}
              </label>
              <input
                type="text"
                placeholder={currentUser.role === 'employee' ? 'Search by reason...' : 'Employee name, ID, or reason...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            {/* Date Range Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            {/* Department Filter (HR only) */}
            {currentUser.role === 'manager' && (
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
            )}
            
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
            
            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Leave History Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {currentUser.role === 'manager' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Requested On</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      {currentUser.role === 'manager' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.employeeName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {request.employeeId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {request.department}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {getLeaveTypeIcon(request.leaveType)}
                          </span>
                          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {request.leaveType} Leave
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {request.duration} {request.duration === 1 ? 'day' : 'days'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {request.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(request.requestedOn).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={currentUser.role === 'manager' ? 8 : 6} className="px-6 py-12 text-center">
                      <div className="text-gray-400 dark:text-gray-500 mb-2">📅</div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No leave history found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {currentUser.role === 'employee' 
                          ? "You haven't submitted any leave requests yet." 
                          : "No leave requests match your filters."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredRequests.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredRequests.length}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}