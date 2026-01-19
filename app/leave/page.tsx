'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import HRLeaveManagement from './hr-leave-management';
import ManagerLeaveView from './manager-leave-view';
import { mockLeaveRequests } from '@/services/LeaveMockData';
import { Holiday } from '@/services/HolidayMockData';
import { HolidayService } from '@/services/HolidayService';

interface LeaveRequest {
  id: string;
  employee: string;
  employeeId: string;
  department?: string;
  leaveType: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  startDate: string;
  endDate: string;
  duration: number;
  reason?: string;
  requestedOn: string;
  approvedBy?: string;
  approvedByRole?: string;
  approvedOn?: string;
  rejectedBy?: string;
  rejectedByRole?: string;
  rejectedOn?: string;
  rejectionReason?: string;
}

interface CalendarLeave {
  request: LeaveRequest;
  date: string;
}

export default function LeavePage() {
  const [userRole, setUserRole] = useState('employee');
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [holidayService] = useState(() => HolidayService.getInstance());
  const [holidays, setHolidays] = useState<Holiday[]>(holidayService.getAllHolidays());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'employee';
    const name = localStorage.getItem('userName') || '';
    setUserRole(role);
    setUserName(name);
    // Initialize with mock data
    setLeaveRequests(initialLeaveRequests);

    // Subscribe to holiday updates
    const unsubscribe = holidayService.subscribe(() => {
      setHolidays(holidayService.getAllHolidays());
    });

    return unsubscribe;
  }, [holidayService]);

  // Check if user can approve (Manager or Team Lead)
  const canApprove = userRole === 'manager' || userRole === 'team-lead';

  // Mock data for summary cards - Updated to reflect mock data
  const totalEmployees = 25; // Based on mock leave requests data
  const onLeaveToday = leaveRequests.filter(req => {
    const today = new Date().toISOString().split('T')[0];
    return req.status === 'approved' && 
           req.startDate <= today && 
           req.endDate >= today;
  }).length;
  const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const upcomingLeaves = leaveRequests.filter(req => {
    const today = new Date().toISOString().split('T')[0];
    return req.status === 'approved' && req.startDate > today;
  }).length;

  // Use comprehensive mock data from service
  const initialLeaveRequests: LeaveRequest[] = mockLeaveRequests;

  // Leave types summary
  const leaveTypes = [
    { name: 'Annual Leave', remaining: 7, total: 10, color: 'bg-blue-500' },
    { name: 'Sick Leave', remaining: 4, total: 6, color: 'bg-red-500' },
    { name: 'Casual Leave', remaining: 1, total: 3, color: 'bg-orange-500' },
    { name: 'Unpaid Leave', remaining: -1, total: -1, color: 'bg-gray-500' }
  ];

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
    const calendarLeaves: { [key: string]: LeaveRequest[] } = {};
    
    leaveRequests.forEach(request => {
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
    
    // Start from Monday (adjust if first day is not Monday)
    const startDay = new Date(firstDay);
    const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0
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
            approvedByRole: userRole === 'manager' ? 'Manager' : 'Team Lead',
            approvedOn: new Date().toISOString()
          };
        } else {
          return {
            ...req,
            status: 'rejected' as const,
            rejectedBy: userName,
            rejectedByRole: userRole === 'manager' ? 'Manager' : 'Team Lead',
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

  // Show Manager/Admin-only view
  if (userRole === 'manager' || userRole === 'team-lead' || userRole === 'admin') {
    return (
      <Layout>
        <ManagerLeaveView userName={userName} userRole={userRole} />
      </Layout>
    );
  }
  
  // Legacy manager view (keeping for backward compatibility)
  if (userRole === 'manager' || userRole === 'team-lead') {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave</h1>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalEmployees}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{pendingRequests}</p>
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
                </div>
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Calendar - Left Section */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Calendar</h3>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Custom</option>
                    <option>This Month</option>
                    <option>Next Month</option>
                    <option>This Quarter</option>
                  </select>
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
                  const maxVisible = 2;
                  const visibleLeaves = leaves.slice(0, maxVisible);
                  const moreCount = leaves.length - maxVisible;
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg relative ${
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
                      <div className="space-y-1 mb-1">
                        {getHolidaysForDate(date).map((holiday) => (
                          <div
                            key={holiday.id}
                            className="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer bg-blue-600 text-white"
                            title={holiday.name}
                          >
                            <span className="truncate">{holiday.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Leave Indicators */}
                      <div className="space-y-1">
                        {visibleLeaves.map((leave, idx) => (
                          <div
                            key={leave.id}
                            className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer transition-opacity ${
                              getLeaveTypeColor(leave.leaveType)
                            } ${
                              leave.status === 'approved' ? 'opacity-100' : 
                              leave.status === 'rejected' ? 'opacity-40' : 
                              'opacity-80'
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
                      {hoveredDate === dateStr && (leaves.length > 0 || getHolidaysForDate(date).length > 0) && (
                        <div className="absolute z-10 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
                          {/* Holidays Section */}
                          {getHolidaysForDate(date).length > 0 && (
                            <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                              <div className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                                Holiday{getHolidaysForDate(date).length > 1 ? 's' : ''}
                              </div>
                              <div className="space-y-1">
                                {getHolidaysForDate(date).map((holiday) => (
                                  <div key={holiday.id} className="text-xs">
                                    <div className="font-medium text-blue-600 dark:text-blue-400">{holiday.name}</div>
                                    <div className="text-gray-600 dark:text-gray-400">{holiday.type}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Leaves Section */}
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
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 opacity-40"></div>
                    <span className="text-gray-600 dark:text-gray-400">Rejected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leave Types Summary - Right Column */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave Types Summary</h3>
              <div className="space-y-4">
                {leaveTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{type.name}</span>
                    </div>
                    <div className="text-right">
                      {type.remaining === -1 ? (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Unlimited</span>
                      ) : (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {type.remaining} / {type.total} days left
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leave Requests Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {leaveRequests.map((request) => (
                    <tr key={request.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      request.status === 'rejected' ? 'opacity-60' : ''
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{request.employee}</div>
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
                          {request.status === 'approved' && (
                            <button
                              onClick={() => handleView(request)}
                              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
                            >
                              View
                            </button>
                          )}
                          {request.status === 'rejected' && (
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

                {actionType === 'reject' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rejection Reason
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

        {/* View Detail Modal */}
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
      </Layout>
    );
  }

  // Employee view - show employee leave management
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Leave Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Check your leave balances and requests</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">Employee leave management interface</p>
        </div>
      </div>
    </Layout>
  );
}
