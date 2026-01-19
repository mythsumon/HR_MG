'use client';

import React, { useState, useEffect } from 'react';
import { LeaveRequest } from '@/services/LeaveMockData';
import { Holiday } from '@/services/HolidayMockData';
import { HolidayService } from '@/services/HolidayService';
import { mockLeaveRequests } from '@/services/LeaveMockData';

interface ManagerLeaveViewProps {
  userName: string;
  userRole: string;
}

export default function ManagerLeaveView({ userName, userRole }: ManagerLeaveViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [holidayService] = useState(() => HolidayService.getInstance());
  const [holidays, setHolidays] = useState<Holiday[]>(holidayService.getAllHolidays());
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  
  // Filters
  const [teamFilter, setTeamFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    const unsubscribe = holidayService.subscribe(() => {
      setHolidays(holidayService.getAllHolidays());
    });
    return unsubscribe;
  }, [holidayService]);

  // Check if user can approve (Manager or Team Lead)
  const canApprove = userRole === 'manager' || userRole === 'team-lead' || userRole === 'admin';

  // Operational KPI Calculations
  const today = new Date().toISOString().split('T')[0];
  const onLeaveToday = leaveRequests.filter(req => 
    req.status === 'approved' && 
    req.startDate <= today && 
    req.endDate >= today
  ).length;

  const pendingApprovals = leaveRequests.filter(req => req.status === 'pending').length;

  const upcomingLeaves = leaveRequests.filter(req => {
    const daysDiff = Math.ceil((new Date(req.startDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
    return req.status === 'approved' && daysDiff >= 7 && daysDiff <= 14;
  }).length;

  const totalTeamMembers = 25; // Mock data
  const teamCapacity = totalTeamMembers > 0 
    ? Math.round(((totalTeamMembers - onLeaveToday) / totalTeamMembers) * 100)
    : 100;

  // Calculate Leave Type Summary (approved leaves only)
  const leaveTypeSummary = leaveRequests
    .filter(req => req.status === 'approved')
    .reduce((acc, req) => {
      const type = req.leaveType;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += req.duration;
      return acc;
    }, {} as Record<string, number>);

  // Get totals for each leave type
  const annualLeaveTotal = leaveTypeSummary['Annual Leave'] || 0;
  const sickLeaveTotal = leaveTypeSummary['Sick Leave'] || 0;
  const casualLeaveTotal = leaveTypeSummary['Casual Leave'] || 0;
  const unpaidLeaveTotal = leaveTypeSummary['Unpaid Leave'] || 0;

  // Get all dates for a leave request
  const getDatesForRequest = (request: LeaveRequest): string[] => {
    const dates: string[] = [];
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const current = new Date(start);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  // Get all calendar leaves grouped by date
  const getCalendarLeaves = (): { [key: string]: LeaveRequest[] } => {
    const calendarLeaves: { [key: string]: LeaveRequest[] } = [];
    
    // Apply filters
    let filteredRequests = leaveRequests;
    
    if (departmentFilter !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.department === departmentFilter);
    }
    
    if (statusFilter !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.status === statusFilter);
    }
    
    filteredRequests.forEach(request => {
      const dates = getDatesForRequest(request);
      dates.forEach(date => {
        if (!calendarLeaves[date]) {
          calendarLeaves[date] = [];
        }
        calendarLeaves[date].push(request);
      });
    });
    
    return calendarLeaves;
  };

  // Get calendar days for current month (Monday start)
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDay = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDay.setDate(firstDay.getDate() - daysToSubtract);
    
    const endDay = new Date(lastDay);
    const endDayOfWeek = lastDay.getDay();
    const daysToAdd = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
    endDay.setDate(lastDay.getDate() + daysToAdd);
    
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getLeaveTypeColor = (leaveType: string) => {
    switch (leaveType) {
      case 'Annual Leave': return 'bg-blue-500';
      case 'Sick Leave': return 'bg-red-500';
      case 'Casual Leave': return 'bg-orange-500';
      case 'Unpaid Leave': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const handleApprove = (request: LeaveRequest) => {
    if (!canApprove) {
      alert('You do not have permission to approve leave requests.');
      return;
    }
    setSelectedRequest(request);
    setActionType('approve');
    setShowApprovalModal(true);
  };

  const handleReject = (request: LeaveRequest) => {
    if (!canApprove) {
      alert('You do not have permission to reject leave requests.');
      return;
    }
    setSelectedRequest(request);
    setActionType('reject');
    setRejectionReason('');
    setShowApprovalModal(true);
  };

  const handleView = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const confirmAction = () => {
    if (!selectedRequest || !canApprove) return;

    const updatedRequests = leaveRequests.map(req => {
      if (req.id === selectedRequest.id) {
        if (actionType === 'approve') {
          return {
            ...req,
            status: 'approved' as const,
            approvedBy: userName,
            approvedByRole: userRole === 'manager' ? 'Manager' : userRole === 'team-lead' ? 'Team Lead' : 'Admin',
            approvedOn: new Date().toISOString()
          };
        } else {
          return {
            ...req,
            status: 'rejected' as const,
            rejectedBy: userName,
            rejectedByRole: userRole === 'manager' ? 'Manager' : userRole === 'team-lead' ? 'Team Lead' : 'Admin',
            rejectedOn: new Date().toISOString(),
            rejectionReason: rejectionReason
          };
        }
      }
      return req;
    });

    setLeaveRequests(updatedRequests);
    setShowApprovalModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const calendarLeaves = getCalendarLeaves();

  // Get holidays for a specific date
  const getHolidaysForDate = (date: Date): Holiday[] => {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.filter(h => h.date === dateStr);
  };

  // Get leaves for a specific date
  const getLeavesForDate = (date: Date): LeaveRequest[] => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarLeaves[dateStr] || [];
  };

  // Get unique departments from leave requests
  const departments = Array.from(new Set(leaveRequests.map(req => req.department).filter((dept): dept is string => Boolean(dept))));

  // Filter leave requests for table
  const filteredTableRequests = leaveRequests.filter(req => {
    const matchesDepartment = departmentFilter === 'all' || req.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesDepartment && matchesStatus;
  }).sort((a, b) => {
    // Sort by date, then by status (pending first)
    if (a.startDate !== b.startDate) {
      return a.startDate.localeCompare(b.startDate);
    }
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Review and approve team leave requests
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Filter Dropdowns */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="next-month">Next Month</option>
          </select>
        </div>
      </div>

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On Leave Today</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{onLeaveToday}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{pendingApprovals}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Leaves</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{upcomingLeaves}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">7-14 days ahead</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Capacity</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{teamCapacity}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available today</p>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Type Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave Type Summary</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Total approved leave days by type</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Annual Leave</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{annualLeaveTotal}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">days approved</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Sick Leave</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sickLeaveTotal}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">days approved</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Casual Leave</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{casualLeaveTotal}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">days approved</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Unpaid Leave</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{unpaidLeaveTotal}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">days approved</p>
          </div>
        </div>
      </div>

      {/* Calendar - Primary Decision Surface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Leave Calendar</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(currentDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Today
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(currentDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Header - Monday to Sunday */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {getMonthDays(currentDate).map((dayInfo, index) => {
            const { date, isCurrentMonth } = dayInfo;
            const isToday = date.toDateString() === new Date().toDateString();
            const dateStr = date.toISOString().split('T')[0];
            const leaves = getLeavesForDate(date);
            const dateHolidays = getHolidaysForDate(date);
            const maxVisible = 2;
            const visibleLeaves = leaves.slice(0, maxVisible);
            const moreCount = leaves.length - maxVisible;
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border rounded-lg relative ${
                  isCurrentMonth
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'
                } ${
                  isToday ? 'ring-2 ring-blue-500' : ''
                }`}
                onMouseEnter={() => setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${
                    isCurrentMonth
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-400 dark:text-gray-600'
                  } ${
                    isToday ? 'font-bold' : ''
                  }`}>
                    {date.getDate()}
                  </span>
                </div>
                
                {/* Holiday Indicators (Priority - Top) */}
                {dateHolidays.length > 0 && (
                  <div className="space-y-1 mb-1">
                    {dateHolidays.map((holiday) => (
                      <div
                        key={holiday.id}
                        className="text-xs px-1.5 py-0.5 rounded truncate bg-blue-600 text-white"
                        title={holiday.name}
                      >
                        <span className="truncate">{holiday.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Leave Indicators */}
                <div className="space-y-1">
                  {visibleLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer transition-opacity ${
                        getLeaveTypeColor(leave.leaveType)
                      } ${
                        leave.status === 'approved' ? 'opacity-100' : 
                        leave.status === 'rejected' ? 'opacity-40' : 
                        'opacity-80 border-2 border-dashed'
                      } text-white`}
                      onClick={() => handleView(leave)}
                      title={`${leave.employee} - ${leave.leaveType} (${leave.status})`}
                    >
                      <div className="flex items-center space-x-1">
                        {leave.status === 'approved' && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="truncate">{leave.employee}</span>
                      </div>
                    </div>
                  ))}
                  {moreCount > 0 && (
                    <div className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
                      +{moreCount} more
                    </div>
                  )}
                </div>

                {/* Hover Tooltip */}
                {hoveredDate === dateStr && (leaves.length > 0 || dateHolidays.length > 0) && (
                  <div className="absolute z-10 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
                    {dateHolidays.length > 0 && (
                      <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                          Holiday{dateHolidays.length > 1 ? 's' : ''}
                        </div>
                        <div className="space-y-1">
                          {dateHolidays.map((holiday) => (
                            <div key={holiday.id} className="text-xs">
                              <div className="font-medium text-blue-600 dark:text-blue-400">{holiday.name}</div>
                              <div className="text-gray-600 dark:text-gray-400">{holiday.type}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {leaves.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                          {leaves.length} leave{leaves.length > 1 ? 's' : ''} on this date
                        </div>
                        <div className="space-y-1">
                          {leaves.map((leave) => (
                            <div key={leave.id} className="text-xs">
                              <div className="font-medium text-gray-900 dark:text-white">{leave.employee}</div>
                              <div className="text-gray-600 dark:text-gray-400">{leave.leaveType}</div>
                              <div className="mt-0.5">{getStatusBadge(leave.status)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-gray-600 dark:text-gray-400">Holiday</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 border-2 border-dashed"></div>
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500 opacity-40"></div>
              <span className="text-gray-600 dark:text-gray-400">Rejected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table - Action-Oriented */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTableRequests.map((request) => (
                <tr key={request.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  request.status === 'rejected' ? 'opacity-60' : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{request.employee}</div>
                    {request.department && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{request.department}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{request.leaveType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {request.startDate !== request.endDate && (
                        <> - {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{request.duration} day{request.duration !== 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {request.status === 'pending' && canApprove && (
                        <>
                          <button
                            onClick={() => handleApprove(request)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(request.status === 'approved' || request.status === 'rejected') && (
                        <button
                          onClick={() => handleView(request)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval/Rejection Confirmation Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowApprovalModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedRequest.employee} - {selectedRequest.leaveType}
                  </p>
                </div>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date Range:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedRequest.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                    {new Date(selectedRequest.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedRequest.duration} days</span>
                </div>
                {selectedRequest.reason && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reason:</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.reason}</p>
                  </div>
                )}
              </div>

              {actionType === 'reject' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Please provide a reason for rejection..."
                    required
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    actionType === 'approve'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  disabled={actionType === 'reject' && !rejectionReason}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Details</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedRequest.employee}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Leave Type</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedRequest.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {new Date(selectedRequest.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {new Date(selectedRequest.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedRequest.duration} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Requested On</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedRequest.requestedOn ? new Date(selectedRequest.requestedOn).toLocaleString('en-US') : 'N/A'}
                    </p>
                  </div>
                </div>
                
                {selectedRequest.status === 'approved' && selectedRequest.approvedBy && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">Approval Information</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Approved by {selectedRequest.approvedBy} ({selectedRequest.approvedByRole})
                    </p>
                    {selectedRequest.approvedOn && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {new Date(selectedRequest.approvedOn).toLocaleString('en-US')}
                      </p>
                    )}
                  </div>
                )}
                
                {selectedRequest.status === 'rejected' && selectedRequest.rejectedBy && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">Rejection Information</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Rejected by {selectedRequest.rejectedBy} ({selectedRequest.rejectedByRole})
                    </p>
                    {selectedRequest.rejectedOn && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {new Date(selectedRequest.rejectedOn).toLocaleString('en-US')}
                      </p>
                    )}
                    {selectedRequest.rejectionReason && (
                      <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                        Reason: {selectedRequest.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
                
                {selectedRequest.reason && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Reason</p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.reason}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

