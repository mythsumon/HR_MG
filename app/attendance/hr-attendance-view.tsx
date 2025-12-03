'use client';

import React, { useState } from 'react';
import Pagination from '@/components/Pagination';

// Types for attendance data
interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  role: string;
  avatar: string;
  status: 'present' | 'late' | 'absent' | 'leave';
  checkIn: string;
  checkOut: string;
  totalHours: string;
  date: string;
  weekData?: {
    [key: string]: {
      status: 'present' | 'late' | 'absent' | 'leave';
      checkIn?: string;
      checkOut?: string;
    };
  };
}

// Mock data for demonstration
const mockAttendanceData: AttendanceRecord[] = [
  {
    id: '1',
    employeeName: 'John Kim',
    employeeId: 'EMP001',
    department: 'Backend',
    role: 'Senior Developer',
    avatar: '👤',
    status: 'late',
    checkIn: '09:20',
    checkOut: '18:00',
    totalHours: '8h 40m',
    date: '2024-09-19',
    weekData: {
      'Mon': { status: 'present', checkIn: '09:05', checkOut: '18:05' },
      'Tue': { status: 'absent' },
      'Wed': { status: 'present', checkIn: '09:02', checkOut: '18:02' },
      'Thu': { status: 'present', checkIn: '09:00', checkOut: '18:00' },
      'Fri': { status: 'late', checkIn: '09:20', checkOut: '18:00' },
    }
  },
  {
    id: '2',
    employeeName: 'Sara Lee',
    employeeId: 'EMP002',
    department: 'Finance',
    role: 'Financial Analyst',
    avatar: '👤',
    status: 'present',
    checkIn: '09:05',
    checkOut: '18:05',
    totalHours: '9h 00m',
    date: '2024-09-19',
    weekData: {
      'Mon': { status: 'present', checkIn: '09:05', checkOut: '18:05' },
      'Tue': { status: 'present', checkIn: '09:05', checkOut: '18:05' },
      'Wed': { status: 'leave' },
      'Thu': { status: 'present', checkIn: '09:10', checkOut: '18:10' },
      'Fri': { status: 'present', checkIn: '09:05', checkOut: '18:05' },
    }
  },
  {
    id: '3',
    employeeName: 'David Park',
    employeeId: 'EMP003',
    department: 'Design',
    role: 'UI/UX Designer',
    avatar: '👤',
    status: 'leave',
    checkIn: '–',
    checkOut: '–',
    totalHours: '–',
    date: '2024-09-19',
    weekData: {
      'Mon': { status: 'late', checkIn: '09:25', checkOut: '18:25' },
      'Tue': { status: 'present', checkIn: '09:02', checkOut: '18:02' },
      'Wed': { status: 'leave' },
      'Thu': { status: 'leave' },
      'Fri': { status: 'late', checkIn: '09:20', checkOut: '18:20' },
    }
  },
  {
    id: '4',
    employeeName: 'Emily Chen',
    employeeId: 'EMP004',
    department: 'Frontend',
    role: 'React Developer',
    avatar: '👤',
    status: 'absent',
    checkIn: '–',
    checkOut: '–',
    totalHours: '–',
    date: '2024-09-19',
    weekData: {
      'Mon': { status: 'leave' },
      'Tue': { status: 'present', checkIn: '09:10', checkOut: '18:10' },
      'Wed': { status: 'present', checkIn: '09:00', checkOut: '18:00' },
      'Thu': { status: 'present', checkIn: '09:05', checkOut: '18:05' },
      'Fri': { status: 'present', checkIn: '09:08', checkOut: '18:08' },
    }
  },
  {
    id: '5',
    employeeName: 'Mike Johnson',
    employeeId: 'EMP005',
    department: 'DevOps',
    role: 'DevOps Engineer',
    avatar: '👤',
    status: 'present',
    checkIn: '08:55',
    checkOut: '17:55',
    totalHours: '9h 00m',
    date: '2024-09-19',
    weekData: {
      'Mon': { status: 'present', checkIn: '08:55', checkOut: '17:55' },
      'Tue': { status: 'present', checkIn: '09:00', checkOut: '18:00' },
      'Wed': { status: 'present', checkIn: '08:58', checkOut: '17:58' },
      'Thu': { status: 'present', checkIn: '09:02', checkOut: '18:02' },
      'Fri': { status: 'present', checkIn: '08:55', checkOut: '17:55' },
    }
  }
];

