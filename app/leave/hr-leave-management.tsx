'use client';

import React, { useState, useEffect } from 'react';

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
  halfDay?: 'am' | 'pm';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason: string;
  requestedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  team: string;
}

export default function HRLeaveManagement() {
  const [currentView, setCurrentView] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeDrawer, setShowEmployeeDrawer] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [densityMode, setDensityMode] = useState<'comfortable' | 'compact'>('comfortable');
  
  // Add state for leave types
  const [leaveTypes, setLeaveTypes] = useState([
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
    { value: 'vacation', label: 'Vacation Leave' }
  ]);

  // Mock data
  const mockEmployees: Employee[] = [
    { id: 'E123', name: 'John Kim', department: 'Engineering', team: 'Frontend' },
    { id: 'E214', name: 'Sara Lee', department: 'Marketing', team: 'Digital' },
    { id: 'E331', name: 'David Park', department: 'Engineering', team: 'Backend' },
    { id: 'E445', name: 'Lisa Chen', department: 'Design', team: 'UX/UI' },
    { id: 'E556', name: 'Mike Johnson', department: 'Sales', team: 'Enterprise' },
    { id: 'E667', name: 'Emma Wilson', department: 'Engineering', team: 'Frontend' },
    { id: 'E778', name: 'Robert Brown', department: 'Engineering', team: 'Backend' }
  ];

  const mockLeaveRequests: LeaveRequest[] = [
    {
      id: 'L001', employeeId: 'E123', employeeName: 'John Kim', department: 'Engineering', team: 'Frontend',
      leaveType: 'annual', startDate: '2025-09-15', endDate: '2025-09-18', duration: 4, halfDay: 'am',
      status: 'approved', reason: 'Annual leave', requestedOn: '2025-09-01'
    },
    {
      id: 'L002', employeeId: 'E214', employeeName: 'Sara Lee', department: 'Marketing', team: 'Digital',
      leaveType: 'sick', startDate: '2025-09-16', endDate: '2025-09-17', duration: 2,
      status: 'approved', reason: 'Medical appointment', requestedOn: '2025-09-15'
    },
    {
      id: 'L003', employeeId: 'E214', employeeName: 'Sara Lee', department: 'Marketing', team: 'Digital',
      leaveType: 'vacation', startDate: '2025-09-19', endDate: '2025-09-19', duration: 1,
      status: 'pending', reason: 'Vacation', requestedOn: '2025-09-12'
    },
    {
      id: 'L004', employeeId: 'E331', employeeName: 'David Park', department: 'Engineering', team: 'Backend',
      leaveType: 'unpaid', startDate: '2025-09-22', endDate: '2025-09-23', duration: 2,
      status: 'approved', reason: 'Personal matter', requestedOn: '2025-09-20'
    },
    {
      id: 'L005', employeeId: 'E445', employeeName: 'Lisa Chen', department: 'Design', team: 'UX/UI',
      leaveType: 'vacation', startDate: '2025-09-10', endDate: '2025-09-12', duration: 3,
      status: 'rejected', reason: 'Team meeting conflict', requestedOn: '2025-09-05'
    },
    {
      id: 'L006', employeeId: 'E556', employeeName: 'Mike Johnson', department: 'Sales', team: 'Enterprise',
      leaveType: 'annual', startDate: '2025-09-25', endDate: '2025-09-27', duration: 3,
      status: 'pending', reason: 'Family event', requestedOn: '2025-09-22'
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

  // Helper functions
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'annual': return '📅';
      case 'sick': return '🤒';
      case 'unpaid': return '⏸️';
      case 'vacation': return '🌴';
      default: return '📅';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-500 text-white';
      case 'sick': return 'bg-yellow-500 text-white';
      case 'unpaid': return 'bg-gray-500 text-white';
      case 'vacation': return 'bg-teal-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'cancelled': return '🚫';
      default: return '❓';
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getLeaveForEmployeeAndDate = (employeeId: string, date: string) => {
    return mockLeaveRequests.filter(request => 
      request.employeeId === employeeId &&
      request.startDate <= date &&
      request.endDate >= date
    );
  };

  // Helper function to get all days in a month view (including days from previous/next months)
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // First day of the calendar (Sunday of the week that includes the 1st)
    const startDay = new Date(firstDay);
    startDay.setDate(firstDay.getDate() - firstDay.getDay());
    // Last day of the calendar (Saturday of the week that includes the last day)
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

  const filteredEmployees = mockEmployees.filter(employee => {
    if (selectedDepartment !== 'all' && employee.department !== selectedDepartment) return false;
    if (selectedTeam !== 'all' && employee.team !== selectedTeam) return false;
    if (searchTerm && !employee.name.toLowerCase().includes(searchTerm.toLowerCase()) && !employee.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const navigateWeek = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentDate(newDate);
    }
  };

  // Export to CSV function
  const exportToCSV = () => {
    // Create CSV content
    let csvContent = 'Employee ID,Employee Name,Department,Team,Leave Type,Start Date,End Date,Duration,Status,Reason\n';
    
    mockLeaveRequests.forEach(request => {
      const row = [
        request.employeeId,
        request.employeeName,
        request.department,
        request.team,
        request.leaveType,
        request.startDate,
        request.endDate,
        request.duration,
        request.status,
        `"${request.reason.replace(/"/g, '"')}"`
      ].join(',');
      csvContent += row + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leave_requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF function
  const exportToPDF = () => {
    // In a real implementation, this would generate a PDF
    // For now, we'll show an alert and simulate the download
    alert('PDF export functionality would generate a detailed report of all leave requests. In a production environment, this would create a PDF file with formatted data.');
    
    // Simulate PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Leave Requests Report</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Leave Requests Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <table>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
      `);
      
      mockLeaveRequests.forEach(request => {
        printWindow.document.write(`
          <tr>
            <td>${request.employeeName}</td>
            <td>${request.department}</td>
            <td>${request.leaveType}</td>
            <td>${request.startDate} to ${request.endDate}</td>
            <td>${request.duration} days</td>
            <td>${request.status}</td>
            <td>${request.reason}</td>
          </tr>
        `);
      });
      
      printWindow.document.write(`
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

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

  const confirmAction = () => {
    if (!selectedRequest) return;
    
    if (actionType === 'approve') {
      console.log('Approving request:', selectedRequest.id);
      // In real implementation, this would update the database
      // For now, we'll simulate the update
      selectedRequest.status = 'approved';
      selectedRequest.approvedBy = 'HR Manager';
      selectedRequest.approvedOn = new Date().toISOString().split('T')[0];
    } else {
      console.log('Rejecting request:', selectedRequest.id, 'Reason:', rejectionReason);
      // In real implementation, this would update the database
      selectedRequest.status = 'rejected';
      selectedRequest.rejectionReason = rejectionReason;
    }
    
    setShowApprovalModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const handleApproveRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setActionType('approve');
    setShowApprovalModal(true);
  };

  const handleRejectRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setActionType('reject');
    setRejectionReason('');
    setShowApprovalModal(true);
  };

  const weekDates = getWeekDates(currentDate);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  // Get employees on leave today for summary
  const today = formatDate(new Date());
  const employeesOnLeaveToday = mockLeaveRequests.filter(request => 
    request.startDate <= today && request.endDate >= today && request.status === 'approved'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage team leave requests and schedules</p>
        </div>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 font-medium shadow-sm"
        >
          <span>📝</span>
          <span>Request Leave</span>
        </button>
      </div>

      {/* Top Bar Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Department ▾</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
          </select>

          {/* Team Filter */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Team ▾</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Digital">Digital</option>
            <option value="UX/UI">UX/UI</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          {/* Leave Type Filter */}
          <select
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Leave Type ▾</option>
            {leaveTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Status ▾</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentView === 'week'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentView === 'month'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Month
            </button>
          </div>

          {/* Export */}
          <div className="flex space-x-2">
            <button 
              onClick={exportToCSV}
              className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Export CSV
            </button>
            <button 
              onClick={exportToPDF}
              className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Weekly View */}
      {currentView === 'week' && (
        <>
          {/* Week Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Week of {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ◀
                </button>
                <button
                  onClick={() => navigateWeek('today')}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateWeek('next')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>On leave today: {employeesOnLeaveToday.length}</strong>
                {employeesOnLeaveToday.length > 0 && (
                  <span className="ml-2">
                    ({employeesOnLeaveToday.map(req => `${req.employeeName} (${req.leaveType})`).join(', ')})
                  </span>
                )}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {mockLeaveRequests.filter(req => req.status === 'pending').length > 0 && (
                  <span 
                    className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                    onClick={() => {
                      // Filter pending requests and show the first one in the approval modal
                      const pendingRequests = mockLeaveRequests.filter(req => req.status === 'pending');
                      if (pendingRequests.length > 0) {
                        setSelectedRequest(pendingRequests[0]);
                        setActionType('approve');
                        setShowApprovalModal(true);
                      }
                    }}
                  >
                    ⏳ {mockLeaveRequests.filter(req => req.status === 'pending').length} pending approvals
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Weekly Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="sticky left-0 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                      Employee
                    </th>
                    {weekDates.map((date: Date, index: number) => (
                      <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <div>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]} {date.getDate()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="sticky left-0 bg-white dark:bg-gray-800 px-6 py-4 border-r border-gray-200 dark:border-gray-600">
                        <div 
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEmployeeDrawer(true);
                          }}
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.id}
                          </div>
                        </div>
                      </td>
                      {weekDates.map((date: Date, dateIndex: number) => {
                        const dateStr = formatDate(date);
                        const leaves = getLeaveForEmployeeAndDate(employee.id, dateStr);
                        const isWeekendDay = isWeekend(date);
                        
                        return (
                          <td key={dateIndex} className={`px-4 py-4 text-center ${isWeekendDay ? 'bg-gray-50 dark:bg-gray-700' : ''}`}>
                            {isWeekendDay ? (
                              <span className="text-gray-400 text-sm">W</span>
                            ) : leaves.length > 0 ? (
                              <div className="space-y-1">
                                {leaves.map((leave) => (
                                  <div key={leave.id} className="relative group">
                                    <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getLeaveTypeColor(leave.leaveType)}`}>
                                      {getLeaveTypeIcon(leave.leaveType)}
                                      {leave.halfDay && (
                                        <span className="ml-1 text-xs">{leave.halfDay.toUpperCase()}</span>
                                      )}
                                      <span className="ml-1">{getStatusIcon(leave.status)}</span>
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                      {leave.leaveType} - {leave.reason}
                                      <div className="text-xs text-gray-300">
                                        {leave.startDate} to {leave.endDate}
                                      </div>
                                      {leave.status === 'pending' && (
                                        <div className="text-xs text-yellow-300 mt-1">
                                          Click employee name for actions
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">–</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Legend:</strong>
              <span className="ml-4">🌴 Vacation</span>
              <span className="ml-4">🤒 Sick</span>
              <span className="ml-4">📅 Annual</span>
              <span className="ml-4">⏸️ Unpaid</span>
              <span className="ml-4">W Weekend/Closed</span>
              <span className="ml-4">AM/PM = Half-day</span>
              <span className="ml-4">⏳ Pending</span>
              <span className="ml-4">✅ Approved</span>
              <span className="ml-4">❌ Rejected</span>
              <span className="ml-2 text-blue-600 dark:text-blue-400">• Click employee name to approve/reject pending requests</span>
            </div>
          </div>
        </>
      )}

      {/* Monthly View */}
      {currentView === 'month' && (
        <div className="space-y-6">
          {/* Month Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex space-x-2">
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
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Today
                </button>
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
            {/* Density Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setDensityMode('comfortable')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  densityMode === 'comfortable'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Comfortable
              </button>
              <button
                onClick={() => setDensityMode('compact')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  densityMode === 'compact'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Total leave requests this month: {mockLeaveRequests.filter(req => {
                  const reqDate = new Date(req.startDate);
                  return reqDate.getMonth() === currentDate.getMonth() && reqDate.getFullYear() === currentDate.getFullYear();
                }).length}</strong>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {mockLeaveRequests.filter(req => req.status === 'pending').length > 0 && (
                  <span 
                    className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors inline-flex items-center"
                    onClick={() => {
                      // Filter pending requests and show the first one in the approval modal
                      const pendingRequests = mockLeaveRequests.filter(req => req.status === 'pending');
                      if (pendingRequests.length > 0) {
                        setSelectedRequest(pendingRequests[0]);
                        setActionType('approve');
                        setShowApprovalModal(true);
                      }
                    }}
                  >
                    <span className="mr-1">⏳</span>
                    {mockLeaveRequests.filter(req => req.status === 'pending').length} pending approvals
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative p-2">
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="bg-gray-100 dark:bg-gray-700 p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-lg">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getMonthDays(currentDate).map((dayInfo, index) => {
                const { date, isCurrentMonth } = dayInfo;
                const dateStr = formatDate(date);
                const dayLeaves = mockLeaveRequests.filter(request => 
                  request.startDate <= dateStr && request.endDate >= dateStr
                );
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isToday = date.toDateString() === new Date().toDateString();
                const capacityCount = dayLeaves.length;
                
                // Group leaves by employee for conflict detection
                const employeeCount: {[key: string]: number} = {};
                dayLeaves.forEach(leave => {
                  employeeCount[leave.employeeId] = (employeeCount[leave.employeeId] || 0) + 1;
                });
                // Check if any employee has multiple leaves on the same day (which shouldn't happen in real scenario)
                // Or if there are more than 5 leaves on the same day (indicating high capacity)
                const hasConflicts = Object.values(employeeCount).some(count => count > 1) || dayLeaves.length > 5;
                
                return (
                  <div 
                    key={index} 
                    className={`min-h-32 bg-white dark:bg-gray-800 p-2 relative group ${
                      isCurrentMonth ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750' : 'bg-gray-50 dark:bg-gray-900/50 text-gray-400' 
                    } ${isWeekend ? 'bg-gray-50 dark:bg-gray-900/30' : ''} border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm`}
                    onClick={() => {
                      if (isCurrentMonth) {
                        // Navigate to week view of this day
                        setCurrentDate(date);
                        setCurrentView('week');
                      }
                    }}
                  >
                    {/* Top indicators */}
                    <div className="flex justify-between items-start mb-1">
                      {/* Capacity dots or count */}
                      <div className="flex items-center">
                        {capacityCount > 0 && (
                          capacityCount > 3 ? (
                            <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded-full px-1.5 py-0.5">
                              {capacityCount}
                            </span>
                          ) : (
                            <div className="flex space-x-1">
                              {Array.from({ length: capacityCount }).map((_, i) => (
                                <span key={i} className="text-xs w-2 h-2 rounded-full bg-blue-500"></span>
                              ))}
                            </div>
                          )
                        )}
                        {hasConflicts && (
                          <span className="text-xs text-red-500 ml-1" title="High capacity day">⚠</span>
                        )}
                      </div>
                      
                      {/* Date number */}
                      <div className={`text-sm font-medium ${
                        isToday 
                          ? 'w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white shadow' 
                          : isCurrentMonth 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-400'
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                    
                    {/* Leave chips */}
                    <div className="space-y-1 mt-1">
                      {dayLeaves.slice(0, 3).map((leave, idx) => {
                        // Get employee initials
                        const initials = leave.employeeName
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase();
                        
                        // Check if this is a multi-day leave
                        const isMultiDay = leave.startDate !== leave.endDate;
                        const isStartDate = leave.startDate === dateStr;
                        const isEndDate = leave.endDate === dateStr;
                        const isMiddleDate = !isStartDate && !isEndDate && 
                          new Date(leave.startDate) < date && new Date(leave.endDate) > date;
                        
                        // Get leave type color
                        const getLeaveTypeStyle = (type: string, status: string) => {
                          let baseColor = '';
                          let textColor = 'text-white';
                          switch (type) {
                            case 'annual': baseColor = 'bg-blue-500'; break;
                            case 'vacation': baseColor = 'bg-teal-500'; break;
                            case 'sick': baseColor = 'bg-yellow-500'; textColor = 'text-gray-800'; break;
                            case 'unpaid': baseColor = 'bg-gray-500'; break;
                            default: baseColor = 'bg-gray-500';
                          }
                          
                          // Apply status styling
                          if (status === 'pending') {
                            return `${baseColor} opacity-80 ${textColor}`;
                          } else if (status === 'rejected') {
                            return `border border-red-500 ${baseColor} ${textColor}`;
                          }
                          return `${baseColor} ${textColor}`;
                        };
                        
                        const leaveTypeStyle = getLeaveTypeStyle(leave.leaveType, leave.status);
                        const textColor = leaveTypeStyle.includes('text-gray-800') ? 'text-gray-800' : 'text-white';
                        
                        return (
                          <div key={idx} className="group relative">
                            {isMultiDay ? (
                              // Multi-day span visualization
                              <div className="flex items-center w-full">
                                {isStartDate && (
                                  <div className="flex items-center w-full">
                                    <div className={`w-5 h-5 rounded-l-full flex items-center justify-center text-xs font-bold ${leaveTypeStyle}`}>
                                      {initials}
                                    </div>
                                    <div className={`h-1.5 flex-grow ${leaveTypeStyle.split(' ')[0]}`}></div>
                                  </div>
                                )}
                                {isMiddleDate && (
                                  <div className={`h-1.5 w-full ${leaveTypeStyle.split(' ')[0]}`}></div>
                                )}
                                {isEndDate && (
                                  <div className="flex items-center w-full">
                                    <div className={`h-1.5 flex-grow ${leaveTypeStyle.split(' ')[0]}`}></div>
                                    <div className={`w-3 h-3 rounded-r-full ${leaveTypeStyle.split(' ')[0]}`}></div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Single day chip
                              <div 
                                className={`flex items-center text-xs h-5 rounded-full px-2 truncate cursor-pointer ${leaveTypeStyle} ${densityMode === 'compact' ? 'max-w-[70px]' : 'max-w-[110px]'} shadow-sm`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRequest(leave);
                                  setShowApprovalModal(true);
                                }}
                              >
                                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px] font-bold mr-1 text-gray-800">
                                  {initials}
                                </div>
                                {densityMode === 'comfortable' && (
                                  <span className="truncate mr-1">
                                    {leave.employeeName.split(' ')[0]}
                                  </span>
                                )}
                                <span className={`text-[10px] ml-1 ${
                                  leave.leaveType === 'annual' ? 'bg-blue-700' :
                                  leave.leaveType === 'vacation' ? 'bg-teal-700' :
                                  leave.leaveType === 'sick' ? 'bg-yellow-700' :
                                  'bg-gray-700'
                                } px-1 rounded`}>
                                  {leave.leaveType.charAt(0).toUpperCase()}
                                </span>
                                {leave.status === 'pending' && (
                                  <span className="ml-1">⏳</span>
                                )}
                                {leave.status === 'rejected' && (
                                  <span className="ml-1">❌</span>
                                )}
                              </div>
                            )}
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                              <div className="font-medium">{leave.employeeName}</div>
                              <div>{leave.leaveType} · {leave.status}</div>
                              <div>{leave.startDate}–{leave.endDate}</div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Overflow indicator */}
                      {dayLeaves.length > 3 && (
                        <div 
                          className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real implementation, this would open a day detail view
                            console.log(`Show details for ${dateStr}`);
                          }}
                        >
                          +{dayLeaves.length - 3} more
                        </div>
                      )}
                      
                      {/* Empty state hint */}
                      {dayLeaves.length === 0 && isCurrentMonth && (
                        <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity h-6 flex items-center justify-center">
                          View week
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Floating Legend */}
            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 text-xs border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-blue-500 mr-1"></div>
                  <span>Annual</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-teal-500 mr-1"></div>
                  <span>Vacation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-yellow-500 mr-1"></div>
                  <span>Sick</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-gray-500 mr-1"></div>
                  <span>Unpaid</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-gray-500 opacity-50 mr-1"></div>
                  <span>Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Legend:</strong>
              <span className="ml-4">🌴 Vacation</span>
              <span className="ml-4">🤒 Sick</span>
              <span className="ml-4">📅 Annual</span>
              <span className="ml-4">⏸️ Unpaid</span>
              <span className="ml-4">W Weekend/Closed</span>
              <span className="ml-4">⏳ Pending</span>
              <span className="ml-4">✅ Approved</span>
              <span className="ml-4">❌ Rejected</span>
              <span className="ml-2 text-blue-600 dark:text-blue-400">• Click on leave to view details</span>
            </div>
          </div>
        </div>
      )}

      {/* Employee Detail Drawer */}
      {showEmployeeDrawer && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50" onClick={() => setShowEmployeeDrawer(false)}>
          <div className="bg-white dark:bg-gray-800 w-96 h-full overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEmployee.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedEmployee.id} • {selectedEmployee.department}</p>
                </div>
                <button 
                  onClick={() => setShowEmployeeDrawer(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {/* Employee leave requests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Requests</h3>
                {mockLeaveRequests
                  .filter(req => req.employeeId === selectedEmployee.id)
                  .map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getLeaveTypeIcon(request.leaveType)}</span>
                          <span className="font-medium text-gray-900 dark:text-white capitalize">{request.leaveType}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusIcon(request.status)} {request.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div>📅 {request.startDate} to {request.endDate} ({request.duration} days)</div>
                        <div>📝 {request.reason}</div>
                        <div>🕒 Requested on {request.requestedOn}</div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2 mt-3">
                          <button 
                            onClick={() => handleApproveRequest(request)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            ✅ Approve
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(request)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowApprovalModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {actionType === 'approve' ? '✅ Approve' : '❌ Reject'} Leave Request
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {selectedRequest.employeeName} - {selectedRequest.leaveType}
                  </p>
                </div>
                <button 
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {/* Request Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Employee:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedRequest.employeeName} ({selectedRequest.employeeId})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Leave Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedRequest.leaveType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedRequest.startDate} to {selectedRequest.endDate} ({selectedRequest.duration} days)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Reason:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedRequest.reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Requested:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedRequest.requestedOn}</span>
                  </div>
                </div>
              </div>
              
              {/* Rejection Reason */}
              {actionType === 'reject' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Please provide a reason for rejecting this leave request..."
                    required
                  />
                </div>
              )}
              
              {/* Confirmation */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5">⚠️</div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Confirm Action:</strong> Are you sure you want to {actionType} this leave request? 
                    {actionType === 'approve' ? 'This will notify the employee of approval.' : 'This will notify the employee of rejection with the reason provided.'}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedRequest(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  🚫 Cancel
                </button>
                <button 
                  onClick={confirmAction}
                  disabled={actionType === 'reject' && !rejectionReason.trim()}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    actionType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
                  }`}
                >
                  {actionType === 'approve' ? '✅ Approve Request' : '❌ Reject Request'}
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
  );
}