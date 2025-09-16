'use client';

import React from 'react';
import Layout from '@/components/Layout';

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);

  // Navigation functions
  const navigateToToday = () => setCurrentDate(new Date());
  
  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (viewMode === 'Week') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else {
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Mock attendance data
  const getAttendanceEvent = (date: Date) => {
    const dateKey = date.getDate();
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isFuture = date > new Date();
    
    if (!isCurrentMonth || isFuture) return null;
    
    const attendanceData: { [key: number]: any } = {
      1: { status: 'present', checkIn: '09:05', checkOut: '18:05', location: 'Office', notes: '' },
      2: { status: 'present', checkIn: '09:00', checkOut: '18:08', location: 'Office', notes: '' },
      3: { status: 'late', checkIn: '09:20', checkOut: '18:00', location: 'Office', notes: 'Traffic delay' },
      4: { status: 'present', checkIn: '08:55', checkOut: '17:45', location: 'Office', notes: '' },
      5: { status: 'leave', checkIn: '', checkOut: '', location: '', notes: 'Vacation day' },
      8: { status: 'present', checkIn: '09:10', checkOut: '18:15', location: 'Remote', notes: 'Worked from home' },
      9: { status: 'late', checkIn: '09:25', checkOut: '18:30', location: 'Office', notes: 'Doctor appointment' },
      10: { status: 'present', checkIn: '09:02', checkOut: '18:00', location: 'Office', notes: '' },
      12: { status: 'absent', checkIn: '', checkOut: '', location: '', notes: 'Sick day' },
      15: { status: 'present', checkIn: '09:00', checkOut: '17:30', location: 'Office', notes: 'Half day' },
      19: { status: 'leave', checkIn: '', checkOut: '', location: '', notes: 'Personal leave' }
    };
    
    return attendanceData[dateKey] || null;
  };

  // Get event styling
  const getEventStyle = (status: string) => {
    const styles = {
      'present': { bg: 'bg-green-500', text: 'text-white', label: 'Present' },
      'late': { bg: 'bg-yellow-500', text: 'text-white', label: 'Late' },
      'leave': { bg: 'bg-blue-500', text: 'text-white', label: 'Leave' },
      'absent': { bg: 'bg-red-500', text: 'text-white', label: 'Absent' }
    };
    return styles[status as keyof typeof styles] || styles.present;
  };

  // Calculate stats
  const calculateStats = () => {
    const days = getCalendarDays().filter(day => 
      day.getMonth() === currentDate.getMonth() && day <= new Date()
    );
    
    const stats = { present: 0, late: 0, absent: 0, leave: 0 };
    days.forEach(day => {
      const event = getAttendanceEvent(day);
      if (event) stats[event.status as keyof typeof stats]++;
    });
    
    return stats;
  };

  const handleEventClick = (event: any, date: Date) => {
    setSelectedEvent({ ...event, date });
    setShowModal(true);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getCalendarDays();
  const stats = calculateStats();

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Bar - Google Calendar Style */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Left: Navigation */}
            <div className="flex items-center space-x-4">
              <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                ◀
              </button>
              <button onClick={() => navigateDate(1)} className="p-2 hover:bg-gray-100 rounded-lg">
                ▶
              </button>
              <button onClick={navigateToToday} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Today
              </button>
            </div>

            {/* Center: Month + Year */}
            <h1 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>

            {/* Right: View toggles */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['Day', 'Week', 'Month'].map((view) => (
                <button
                  key={view}
                  onClick={() => setViewMode(view as 'Day' | 'Week' | 'Month')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === view ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-4">
          {/* Calendar - Google Calendar Style */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
            {viewMode === 'Month' && (
              <div className="p-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-px mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                  {days.map((day, index) => {
                    const event = getAttendanceEvent(day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    
                    return (
                      <div
                        key={index}
                        className={`bg-white min-h-[120px] p-2 relative ${
                          isToday ? 'ring-2 ring-primary-500 ring-inset' : ''
                        } ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
                      >
                        {/* Date number (top-right) */}
                        <div className={`text-right text-sm font-medium mb-1 ${
                          isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        } ${isToday ? 'text-primary-600 font-bold' : ''}`}>
                          {day.getDate()}
                        </div>
                        
                        {/* Attendance Event Block - Google Calendar Style */}
                        {event && isCurrentMonth && (
                          <div
                            onClick={() => handleEventClick(event, day)}
                            className={`${getEventStyle(event.status).bg} ${getEventStyle(event.status).text} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                          >
                            <div className="font-medium">
                              🟢 {getEventStyle(event.status).label}
                            </div>
                            {event.checkIn && (
                              <div className="text-xs opacity-90">
                                ({event.checkIn} – {event.checkOut})
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Week/Day View Placeholders */}
            {viewMode !== 'Month' && (
              <div className="p-4">
                <div className="text-center py-20 text-gray-500">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-lg font-medium">{viewMode} View</h3>
                  <p className="text-sm">Time slot view coming soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Mini Summary Panel */}
          <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span className="text-sm text-gray-700">Present</span>
                </div>
                <span className="text-sm font-medium">{stats.present}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span className="text-sm text-gray-700">Late</span>
                </div>
                <span className="text-sm font-medium">{stats.late}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>❌</span>
                  <span className="text-sm text-gray-700">Absent</span>
                </div>
                <span className="text-sm font-medium">{stats.absent}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>🌴</span>
                  <span className="text-sm text-gray-700">Leave</span>
                </div>
                <span className="text-sm font-medium">{stats.leave}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Modal */}
        {showModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Details</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getEventStyle(selectedEvent.status).bg} ${getEventStyle(selectedEvent.status).text} mt-1`}>
                      {getEventStyle(selectedEvent.status).label}
                    </div>
                  </div>
                  
                  {selectedEvent.checkIn && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Check-in</label>
                        <p className="text-sm text-gray-900">{selectedEvent.checkIn}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Check-out</label>
                        <p className="text-sm text-gray-900">{selectedEvent.checkOut}</p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-900">{selectedEvent.location || 'N/A'}</p>
                  </div>
                  
                  {selectedEvent.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Notes</label>
                      <p className="text-sm text-gray-900">{selectedEvent.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}