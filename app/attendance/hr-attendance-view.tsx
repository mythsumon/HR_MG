'use client';

import React, { useState } from 'react';

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
  const [selectedDateRange, setSelectedDateRange] = useState('Today');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate] = useState(new Date());

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
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <select 
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="Today">Today ▾</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Custom">Custom Range</option>
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
                          
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
                <h3 className="text-lg font-semibold text-gray-900">📌 Weekly Snapshot (Matrix)</h3>
                <p className="text-sm text-gray-600">Week of Sep 15–19</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Employee</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Mon</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Tue</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Wed</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Thu</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Fri</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{record.avatar}</span>
                            <div>
                              <div className="font-medium text-gray-900">{record.employeeName}</div>
                              <div className="text-sm text-gray-500">{record.department}</div>
                            </div>
                          </div>
                        </td>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                          const dayData = record.weekData?.[day];
                          const statusDisplay = dayData ? getStatusDisplay(dayData.status) : { icon: '–', color: 'text-gray-400' };
                          return (
                            <td key={day} className="px-4 py-3 text-center">
                              <div className="flex flex-col items-center space-y-1">
                                <span className={`text-lg ${statusDisplay.color}`}>{statusDisplay.icon}</span>
                                <span className="text-xs text-gray-600">
                                  {dayData?.checkIn || '–'}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        
                        <button className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors">
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
    </div>
  );
};

export default HRAttendanceView;