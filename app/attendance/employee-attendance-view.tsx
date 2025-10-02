'use client';

import React from 'react';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'late' | 'absent' | 'leave' | 'weekend';
  checkIn?: string;
  checkOut?: string;
  totalHours?: string;
  reason?: string;
  location?: string;
}

const EmployeeAttendanceView: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedRecord, setSelectedRecord] = React.useState<AttendanceRecord | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  // Mock employee attendance data
  const generateAttendanceData = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const today = new Date();
    
    // Generate last 30 days of data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Weekend check
      if (date.getDay() === 0 || date.getDay() === 6) {
        records.push({
          date: dateStr,
          status: 'weekend'
        });
        continue;
      }
      
      // Generate realistic attendance patterns
      const random = Math.random();
      if (random < 0.05) {
        records.push({
          date: dateStr,
          status: 'absent'
        });
      } else if (random < 0.15) {
        records.push({
          date: dateStr,
          status: 'leave',
          reason: 'Personal Leave'
        });
      } else if (random < 0.25) {
        records.push({
          date: dateStr,
          status: 'late',
          checkIn: '09:20',
          checkOut: '18:05',
          totalHours: '8h 45m',
          location: 'Office'
        });
      } else {
        const checkInTime = `09:0${Math.floor(Math.random() * 8)}`;
        records.push({
          date: dateStr,
          status: 'present',
          checkIn: checkInTime,
          checkOut: '18:05',
          totalHours: '8h 55m',
          location: 'Office'
        });
      }
    }
    
    return records;
  };

  const attendanceData = generateAttendanceData();

  const getStatusDisplay = (status: string) => {
    const displays = {
      'present': { icon: '✅', color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'Present' },
      'late': { icon: '⏰', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', label: 'Late' },
      'absent': { icon: '❌', color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'Absent' },
      'leave': { icon: '🌴', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', label: 'Leave' },
      'weekend': { icon: 'W', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200', label: 'Weekend' }
    };
    return displays[status as keyof typeof displays] || displays.present;
  };

  const calculateStats = () => {
    const workDays = attendanceData.filter(r => r.status !== 'weekend');
    return {
      present: workDays.filter(r => r.status === 'present').length,
      late: workDays.filter(r => r.status === 'late').length,
      absent: workDays.filter(r => r.status === 'absent').length,
      leave: workDays.filter(r => r.status === 'leave').length
    };
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Start from Monday
    
    const days = [];
    for (let i = 0; i < 35; i++) { // 5 weeks max
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAttendanceByDate = (date: Date): AttendanceRecord | null => {
    const dateStr = date.toISOString().split('T')[0];
    return attendanceData.find(record => record.date === dateStr) || null;
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleRecordClick = (record: AttendanceRecord) => {
    if (record.status !== 'weekend') {
      setSelectedRecord(record);
      setShowModal(true);
    }
  };

  const stats = calculateStats();
  const avgCheckIn = '09:07';
  const avgHours = '8h 50m';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">📌 My Attendance</h1>
          
          <div className="flex items-center space-x-4">
            {/* Navigation buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ◀
              </button>
              <button 
                onClick={() => viewMode === 'week' ? navigateWeek(1) : navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ▶
              </button>
            </div>
            
            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week ▾
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month ▾
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">✅</span>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <div className="text-sm text-green-700 font-medium">Present</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">⏰</span>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                <div className="text-sm text-yellow-700 font-medium">Late</div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">❌</span>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <div className="text-sm text-red-700 font-medium">Absent</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🌴</span>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.leave}</div>
                <div className="text-sm text-blue-700 font-medium">Leave</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        <div className="flex-1">
          {/* Weekly View */}
          {viewMode === 'week' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Week of {monthNames[getWeekDays()[0].getMonth()]} {getWeekDays()[0].getDate()}–{getWeekDays()[6].getDate()}
              </h3>
              
              <div className="space-y-3">
                {getWeekDays().map((day, index) => {
                  const record = getAttendanceByDate(day);
                  const dayName = dayNames[day.getDay() === 0 ? 6 : day.getDay() - 1];
                  const statusDisplay = record ? getStatusDisplay(record.status) : getStatusDisplay('absent');
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => record && handleRecordClick(record)}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        record?.status === 'weekend' 
                          ? 'bg-gray-50 border-gray-200 cursor-default' 
                          : 'hover:shadow-md cursor-pointer ' + statusDisplay.bg
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-600 w-12">
                          {dayName} {day.getDate()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{statusDisplay.icon}</span>
                          <span className={`font-medium ${statusDisplay.color}`}>
                            {statusDisplay.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        {record?.checkIn && (
                          <div>
                            <span className="text-gray-600">In: </span>
                            <span className="font-medium">{record.checkIn}</span>
                          </div>
                        )}
                        {record?.checkOut && (
                          <div>
                            <span className="text-gray-600">Out: </span>
                            <span className="font-medium">{record.checkOut}</span>
                          </div>
                        )}
                        {record?.reason && (
                          <div>
                            <span className="text-gray-600">Reason: </span>
                            <span className="font-medium">{record.reason}</span>
                          </div>
                        )}
                        {record?.status === 'weekend' && (
                          <span className="text-gray-500 font-medium">Closed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly View */}
          {viewMode === 'month' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {getMonthCalendar().map((day, index) => {
                  const record = getAttendanceByDate(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const statusDisplay = record ? getStatusDisplay(record.status) : null;
                  
                  return (
                    <div
                      key={index}
                      onClick={() => record && isCurrentMonth && handleRecordClick(record)}
                      className={`
                        relative p-2 min-h-[60px] border rounded-lg transition-all
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                        ${isToday ? 'ring-2 ring-blue-500' : 'border-gray-200'}
                        ${record && isCurrentMonth && record.status !== 'weekend' ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
                      `}
                    >
                      <div className={`text-sm font-medium ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                        {day.getDate()}
                      </div>
                      
                      {record && isCurrentMonth && (
                        <div className="absolute inset-x-1 bottom-1">
                          <div className={`text-center text-xs px-1 py-0.5 rounded ${
                            record.status === 'weekend' ? 'bg-gray-100 text-gray-600' : statusDisplay?.bg
                          }`}>
                            <span className="text-lg">{statusDisplay?.icon}</span>
                          </div>
                        </div>
                      )}
                      
                      {isToday && (
                        <div className="absolute top-1 right-1">
                          <span className="text-xs bg-blue-500 text-white px-1 rounded">Today</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 This Month</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Present:</span>
              <span className="font-semibold text-green-600">{stats.present}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late:</span>
              <span className="font-semibold text-yellow-600">{stats.late}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Absent:</span>
              <span className="font-semibold text-red-600">{stats.absent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leave:</span>
              <span className="font-semibold text-blue-600">{stats.leave}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Check-in:</span>
              <span className="font-medium text-gray-900">{avgCheckIn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Hours Worked:</span>
              <span className="font-medium text-gray-900">{avgHours}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">🎨 Status Guide</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span className="text-gray-600">Present (Green)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⏰</span>
                <span className="text-gray-600">Late (Yellow)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>❌</span>
                <span className="text-gray-600">Absent (Red)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🌴</span>
                <span className="text-gray-600">Leave (Blue)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>W</span>
                <span className="text-gray-600">Weekend (Gray)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Attendance Details</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <div className={`flex items-center px-2 py-1 rounded text-sm ${getStatusDisplay(selectedRecord.status).bg}`}>
                    <span className="mr-1">{getStatusDisplay(selectedRecord.status).icon}</span>
                    <span className={getStatusDisplay(selectedRecord.status).color}>
                      {getStatusDisplay(selectedRecord.status).label}
                    </span>
                  </div>
                </div>
                
                {selectedRecord.checkIn && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{selectedRecord.checkIn}</span>
                  </div>
                )}
                
                {selectedRecord.checkOut && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{selectedRecord.checkOut}</span>
                  </div>
                )}
                
                {selectedRecord.totalHours && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-medium text-blue-600">{selectedRecord.totalHours}</span>
                  </div>
                )}
                
                {selectedRecord.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedRecord.location}</span>
                  </div>
                )}
                
                {selectedRecord.reason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-medium">{selectedRecord.reason}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
};

export default EmployeeAttendanceView;