const HRAttendanceView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'cards'>('list');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<AttendanceRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Helper function for event icons
  const getEventIcon = (type: string): string => {
    const icons = {
      'shift': '🟢',
      'meeting': '🔵',
      'training': '🟠',
      'deadline': '🔴',
      'holiday': '⚪'
    };
    return icons[type as keyof typeof icons] || '🟢';
  };

  // Filter data based on selections
  const filteredData = mockAttendanceData.filter(record => {
    if (selectedDepartment !== 'All' && record.department !== selectedDepartment) return false;
    if (selectedStatus !== 'All' && record.status !== selectedStatus) return false;
    if (searchQuery && !record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate stats
  const stats = {
    present: filteredData.filter(r => r.status === 'present').length,
    late: filteredData.filter(r => r.status === 'late').length,
    absent: filteredData.filter(r => r.status === 'absent').length,
    leave: filteredData.filter(r => r.status === 'leave').length,
  };

  // Status color and icon mapping
  const getStatusDisplay = (status: string) => {
    const displays = {
      'present': { icon: '✅', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
      'late': { icon: '⏰', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
      'absent': { icon: '❌', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
      'leave': { icon: '🌴', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    };
    return displays[status as keyof typeof displays] || displays.present;
  };

  // Handle view details click
  const handleViewDetails = (record: AttendanceRecord) => {
    setSelectedEmployee(record);
    setShowDetailModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
  };

  // Generate date range for attendance data
  const getDateRange = () => {
    const dates = [];
    // Fixed date range of 7 days (current week)
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - 3);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate attendance history for an employee
  const generateAttendanceHistory = (employeeId: string, days: number = 30) => {
    const history = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate mock data based on patterns
      const random = Math.random();
      let status: 'present' | 'late' | 'absent' | 'leave' = 'present';
      let checkIn = '09:00';
      let checkOut = '18:00';
      
      if (date.getDay() === 0 || date.getDay() === 6) {
        status = 'leave'; // Weekend
        checkIn = '–';
        checkOut = '–';
      } else if (random < 0.05) {
        status = 'absent';
        checkIn = '–';
        checkOut = '–';
      } else if (random < 0.15) {
        status = 'leave';
        checkIn = '–';
        checkOut = '–';
      } else if (random < 0.3) {
        status = 'late';
        checkIn = `09:${Math.floor(Math.random() * 30) + 10}`.padStart(2, '0');
        checkOut = '18:00';
      }
      
      history.push({
        date: dateStr,
        status,
        checkIn,
        checkOut,
        totalHours: status === 'present' || status === 'late' ? 
          `${9 - (status === 'late' ? 0.5 : 0)}h ${status === 'late' ? '30m' : '00m'}` : '–'
      });
    }
    return history;
  };

  // Generate weekly attendance data for a specific week
  const generateWeeklyAttendance = (employeeId: string, weekStartDate: Date) => {
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + i);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      
      // Skip weekends for this example
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      // Generate mock data
      const random = Math.random();
      let status: 'present' | 'late' | 'absent' | 'leave' = 'present';
      let checkIn = '09:00';
      let checkOut = '18:00';
      
      if (random < 0.05) {
        status = 'absent';
        checkIn = '–';
        checkOut = '–';
      } else if (random < 0.15) {
        status = 'leave';
        checkIn = '–';
        checkOut = '–';
      } else if (random < 0.3) {
        status = 'late';
        checkIn = `09:${Math.floor(Math.random() * 30) + 10}`.padStart(2, '0');
        checkOut = '18:00';
      }
      
      weekData.push({
        day: dayName,
        date: date,
        status,
        checkIn,
        checkOut
      });
    }
    return weekData;
  };

  const dateRangeArray = getDateRange();

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Attendance Management</h1>
            <p className="text-gray-600">Monitor and manage employee attendance records</p>
          </div>
          <div className="text-sm text-gray-500">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Top Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <select 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="All">All Departments ▾</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Finance">Finance</option>
                <option value="Design">Design</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Team</label>
              <select 
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="All">All Teams ▾</option>
                <option value="Alpha">Alpha Team</option>
                <option value="Beta">Beta Team</option>
                <option value="Gamma">Gamma Team</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="All">All Status ▾</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
                <option value="leave">Leave</option>
              </select>
            </div>
          </div>

          {/* Search bar and View toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search employee name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Toggle:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List ▾
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          {/* Option 1: Daily Roster View (List) */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">📌 Daily Roster View</h3>
                <p className="text-sm text-gray-600">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredData.map((record) => {
                  const statusDisplay = getStatusDisplay(record.status);
                  return (
                    <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">{record.avatar}</span>
                          <div>
                            <div className="font-medium text-gray-900">{record.employeeName}</div>
                            <div className="text-sm text-gray-500">{record.department} • {record.role}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className={`flex items-center px-3 py-1 rounded border ${statusDisplay.bg}`}>
                            <span className="mr-2">{statusDisplay.icon}</span>
                            <span className={`font-medium text-sm ${statusDisplay.color}`}>
                              {record.status === 'present' ? `Present (${record.checkIn} – ${record.checkOut})` :
                               record.status === 'late' ? `Late (${record.checkIn} – ${record.checkOut})` :
                               record.status === 'leave' ? 'Leave (Vacation)' :
                               'Absent'}
                            </span>
                          </div>
                          
                          <div className="text-sm font-medium text-gray-900 min-w-[60px]">
                            {record.totalHours}
                          </div>
                          
                          <button 
                            onClick={() => handleViewDetails(record)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details ▸
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Option 2: Weekly Snapshot (Grid) */}
          {viewMode === 'grid' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">📌 Attendance Snapshot</h3>
                <p className="text-sm text-gray-600">
                  Week of {new Date(selectedDate.setDate(selectedDate.getDate() - 3)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                {dateRangeArray.length > 15 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Showing {Math.min(15, dateRangeArray.length)} of {dateRangeArray.length} days. Scroll horizontally to see more.
                  </p>
                )}
              </div>
              
              <div className="overflow-x-auto max-w-full">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b sticky left-0 bg-gray-50 z-10">Employee</th>
                          {dateRangeArray.slice(0, 15).map((date: Date, index: number) => (
                            <th key={index} className="px-2 py-3 text-center text-xs font-medium text-gray-900 border-b min-w-[80px]">
                              {date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </th>
                          ))}
                          {dateRangeArray.length > 15 && (
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">
                              +{dateRangeArray.length - 15} more days
                            </th>
                          )}
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b sticky right-0 bg-gray-50 z-10">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedData.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 sticky left-0 bg-white z-10 border-r">
                              <div className="flex items-center space-x-3 min-w-[150px]">
                                <span className="text-lg">{record.avatar}</span>
                                <div className="truncate">
                                  <div className="font-medium text-gray-900 truncate">{record.employeeName}</div>
                                  <div className="text-sm text-gray-500 truncate">{record.department}</div>
                                </div>
                              </div>
                            </td>
                            {dateRangeArray.slice(0, 15).map((date: Date, index: number) => {
                              const dateStr = date.toISOString().split('T')[0];
                              // For demo purposes, we'll use the existing weekData but in a real app this would come from a service
                              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                              const dayName = dayNames[date.getDay()];
                              const dayData = record.weekData?.[dayName];
                              const statusDisplay = dayData ? getStatusDisplay(dayData.status) : { icon: '–', color: 'text-gray-400' };
                              return (
                                <td key={index} className="px-2 py-3 text-center">
                                  <div className="flex flex-col items-center space-y-1">
                                    <span className={`text-base ${statusDisplay.color}`}>{statusDisplay.icon}</span>
                                    <span className="text-xs text-gray-600">
                                      {dayData?.checkIn || '–'}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                            {dateRangeArray.length > 15 && (
                              <td className="px-4 py-3 text-center text-sm text-gray-500">
                                ...
                              </td>
                            )}
                            <td className="px-4 py-3 text-center sticky right-0 bg-white z-10 border-l">
                              <button 
                                onClick={() => handleViewDetails(record)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {filteredData.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredData.length}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </div>
          )}

          {/* Option 3: Employee Cards */}
          {viewMode === 'cards' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">📌 Employee Cards (Quick Scan)</h3>
                <p className="text-sm text-gray-600">Mobile-friendly overview</p>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData.map((record) => {
                    const statusDisplay = getStatusDisplay(record.status);
                    const thisWeekStats = {
                      present: Object.values(record.weekData || {}).filter(d => d.status === 'present').length,
                      late: Object.values(record.weekData || {}).filter(d => d.status === 'late').length,
                      absent: Object.values(record.weekData || {}).filter(d => d.status === 'absent').length,
                      leave: Object.values(record.weekData || {}).filter(d => d.status === 'leave').length,
                    };
                    
                    return (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{record.avatar}</span>
                          <div>
                            <div className="font-medium text-gray-900">{record.employeeName}</div>
                            <div className="text-sm text-gray-500">{record.department}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status Today:</span>
                            <div className={`flex items-center px-2 py-1 rounded text-xs ${statusDisplay.bg}`}>
                              <span className="mr-1">{statusDisplay.icon}</span>
                              <span className={statusDisplay.color}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          {record.status !== 'absent' && record.status !== 'leave' && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Check-in:</span>
                                <span className="font-medium">{record.checkIn}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Check-out:</span>
                                <span className="font-medium">{record.checkOut}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Hours:</span>
                                <span className="font-medium text-blue-600">{record.totalHours}</span>
                              </div>
                            </>
                          )}
                          
                          <div className="pt-2 border-t border-gray-100">
                            <div className="text-xs text-gray-600 mb-1">This Week:</div>
                            <div className="text-xs">
                              {thisWeekStats.present} Present, {thisWeekStats.late} Late
                              {thisWeekStats.absent > 0 && `, ${thisWeekStats.absent} Absent`}
                              {thisWeekStats.leave > 0 && `, ${thisWeekStats.leave} Leave`}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleViewDetails(record)}
                          className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                        >
                          [ View Full Attendance ▸ ]
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (Persistent Summary) */}
        <div className="w-80 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Today's Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <span className="text-lg">✅</span>
                <span className="text-sm font-medium text-green-800">Present</span>
              </div>
              <span className="text-xl font-bold text-green-600">{stats.present}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⏰</span>
                <span className="text-sm font-medium text-yellow-800">Late</span>
              </div>
              <span className="text-xl font-bold text-yellow-600">{stats.late}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <span className="text-lg">❌</span>
                <span className="text-sm font-medium text-red-800">Absent</span>
              </div>
              <span className="text-xl font-bold text-red-600">{stats.absent}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌴</span>
                <span className="text-sm font-medium text-blue-800">Leave</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{stats.leave}</span>
            </div>
          </div>
          
          {selectedDepartment !== 'All' && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">{selectedDepartment} Department</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Present:</span>
                  <span className="font-medium text-green-600">
                    {filteredData.filter(r => r.status === 'present').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Late:</span>
                  <span className="font-medium text-yellow-600">
                    {filteredData.filter(r => r.status === 'late').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{filteredData.length}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">🎨 Visual Language</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span className="text-gray-600">Green = Present</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⏰</span>
                <span className="text-gray-600">Yellow = Late</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>❌</span>
                <span className="text-gray-600">Red = Absent</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🌴</span>
                <span className="text-gray-600">Blue = Leave</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Attendance Details</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-4xl">{selectedEmployee.avatar}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedEmployee.employeeName}</h4>
                    <p className="text-gray-600">{selectedEmployee.department} • {selectedEmployee.role}</p>
                    <p className="text-sm text-gray-500">ID: {selectedEmployee.employeeId}</p>
                  </div>
                </div>
                
                {/* Weekly Attendance */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-md font-semibold text-gray-900">Weekly Attendance</h5>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          // Navigate to previous week
                          const newDate = new Date(selectedDate);
                          newDate.setDate(selectedDate.getDate() - 7);
                          setSelectedDate(newDate);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        ◀
                      </button>
                      <span className="text-sm text-gray-600">
                        Week of {new Date(selectedDate.setDate(selectedDate.getDate() - 3)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <button 
                        onClick={() => {
                          // Navigate to next week
                          const newDate = new Date(selectedDate);
                          newDate.setDate(selectedDate.getDate() + 7);
                          setSelectedDate(newDate);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left text-sm font-medium text-gray-900">Day</th>
                          <th className="px-3 py-2 text-center text-sm font-medium text-gray-900">Status</th>
                          <th className="px-3 py-2 text-center text-sm font-medium text-gray-900">Check-in</th>
                          <th className="px-3 py-2 text-center text-sm font-medium text-gray-900">Check-out</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(selectedEmployee.weekData || {}).map(([day, data]) => {
                          const statusDisplay = getStatusDisplay(data.status);
                          return (
                            <tr key={day} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-sm text-gray-900">{day}</td>
                              <td className="px-3 py-2 text-center">
                                <div className="flex items-center justify-center">
                                  <span className={`mr-1 ${statusDisplay.color}`}>{statusDisplay.icon}</span>
                                  <span className="text-sm">{data.status}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-center text-sm text-gray-900">
                                {data.checkIn || '–'}
                              </td>
                              <td className="px-3 py-2 text-center text-sm text-gray-900">
                                {data.checkOut || '–'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Weekly Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">Weekly Summary</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-600">
                        {Object.values(selectedEmployee.weekData || {}).filter(d => d.status === 'present').length}
                      </div>
                      <div className="text-sm text-green-700">Present</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-yellow-600">
                        {Object.values(selectedEmployee.weekData || {}).filter(d => d.status === 'late').length}
                      </div>
                      <div className="text-sm text-yellow-700">Late</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-red-600">
                        {Object.values(selectedEmployee.weekData || {}).filter(d => d.status === 'absent').length}
                      </div>
                      <div className="text-sm text-red-700">Absent</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {Object.values(selectedEmployee.weekData || {}).filter(d => d.status === 'leave').length}
                      </div>
                      <div className="text-sm text-blue-700">Leave</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Export Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRAttendanceView;