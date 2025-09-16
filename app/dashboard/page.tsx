'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = React.useState('employee');
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<any>(null);
  const [attendancePopup, setAttendancePopup] = React.useState(false);
  const [showGreeting, setShowGreeting] = React.useState(true);
  const [clockStatus, setClockStatus] = React.useState({
    clockedIn: true,
    clockInTime: '09:05',
    clockOutTime: null as string | null,
    status: 'present', // 'present', 'absent', 'late'
    isLate: false
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (userRole === 'employee') {
    return (
      <Layout>
        <div className="space-y-6">

          {/* Top Banner */}
          {showGreeting && (
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white relative">
              <button 
                onClick={() => setShowGreeting(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors text-xl"
                aria-label="Close greeting"
              >
                ✕
              </button>
              <h1 className="text-2xl font-bold mb-2 pr-8">
                {getGreeting()}, John 👋
              </h1>
              <p className="text-primary-100 pr-8">
                Have a productive day at work!
              </p>
            </div>
          )}

          {/* Main Cards (2x2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Attendance Card - Enhanced */}
            <div 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setAttendancePopup(true)}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-50">
                  <span className="text-green-600 text-2xl">⏰</span>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Today's Attendance</h3>
              </div>
              <div className="space-y-4">
                {/* Status Chip */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    clockStatus.status === 'present' ? 'bg-green-100 text-green-800' :
                    clockStatus.status === 'late' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {clockStatus.status === 'present' && '✅ Present'}
                    {clockStatus.status === 'late' && '⚠ Late'}
                    {clockStatus.status === 'absent' && '❌ Absent'}
                  </span>
                </div>
                
                {/* Clock-in Time */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Clock-in:</span>
                  <span className={`text-xl font-semibold ${
                    clockStatus.isLate ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {clockStatus.clockInTime || '--:--'}
                  </span>
                </div>
                
                {/* Clock-out Time */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Clock-out:</span>
                  <span className="text-xl font-semibold text-gray-600">
                    {clockStatus.clockOutTime || '--:--'}
                  </span>
                </div>
                
                {/* Action Button */}
                <div className="mt-4">
                  {!clockStatus.clockedIn ? (
                    <button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        const now = new Date();
                        const timeString = now.toTimeString().slice(0, 5);
                        const isLateClockIn = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 0);
                        setClockStatus({
                          clockedIn: true,
                          clockInTime: timeString,
                          clockOutTime: null,
                          status: isLateClockIn ? 'late' : 'present',
                          isLate: isLateClockIn
                        });
                      }}
                    >
                      <span>🕐</span>
                      <span>Clock In</span>
                    </button>
                  ) : !clockStatus.clockOutTime ? (
                    <button 
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        const now = new Date();
                        const timeString = now.toTimeString().slice(0, 5);
                        setClockStatus(prev => ({
                          ...prev,
                          clockOutTime: timeString
                        }));
                      }}
                    >
                      <span>🕐</span>
                      <span>Clock Out</span>
                    </button>
                  ) : (
                    <div className="text-center text-gray-500 font-medium py-3">
                      ✅ Day Complete
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leave Balance Card */}
            <div 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push('/leave')}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-50">
                  <span className="text-blue-600 text-2xl">📅</span>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Leave Balance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vacation:</span>
                  <span className="text-xl font-semibold text-blue-600">8 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sick:</span>
                  <span className="text-xl font-semibold text-orange-600">3 days</span>
                </div>
              </div>
            </div>

            {/* Payslip Card */}
            <div 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push('/payroll')}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-50">
                  <span className="text-purple-600 text-2xl">💰</span>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Payslip Card</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Latest Payslip:</span>
                  <span className="text-sm font-medium text-gray-700">September 2024</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <span>📄</span>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-yellow-50">
                  <span className="text-yellow-600 text-2xl">🔔</span>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Your leave request was approved</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Payroll will be processed on Sep 30</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Calendar Widget */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Calendar Header with Stats and View Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance Calendar - September 2024</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-1">✅</span>
                    <span className="text-gray-600">Present: 15 days</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-600 mr-1">❌</span>
                    <span className="text-gray-600">Absent: 2 days</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-1">📊</span>
                    <span className="text-gray-600">Attendance Rate: <strong className="text-green-600">88%</strong></span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-lg border border-primary-200">Month</button>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-200">Week</button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Week Days Header */}
              <div className="grid grid-cols-8 bg-gray-50">
                <div className="p-2 text-xs font-medium text-gray-500 text-center border-r border-gray-200">Week</div>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={day} className={`p-2 text-xs font-medium text-center border-r border-gray-200 last:border-r-0 ${
                    index === 0 || index === 6 ? 'bg-gray-100 text-gray-500' : 'text-gray-700'
                  }`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              {Array.from({ length: 5 }, (_, weekIndex) => {
                const weekNumber = 36 + weekIndex;
                return (
                  <div key={weekIndex} className="grid grid-cols-8 border-t border-gray-200">
                    {/* Week Number */}
                    <div className="p-2 text-xs text-gray-500 text-center border-r border-gray-200 bg-gray-50 flex items-center justify-center">
                      {weekNumber}
                    </div>
                    
                    {/* Days of Week */}
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const dayNumber = weekIndex * 7 + dayIndex + 1 - 2; // Adjust for September starting
                      const isValidDay = dayNumber > 0 && dayNumber <= 30;
                      const isWeekend = dayIndex === 0 || dayIndex === 6;
                      const isToday = dayNumber === 16; // Example: 16th is today
                      
                      let status = 'no-record';
                      let timeDetails = null;
                      
                      if (isValidDay && dayNumber <= 17) {
                        if (dayNumber === 8) {
                          status = 'absent';
                        } else if (dayNumber === 5 || dayNumber === 12) {
                          status = 'leave';
                          timeDetails = { type: 'Annual Leave' };
                        } else if (dayNumber === 16) {
                          status = 'today';
                          timeDetails = { checkin: '09:05', checkout: '--:--', hours: 'In Progress' };
                        } else {
                          status = 'present';
                          timeDetails = { 
                            checkin: '09:' + String(Math.floor(Math.random() * 30)).padStart(2, '0'), 
                            checkout: '17:' + String(Math.floor(Math.random() * 30)).padStart(2, '0'),
                            hours: '8h ' + Math.floor(Math.random() * 60) + 'm'
                          };
                        }
                      }
                      
                      const statusColors = {
                        present: 'bg-green-50 border-green-200 text-green-800',
                        absent: 'bg-red-50 border-red-200 text-red-800',
                        leave: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                        today: 'bg-blue-50 border-blue-200 text-blue-800',
                        'no-record': 'bg-white border-gray-200 text-gray-400'
                      };
                      
                      return (
                        <div 
                          key={dayIndex} 
                          className={`relative h-20 border-r border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                            isWeekend ? 'bg-gray-25' : 'bg-white'
                          }`}
                          onClick={() => {
                            if (isValidDay && status !== 'no-record') {
                              setSelectedDate({ day: dayNumber, status, timeDetails });
                            }
                          }}
                        >
                          {isValidDay && (
                            <>
                              {/* Date Number */}
                              <div className="absolute top-1 right-1 text-xs font-medium text-gray-700">
                                {dayNumber}
                              </div>
                              
                              {/* Status Indicator */}
                              {status !== 'no-record' && (
                                <div className={`absolute top-6 left-1 right-1 mx-1 h-5 rounded text-xs flex items-center justify-center font-medium border ${
                                  statusColors[status as keyof typeof statusColors]
                                }`}>
                                  {status === 'present' && '✓'}
                                  {status === 'absent' && '✗'}
                                  {status === 'leave' && '📅'}
                                  {status === 'today' && '👤'}
                                </div>
                              )}
                              
                              {/* Time Details for Present Days */}
                              {timeDetails && timeDetails.checkin && (
                                <div className="absolute bottom-1 left-1 right-1 text-xs text-gray-600">
                                  <div>{timeDetails.checkin}-{timeDetails.checkout}</div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2"></div>
                <span>🟩 Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                <span>🟥 Absent</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
                <span>🟦 Today</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded mr-2"></div>
                <span>🟨 On Leave</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
                <span>⬜ No record</span>
              </div>
            </div>
          </div>

          {/* Date Details Modal */}
          {selectedDate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedDate(null)}>
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">September {selectedDate.day}, 2024</h3>
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center">
                    <span className="text-gray-600 w-20">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedDate.status === 'present' ? 'bg-green-100 text-green-800' :
                      selectedDate.status === 'absent' ? 'bg-red-100 text-red-800' :
                      selectedDate.status === 'leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedDate.status === 'present' ? 'Present' :
                       selectedDate.status === 'absent' ? 'Absent' :
                       selectedDate.status === 'leave' ? 'On Leave' : 'Today'}
                    </span>
                  </div>
                  
                  {/* Time Details */}
                  {selectedDate.timeDetails && selectedDate.timeDetails.checkin && (
                    <>
                      <div className="flex items-center">
                        <span className="text-gray-600 w-20">Check-in:</span>
                        <span className="font-medium">{selectedDate.timeDetails.checkin}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 w-20">Check-out:</span>
                        <span className="font-medium">{selectedDate.timeDetails.checkout}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 w-20">Hours:</span>
                        <span className="font-medium">{selectedDate.timeDetails.hours}</span>
                      </div>
                    </>
                  )}
                  
                  {/* Leave Type */}
                  {selectedDate.timeDetails && selectedDate.timeDetails.type && (
                    <div className="flex items-center">
                      <span className="text-gray-600 w-20">Type:</span>
                      <span className="font-medium">{selectedDate.timeDetails.type}</span>
                    </div>
                  )}
                  
                  {/* Notes */}
                  {selectedDate.status === 'present' && Math.random() > 0.7 && (
                    <div className="flex items-start">
                      <span className="text-gray-600 w-20">Notes:</span>
                      <span className="text-yellow-600 text-sm">Late by 15 mins</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Popup Modal */}
          {attendancePopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setAttendancePopup(false)}>
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Attendance Details</h3>
                  <button 
                    onClick={() => setAttendancePopup(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Working Hours Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Company Working Hours</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>🕐 Monday - Friday: 08:00 - 17:00</div>
                      <div>🚫 Saturday - Sunday: Closed</div>
                    </div>
                  </div>
                  
                  {/* Today's Record */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">📅 Today's Record</h4>
                    
                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        clockStatus.status === 'present' ? 'bg-green-100 text-green-800' :
                        clockStatus.status === 'late' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {clockStatus.status === 'present' && '✅ Present'}
                        {clockStatus.status === 'late' && '⚠ Late'}
                        {clockStatus.status === 'absent' && '❌ Absent'}
                      </span>
                    </div>
                    
                    {/* Clock-in */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Clock-in Time:</span>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          clockStatus.isLate ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {clockStatus.clockInTime || 'Not clocked in'}
                        </div>
                        {clockStatus.isLate && (
                          <div className="text-xs text-red-500">⚠ Late arrival</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Clock-out */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Clock-out Time:</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-700">
                          {clockStatus.clockOutTime || 'Not clocked out'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Working Hours */}
                    {clockStatus.clockInTime && clockStatus.clockOutTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Working Hours:</span>
                        <div className="font-semibold text-blue-600">
                          {(() => {
                            const [inHour, inMin] = clockStatus.clockInTime.split(':').map(Number);
                            const [outHour, outMin] = clockStatus.clockOutTime.split(':').map(Number);
                            const inMinutes = inHour * 60 + inMin;
                            const outMinutes = outHour * 60 + outMin;
                            const diffMinutes = outMinutes - inMinutes;
                            const hours = Math.floor(diffMinutes / 60);
                            const minutes = diffMinutes % 60;
                            return `${hours}h ${minutes}m`;
                          })()} 
                        </div>
                      </div>
                    )}
                    
                    {/* Location */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location:</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-700">🏢 Office</div>
                        <div className="text-xs text-gray-500">GPS: Main Building</div>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    {clockStatus.isLate && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="text-sm text-orange-800">
                          <div className="font-semibold mb-1">📝 Notes:</div>
                          <div>Late arrival - arrived after 08:00</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    onClick={() => setAttendancePopup(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setAttendancePopup(false);
                      router.push('/attendance');
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Full Calendar
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Demo Switch Button */}
        <div className="flex justify-end">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500 mb-2">Demo: Switch Dashboard View</p>
            <button
              onClick={() => setUserRole('employee')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Switch to Employee View
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            {/* Left: Company logo + HR Dashboard title */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">HR</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
                <p className="text-sm text-gray-500">Human Resources Management</p>
              </div>
            </div>

            {/* Right: Notification bell + User avatar dropdown */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors relative">
                  <span className="text-2xl">🔔</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    10
                  </span>
                </button>
              </div>

              {/* User Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">JD</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">HR Manager</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
                    <hr className="my-1" />
                    <button
                      onClick={() => router.push('/login')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview (First Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Employees */}
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/employees')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50">
                <span className="text-blue-600 text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">128</p>
              </div>
            </div>
          </div>

          {/* Active Employees */}
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/employees')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">121</p>
              </div>
            </div>
          </div>

          {/* New Hires (30 days) */}
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/employees')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50">
                <span className="text-purple-600 text-2xl">🆕</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">New Hires (30d)</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/leave')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-50">
                <span className="text-yellow-600 text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">10</p>
                <p className="text-xs text-gray-500 mt-1">Leaves 5, Expense 2, Docs 3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary (Second Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Today */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Today</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">92%</p>
                    <p className="text-xs text-gray-600">Present</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-green-600">92%</p>
                <p className="text-gray-600">Present</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-600">5%</p>
                <p className="text-gray-600">Late</p>
              </div>
              <div>
                <p className="font-semibold text-red-600">3%</p>
                <p className="text-gray-600">Absent</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/employees')}
                className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>➕</span>
                <span>Add Employee</span>
              </button>
              <button
                onClick={() => router.push('/attendance')}
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>⬆️</span>
                <span>Upload Attendance CSV</span>
              </button>
              <button
                onClick={() => router.push('/reports')}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>📊</span>
                <span>Generate Attendance Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Charts & Analytics (Main Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart: Attendance Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends (Last 30 Days)</h3>
            <div className="h-64 bg-gradient-to-t from-gray-50 to-white border border-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-gray-500 text-sm">Line Chart: Attendance Trends</p>
                <p className="text-xs text-gray-400 mt-1">Present/Absent percentage over time</p>
              </div>
            </div>
          </div>

          {/* Bar Chart: Department Comparison */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Comparison</h3>
            <div className="h-64 bg-gradient-to-t from-gray-50 to-white border border-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-500 text-sm">Bar Chart: Department Costs</p>
                <p className="text-xs text-gray-400 mt-1">Costs or headcount per department</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tables (Optional Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leave Requests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Leave Requests</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Employee</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Dates</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-sm">Sarah Johnson</td>
                    <td className="py-2 text-sm">Vacation</td>
                    <td className="py-2 text-sm">Oct 15-17</td>
                    <td className="py-2">
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approve</button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-sm">Mike Chen</td>
                    <td className="py-2 text-sm">Sick</td>
                    <td className="py-2 text-sm">Oct 20</td>
                    <td className="py-2">
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approve</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Expense Claims */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Expense Claims</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Employee</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-sm">Alex Rodriguez</td>
                    <td className="py-2 text-sm">$245.50</td>
                    <td className="py-2 text-sm">Pending</td>
                    <td className="py-2">
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Review</button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-sm">Emma Wilson</td>
                    <td className="py-2 text-sm">$89.25</td>
                    <td className="py-2 text-sm">Pending</td>
                    <td className="py-2">
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Review</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
    </Layout>
  );
}