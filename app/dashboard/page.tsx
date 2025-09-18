'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

// Types for attendance data
interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'leave' | 'today' | 'weekend' | 'no-record' | 'late';
  clockIn?: string;
  clockOut?: string;
  workingHours?: string;
  location?: 'office' | 'remote' | 'client-site';
  gpsLocation?: string;
  notes?: string;
  overtimeHours?: number;
  isHalfDay?: boolean;
  hasMissingPunch?: boolean;
  workTimeline?: {
    expectedStart: string;
    expectedEnd: string;
    actualStart?: string;
    actualEnd?: string;
  };
}

interface TodayAttendance {
  clockInTime: string | null;
  clockOutTime: string | null;
  isClocked: boolean;
  status: 'present' | 'absent' | 'late';
  workingHours: string;
  location: string;
}

interface AttendanceSummary {
  present: number;
  late: number;
  absent: number;
  leave: number;
  overtimeHours: number;
  workingDays: number;
}

// Dynamic Attendance Service
class AttendanceService {
  private static instance: AttendanceService;
  private attendanceData: { [key: string]: AttendanceRecord } = {};
  private todayData: TodayAttendance;
  private listeners: (() => void)[] = [];

  private constructor() {
    this.initializeData();
    this.todayData = this.initializeTodayData();
  }

  static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService();
    }
    return AttendanceService.instance;
  }

  private initializeData() {
    // Initialize with enhanced sample data
    this.attendanceData = {
      '2024-09-01': { 
        date: '2024-09-01', 
        status: 'present', 
        clockIn: '09:00', 
        clockOut: '18:00', 
        workingHours: '8h 30m', 
        location: 'office',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '09:00', actualEnd: '18:00' }
      },
      '2024-09-02': { 
        date: '2024-09-02', 
        status: 'late', 
        clockIn: '09:15', 
        clockOut: '18:15', 
        workingHours: '8h 30m', 
        location: 'office',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '09:15', actualEnd: '18:15' }
      },
      '2024-09-03': { 
        date: '2024-09-03', 
        status: 'absent', 
        notes: 'Sick leave' 
      },
      '2024-09-04': { 
        date: '2024-09-04', 
        status: 'present', 
        clockIn: '08:45', 
        clockOut: '17:45', 
        workingHours: '8h 30m', 
        location: 'office',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '08:45', actualEnd: '17:45' }
      },
      '2024-09-05': { 
        date: '2024-09-05', 
        status: 'leave', 
        isHalfDay: true,
        notes: 'Annual leave - Half day' 
      },
      '2024-09-06': { 
        date: '2024-09-06', 
        status: 'present', 
        clockIn: '09:00', 
        clockOut: '20:00', 
        workingHours: '10h 30m', 
        location: 'office',
        overtimeHours: 2,
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '09:00', actualEnd: '20:00' }
      },
      '2024-09-09': { 
        date: '2024-09-09', 
        status: 'present', 
        clockIn: '09:10', 
        clockOut: '18:10', 
        workingHours: '8h 30m', 
        location: 'remote',
        gpsLocation: 'Home Office',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '09:10', actualEnd: '18:10' }
      },
      '2024-09-10': { 
        date: '2024-09-10', 
        status: 'present', 
        clockIn: '08:55', 
        clockOut: '17:55', 
        workingHours: '8h 30m', 
        location: 'client-site',
        gpsLocation: 'Client ABC Office',
        notes: 'On-site client meeting',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '08:55', actualEnd: '17:55' }
      },
      '2024-09-11': { 
        date: '2024-09-11', 
        status: 'present', 
        clockIn: '09:05', 
        clockOut: '18:05', 
        workingHours: '8h 30m', 
        location: 'office',
        hasMissingPunch: true,
        notes: 'Forgot to punch out initially',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '09:05', actualEnd: '18:05' }
      },
      '2024-09-12': { 
        date: '2024-09-12', 
        status: 'absent', 
        notes: 'Personal emergency' 
      },
      '2024-09-13': { 
        date: '2024-09-13', 
        status: 'present', 
        clockIn: '09:00', 
        clockOut: '19:30', 
        workingHours: '10h 0m', 
        location: 'office',
        overtimeHours: 1.5,
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '09:00', actualEnd: '19:30' }
      },
      '2024-09-16': { 
        date: '2024-09-16', 
        status: 'present', 
        clockIn: '08:50', 
        clockOut: '17:50', 
        workingHours: '8h 30m', 
        location: 'remote',
        gpsLocation: 'Home Office',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '08:50', actualEnd: '17:50' }
      },
      '2024-09-17': { 
        date: '2024-09-17', 
        status: 'present', 
        clockIn: '09:00', 
        clockOut: '18:00', 
        workingHours: '8h 30m', 
        location: 'office',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '09:00', actualEnd: '18:00' }
      }
    };
  }

  private initializeTodayData(): TodayAttendance {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = this.attendanceData[today];
    
    if (todayRecord && todayRecord.clockIn) {
      return {
        clockInTime: todayRecord.clockIn,
        clockOutTime: todayRecord.clockOut || null,
        isClocked: !todayRecord.clockOut,
        status: 'present',
        workingHours: todayRecord.workingHours || '0h 0m',
        location: todayRecord.location || 'Office'
      };
    }

    return {
      clockInTime: null,
      clockOutTime: null,
      isClocked: false,
      status: 'absent',
      workingHours: '0h 0m',
      location: 'N/A'
    };
  }

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(callback => callback());
  }

  getTodayAttendance(): TodayAttendance {
    return { ...this.todayData };
  }

  getAttendanceRecord(date: string): AttendanceRecord | null {
    return this.attendanceData[date] || null;
  }

  getAllAttendanceData(): { [key: string]: AttendanceRecord } {
    return { ...this.attendanceData };
  }

  clockIn(time?: string): boolean {
    const currentTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];
    
    this.todayData.clockInTime = currentTime;
    this.todayData.isClocked = true;
    this.todayData.status = 'present';
    this.todayData.location = 'office';
    
    // Update attendance record
    this.attendanceData[today] = {
      date: today,
      status: 'today',
      clockIn: currentTime,
      location: 'office'
    };
    
    this.notify();
    return true;
  }

  clockOut(time?: string): boolean {
    if (!this.todayData.clockInTime) return false;
    
    const currentTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];
    
    this.todayData.clockOutTime = currentTime;
    this.todayData.isClocked = false;
    
    // Calculate working hours
    const workingHours = this.calculateWorkingHours(this.todayData.clockInTime, currentTime);
    this.todayData.workingHours = workingHours;
    
    // Update attendance record
    if (this.attendanceData[today]) {
      this.attendanceData[today].clockOut = currentTime;
      this.attendanceData[today].workingHours = workingHours;
      this.attendanceData[today].status = 'present';
    }
    
    this.notify();
    return true;
  }

  private calculateWorkingHours(clockIn: string, clockOut: string): string {
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    const diffMinutes = outMinutes - inMinutes;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }

  getMonthlyStats(year: number, month: number) {
    const stats = {
      present: 0,
      absent: 0,
      leave: 0,
      rate: 0
    };
    
    Object.values(this.attendanceData).forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getFullYear() === year && recordDate.getMonth() === month) {
        if (record.status === 'present' || record.status === 'today') {
          stats.present++;
        } else if (record.status === 'absent') {
          stats.absent++;
        } else if (record.status === 'leave') {
          stats.leave++;
        }
      }
    });
    
    const total = stats.present + stats.absent + stats.leave;
    stats.rate = total > 0 ? Math.round((stats.present / total) * 100) : 0;
    
    return stats;
  }
}

// Enhanced Calendar component with detailed attendance features
const AttendanceCalendar = ({ 
  setShowDetailModal, 
  setSelectedDate, 
  setSelectedRecord,
  getStatusBadge,
  getLocationIcon 
}: {
  setShowDetailModal: (show: boolean) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedRecord: (record: AttendanceRecord | null) => void;
  getStatusBadge: (status: string) => JSX.Element | null;
  getLocationIcon: (location?: string) => string;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceService] = useState(() => AttendanceService.getInstance());
  const [attendanceData, setAttendanceData] = useState(attendanceService.getAllAttendanceData());

  useEffect(() => {
    const unsubscribe = attendanceService.subscribe(() => {
      setAttendanceData(attendanceService.getAllAttendanceData());
    });
    return unsubscribe;
  }, [attendanceService]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAttendanceStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'weekend';
    }
    
    if (dateStr === today) return 'today';
    const record = attendanceData[dateStr];
    return record?.status || 'no-record';
  };

  const getStatusColor = (status: string, record?: AttendanceRecord) => {
    const baseClasses = 'border transition-colors min-h-[120px] flex flex-col p-3 rounded-lg';
    
    if (record?.isHalfDay) {
      return `${baseClasses} bg-gradient-to-r from-yellow-200 to-white dark:from-yellow-800 dark:to-gray-700 border-yellow-300 dark:border-yellow-600`;
    }
    
    switch (status) {
      case 'present': return `${baseClasses} bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-800`;
      case 'late': return `${baseClasses} bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-800`;
      case 'absent': return `${baseClasses} bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-600 hover:bg-red-100 dark:hover:bg-red-800`;
      case 'today': return `${baseClasses} bg-blue-50 dark:bg-blue-900 ring-2 ring-blue-500 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800`;
      case 'leave': return `${baseClasses} bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800`;
      case 'weekend': return `${baseClasses} bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-500 text-gray-500 dark:text-gray-400`;
      default: return `${baseClasses} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`;
    }
  };

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const record = attendanceData[dateStr];
    if (record) {
      setSelectedRecord(record);
      setSelectedDate(date);
      setShowDetailModal(true);
    }
  };

  const getCheckInOutTimes = (record?: AttendanceRecord) => {
    if (!record) return '--:-- / --:--';
    if (record.status === 'weekend') return 'Closed';
    if (record.status === 'absent') return 'No record';
    if (record.status === 'leave') return record.isHalfDay ? 'Half day' : 'On leave';
    
    const inTime = record.clockIn ? `In: ${record.clockIn}` : 'In: --:--';
    const outTime = record.clockOut ? `Out: ${record.clockOut}` : 'Out: --:--';
    return `${inTime}\n${outTime}`;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const days = getDaysInMonth(currentDate);
  const currentMonthStats = attendanceService.getMonthlyStats(currentDate.getFullYear(), currentDate.getMonth());

  // Calculate enhanced summary
  const getEnhancedSummary = () => {
    const summary: AttendanceSummary = {
      present: 0,
      late: 0,
      absent: 0,
      leave: 0,
      overtimeHours: 0,
      workingDays: 0
    };
    
    Object.values(attendanceData).forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getFullYear() === currentDate.getFullYear() && 
          recordDate.getMonth() === currentDate.getMonth()) {
        const dayOfWeek = recordDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
          summary.workingDays++;
          
          if (record.status === 'present') summary.present++;
          else if (record.status === 'late') summary.late++;
          else if (record.status === 'absent') summary.absent++;
          else if (record.status === 'leave') summary.leave++;
          
          if (record.overtimeHours) {
            summary.overtimeHours += record.overtimeHours;
          }
        }
      }
    });
    
    return summary;
  };

  const enhancedSummary = getEnhancedSummary();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Calendar</h3>
        <span className="text-2xl">📅</span>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          ←
        </button>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day: string) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Enhanced Calendar Grid with Detailed Day Cells */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((date: Date | null, index: number) => {
          if (!date) {
            return <div key={index} className="p-2"></div>;
          }
          
          const dateStr = date.toISOString().split('T')[0];
          const status = getAttendanceStatus(date);
          const record = attendanceData[dateStr];
          const isToday = new Date().toDateString() === date.toDateString();
          
          return (
            <div
              key={date.toISOString()}
              className={`
                text-sm cursor-pointer transition-all duration-200
                ${getStatusColor(status, record)}
                hover:shadow-md hover:scale-[1.02]
              `}
              onClick={() => handleDayClick(date)}
            >
              {/* Header: Date and Day */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {date.getDate()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {date.toLocaleDateString('en', { weekday: 'short' })}
                  </span>
                  {isToday && (
                    <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full mt-1">
                      Today
                    </span>
                  )}
                </div>
                
                {/* Status Badge */}
                <div className="flex flex-col items-end">
                  {getStatusBadge(status)}
                  {record?.hasMissingPunch && (
                    <span className="text-yellow-600 text-xs mt-1">⚠</span>
                  )}
                </div>
              </div>
              
              {/* Status Label */}
              {status !== 'weekend' && status !== 'no-record' && (
                <div className="mb-2">
                  <span className={`text-xs font-medium ${
                    status === 'present' ? 'text-green-700 dark:text-green-300' :
                    status === 'late' ? 'text-yellow-700 dark:text-yellow-300' :
                    status === 'absent' ? 'text-red-700 dark:text-red-300' :
                    status === 'leave' ? 'text-blue-700 dark:text-blue-300' :
                    'text-gray-700 dark:text-gray-300'
                  }`}>
                    {status === 'present' ? 'Present' :
                     status === 'late' ? 'Late' :
                     status === 'absent' ? 'Absent' :
                     status === 'leave' ? record?.isHalfDay ? 'Half Day' : 'Leave' :
                     status === 'today' ? 'Today' : ''}
                  </span>
                </div>
              )}
              
              {/* Time Information */}
              {record && (status === 'present' || status === 'late' || status === 'today') && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">In:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {record.clockIn || '--:--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Out:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {record.clockOut || '--:--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hours:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {record.workingHours || '0h 0m'}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Weekend Display */}
              {status === 'weekend' && (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Closed</span>
                </div>
              )}
              
              {/* No Record Display */}
              {status === 'no-record' && (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-gray-400 dark:text-gray-500 text-xs">No record</span>
                </div>
              )}
              
              {/* Absent Display */}
              {status === 'absent' && (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-red-600 dark:text-red-400 text-xs font-medium">Absent</span>
                  {record?.notes && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {record.notes.length > 20 ? record.notes.substring(0, 20) + '...' : record.notes}
                    </span>
                  )}
                </div>
              )}
              
              {/* Leave Display */}
              {status === 'leave' && (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                    {record?.isHalfDay ? 'Half Day' : 'On Leave'}
                  </span>
                  {record?.notes && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {record.notes.length > 15 ? record.notes.substring(0, 15) + '...' : record.notes}
                    </span>
                  )}
                </div>
              )}
              
              {/* Location and Overtime Indicators */}
              {record && (status === 'present' || status === 'late' || status === 'today') && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center">
                    {record.location && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getLocationIcon(record.location)}
                      </span>
                    )}
                  </div>
                  
                  {record.overtimeHours && record.overtimeHours > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      +{record.overtimeHours}h
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Legend:</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 dark:bg-green-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-200 dark:bg-red-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Absent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800 rounded ring-2 ring-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">On Leave</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Weekend (Closed)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">No Record</span>
          </div>
        </div>
      </div>


    </div>
  );
};

const EmployeeDashboard = () => {
  const [notifications] = useState([
    { id: 1, message: "Your leave request was approved ✅", time: "2 hours ago" },
    { id: 2, message: "Payroll will be processed on Sep 30 💰", time: "1 day ago" },
    { id: 3, message: "New company policy uploaded 📄", time: "2 days ago" }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [attendanceService] = useState(() => AttendanceService.getInstance());
  const [todayAttendance, setTodayAttendance] = useState(attendanceService.getTodayAttendance());
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const unsubscribe = attendanceService.subscribe(() => {
      setTodayAttendance(attendanceService.getTodayAttendance());
    });
    return unsubscribe;
  }, [attendanceService]);

  const handleClockAction = () => {
    if (todayAttendance.isClocked) {
      attendanceService.clockOut();
    } else {
      attendanceService.clockIn();
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'present': return <span className={`${badgeClass} bg-green-500 text-white`}>✅</span>;
      case 'late': return <span className={`${badgeClass} bg-orange-500 text-white`}>⏰</span>;
      case 'absent': return <span className={`${badgeClass} bg-red-500 text-white`}>❌</span>;
      case 'today': return <span className={`${badgeClass} bg-blue-500 text-white`}>T</span>;
      case 'leave': return <span className={`${badgeClass} bg-yellow-500 text-white`}>🌴</span>;
      case 'weekend': return <span className={`${badgeClass} bg-gray-400 text-white`}>W</span>;
      default: return null;
    }
  };

  const getLocationIcon = (location?: string) => {
    switch (location) {
      case 'office': return '🏢';
      case 'remote': return '🏠';
      case 'client-site': return '📍';
      default: return '';
    }
  };

  const taskStats = {
    pending: 3,
    inProgress: 2,
    done: 8,
    failed: 1
  };

  const projects = [
    { name: "Website Redesign", deadline: "2024-10-15", status: "on track" },
    { name: "Mobile App Development", deadline: "2024-09-25", status: "delayed" },
    { name: "Database Migration", deadline: "2024-11-01", status: "on track" }
  ];

  const announcements = [
    { id: 1, title: "Company Holiday Notice", date: "Sep 15, 2024", content: "Office will be closed on Oct 1st for National Day." },
    { id: 2, title: "New Health Insurance Policy", date: "Sep 12, 2024", content: "Updated health benefits now available. Check HR portal for details." },
    { id: 3, title: "Q3 Performance Reviews", date: "Sep 10, 2024", content: "Performance review meetings will be scheduled next week." }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header with Notifications */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your overview for today.</p>
            </div>
            
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-2xl">🔔</span>
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Grid Layout with Today's Attendance spanning 4 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            
            {/* Today's Attendance Card - 4 columns width */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Attendance</h3>
                  <span className="text-2xl">⏰</span>
                </div>
                
                {/* Attendance Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clock In</div>
                    <div className="font-medium text-green-600 dark:text-green-400">{todayAttendance.clockInTime || "-- : --"}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clock Out</div>
                    <div className="font-medium text-gray-400">{todayAttendance.clockOutTime || "-- : --"}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Hours</div>
                    <div className="font-medium text-blue-600 dark:text-blue-400">
                      {todayAttendance.clockOutTime ? todayAttendance.workingHours : "7h 30m"}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Present
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleClockAction}
                    className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      todayAttendance.isClocked
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {todayAttendance.isClocked ? '🚪 Clock Out' : '🕐 Clock In'}
                  </button>
                  
                  <button
                    onClick={() => setShowAttendanceModal(true)}
                    className="w-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    📊 View Details
                  </button>
                </div>
              </div>
              
              {/* Latest Payslip Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Payslip</h3>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Period:</span>
                    <span className="font-medium text-gray-900 dark:text-white">Sep 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gross Salary:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">$5,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Net Salary:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">$4,850</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2">
                      📥 Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - 2 columns for Leave Balance only */}
            <div className="lg:col-span-2">
              {/* Leave Balance Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Balance</h3>
                  <span className="text-2xl">🏖️</span>
                </div>
                
                {/* Leave Types Grid */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Annual Leave</div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-600 dark:text-blue-400">12 remaining</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-sm text-red-500 dark:text-red-400">8 used</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sick Leave</div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-600 dark:text-green-400">5 remaining</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-sm text-orange-500 dark:text-orange-400">5 used</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Personal Leave</div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-purple-600 dark:text-purple-400">3 remaining</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-sm text-red-500 dark:text-red-400">2 used</span>
                    </div>
                  </div>
                </div>
                
                {/* Total Summary */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Remaining</div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">20 days</div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <a
                    href="/leave"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-center"
                  >
                    Request Leave
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: My Tasks & Projects - Full width below */}
            <div className="lg:col-span-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Tasks Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Tasks</h3>
                    <span className="text-2xl">📋</span>
                  </div>
                  
                  {/* Small Kanban Preview */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center">
                      <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg p-2">
                        <div className="text-lg font-bold">{taskStats.pending}</div>
                        <div className="text-xs">Pending</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg p-2">
                        <div className="text-lg font-bold">{taskStats.inProgress}</div>
                        <div className="text-xs">In Progress</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center">
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg p-2">
                        <div className="text-lg font-bold">{taskStats.done}</div>
                        <div className="text-xs">Done</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg p-2">
                        <div className="text-lg font-bold">{taskStats.failed}</div>
                        <div className="text-xs">Failed</div>
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href="/tasks"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                  >
                    View All Tasks →
                  </a>
                </div>

                {/* Assigned Projects Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned Projects</h3>
                    <span className="text-2xl">🚀</span>
                  </div>
                  
                  <div className="space-y-3">
                    {projects.map((project, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'on track' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Deadline: {project.deadline}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Notices & Communication - Full width below */}
            <div className="lg:col-span-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notice Board Widget */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notice Board</h3>
                    <span className="text-2xl">📢</span>
                  </div>
                  
                  <div className="space-y-3">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border-l-4 border-blue-500 pl-3 py-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{announcement.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{announcement.date}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{announcement.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  <a
                    href="/notice-board"
                    className="block w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                  >
                    View All Notices
                  </a>
                </div>

                {/* Communication Links */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Communication</h3>
                    <span className="text-2xl">💬</span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Q&A / Helpdesk Link */}
                    <a
                      href="/helpdesk"
                      className="block border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">❓</span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Q&A / Helpdesk</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Post questions or check answers</p>
                        </div>
                      </div>
                    </a>

                    {/* FAQ Shortcut */}
                    <a
                      href="/faq"
                      className="block border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📚</span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">FAQ</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Frequently asked questions</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendar Section - Full Width Below Cards */}
          <div className="mt-6">
            <AttendanceCalendar 
              setShowDetailModal={setShowDetailModal}
              setSelectedDate={setSelectedDate}
              setSelectedRecord={setSelectedRecord}
              getStatusBadge={getStatusBadge}
              getLocationIcon={getLocationIcon}
            />
          </div>
        </div>
      </div>

      {/* Attendance Details Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Details</h3>
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Company Working Hours</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200">9:00 AM - 6:00 PM (9 hours)</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Clock In Time:</span>
                    <span className={`font-medium ${
                      todayAttendance.clockInTime && todayAttendance.clockInTime > "09:00" ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {todayAttendance.clockInTime || "-- : --"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Clock Out Time:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {todayAttendance.clockOutTime || "Not clocked out yet"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Working Hours:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {todayAttendance.clockOutTime ? todayAttendance.workingHours : "7h 30m (ongoing)"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="font-medium text-gray-900 dark:text-white">Main Office</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Notes:</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Regular working day. All tasks completed on schedule.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Detail Modal */}
      {showDetailModal && selectedRecord && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Attendance Details - {selectedDate.toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Status Header */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {selectedDate.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedRecord.status)}
                      <span className={`text-sm font-medium ${
                        selectedRecord.status === 'present' ? 'text-green-700 dark:text-green-300' :
                        selectedRecord.status === 'late' ? 'text-yellow-700 dark:text-yellow-300' :
                        selectedRecord.status === 'absent' ? 'text-red-700 dark:text-red-300' :
                        selectedRecord.status === 'leave' ? 'text-blue-700 dark:text-blue-300' :
                        'text-gray-700 dark:text-gray-300'
                      }`}>
                        {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                        {selectedRecord.isHalfDay && ' (Half Day)'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Full Timeline for Working Days */}
                {(selectedRecord.status === 'present' || selectedRecord.status === 'late' || selectedRecord.status === 'today') && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                      <span className="mr-2">🕰️</span>
                      Full Timeline
                    </h5>
                    
                    <div className="space-y-3">
                      {/* Check-in */}
                      {selectedRecord.clockIn && (
                        <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded border-l-4 border-green-500">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {selectedRecord.clockIn} – Check-in
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {getLocationIcon(selectedRecord.location)} 
                              {selectedRecord.location === 'office' ? 'Main Office' : 
                               selectedRecord.location === 'remote' ? 'Remote Work' : 
                               selectedRecord.location === 'client-site' ? 'Client Site' : 'Office'}
                              {selectedRecord.gpsLocation && ` - ${selectedRecord.gpsLocation}`}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Break Time (if working more than 4 hours) */}
                      {selectedRecord.clockIn && selectedRecord.clockOut && (
                        <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded border-l-4 border-yellow-500">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              12:30 – Break
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              30 min lunch break
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Check-out */}
                      {selectedRecord.clockOut && (
                        <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded border-l-4 border-red-500">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {selectedRecord.clockOut} – Check-out
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Work completed
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Visual Timeline Bar */}
                    {selectedRecord.workTimeline && selectedRecord.clockIn && (
                      <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>08:00</span>
                          <span>12:00</span>
                          <span>16:00</span>
                          <span>20:00</span>
                        </div>
                        <div className="relative w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div 
                            className={`absolute top-0 h-4 rounded-full ${
                              selectedRecord.status === 'late' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{
                              left: `${Math.max(0, ((parseInt(selectedRecord.clockIn.split(':')[0]) * 60 + parseInt(selectedRecord.clockIn.split(':')[1])) - 480) / 720 * 100)}%`,
                              width: selectedRecord.clockOut ? 
                                `${Math.min(100, ((parseInt(selectedRecord.clockOut.split(':')[0]) * 60 + parseInt(selectedRecord.clockOut.split(':')[1])) - 
                                 (parseInt(selectedRecord.clockIn.split(':')[0]) * 60 + parseInt(selectedRecord.clockIn.split(':')[1]))) / 720 * 100)}%` : '50%'
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                              {selectedRecord.workingHours || '8h 0m'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Time Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
                    <h5 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Check In</h5>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {selectedRecord.clockIn || '--:--'}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900 p-3 rounded">
                    <h5 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Check Out</h5>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {selectedRecord.clockOut || '--:--'}
                    </p>
                  </div>
                </div>
                
                {/* Location & Additional Info */}
                <div className="space-y-3">
                  {selectedRecord.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getLocationIcon(selectedRecord.location)} 
                        {selectedRecord.location === 'office' ? 'Main Office' : 
                         selectedRecord.location === 'remote' ? 'Remote Work' : 'Client Site'}
                        {selectedRecord.gpsLocation && ` (${selectedRecord.gpsLocation})`}
                      </span>
                    </div>
                  )}
                  
                  {selectedRecord.workingHours && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Working Hours:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {selectedRecord.workingHours}
                      </span>
                    </div>
                  )}
                  
                  {selectedRecord.overtimeHours && selectedRecord.overtimeHours > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Overtime:</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        +{selectedRecord.overtimeHours}h
                      </span>
                    </div>
                  )}
                  
                  {selectedRecord.isHalfDay && (
                    <div className="bg-yellow-50 dark:bg-yellow-900 p-2 rounded">
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        🌴 Half Day Leave
                      </span>
                    </div>
                  )}
                  
                  {selectedRecord.hasMissingPunch && (
                    <div className="bg-orange-50 dark:bg-orange-900 p-2 rounded">
                      <span className="text-sm text-orange-800 dark:text-orange-200">
                        ⚠ Missing Punch Corrected
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Notes */}
                {selectedRecord.notes && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Notes:</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      {selectedRecord.notes}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
};

export default EmployeeDashboard;