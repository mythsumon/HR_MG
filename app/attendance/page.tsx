'use client';

import React from 'react';
import Layout from '@/components/Layout';
import HRAttendanceTable from './hr-table';
import HRAttendanceView from './hr-attendance-view';
import EmployeeAttendanceView from './employee-attendance-view';
import { SharedAttendanceService, ScheduleEvent } from '../../services/AttendanceService';

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedEvent, setSelectedEvent] = React.useState<ScheduleEvent | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [userRole, setUserRole] = React.useState<'employee' | 'manager'>('employee');
  const [currentView, setCurrentView] = React.useState<'employee' | 'hr'>('employee');
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>('All');
  const [selectedTeam, setSelectedTeam] = React.useState<string>('All');
  const [selectedEventType, setSelectedEventType] = React.useState<string>('All');
  const [attendanceService] = React.useState(() => SharedAttendanceService.getInstance());
  const [scheduleData, setScheduleData] = React.useState(attendanceService.getScheduleData());

  // Subscribe to service updates
  React.useEffect(() => {
    const unsubscribe = attendanceService.subscribe(() => {
      setScheduleData(attendanceService.getScheduleData());
    });
    return unsubscribe;
  }, [attendanceService]);

  // Load user role from localStorage
  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'employee' | 'manager';
    if (storedRole) setUserRole(storedRole);
    // HR managers always use HR view
    if (storedRole === 'manager') {
      setCurrentView('hr');
    }
  }, []);

  // Check if should show HR view
  const shouldShowHRView = userRole === 'manager';

  if (shouldShowHRView) {
    return (
      <Layout>
        <HRAttendanceView />
      </Layout>
    );
  }

  // Employee attendance view - new personal interface
  const shouldShowEmployeeView = userRole === 'employee';
  
  if (shouldShowEmployeeView) {
    return (
      <Layout>
        <EmployeeAttendanceView />
      </Layout>
    );
  }

  // Navigation functions for employee calendar view
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

  const getScheduleEvents = (date: Date): ScheduleEvent[] => {
    return attendanceService.getScheduleEvents(date, {
      department: selectedDepartment,
      team: selectedTeam,
      eventType: selectedEventType
    });
  };

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

  const getEventTypeColor = (type: string): string => {
    const colors = {
      'shift': 'bg-green-100 text-green-800 border-green-200',
      'meeting': 'bg-blue-100 text-blue-800 border-blue-200',
      'training': 'bg-orange-100 text-orange-800 border-orange-200',
      'deadline': 'bg-red-100 text-red-800 border-red-200',
      'holiday': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.shift;
  };

  const getEventStyle = (type: string) => {
    const styles = {
      'shift': { bg: 'bg-green-500', text: 'text-white', icon: '🟢' },
      'meeting': { bg: 'bg-blue-500', text: 'text-white', icon: '🔵' },
      'training': { bg: 'bg-orange-500', text: 'text-white', icon: '🟠' },
      'deadline': { bg: 'bg-red-500', text: 'text-white', icon: '🔴' },
      'holiday': { bg: 'bg-gray-400', text: 'text-white', icon: '⚪' }
    };
    return styles[type as keyof typeof styles] || styles.shift;
  };

  const calculateStats = () => {
    const currentDateStats = attendanceService.getMonthlyStats(currentDate.getFullYear(), currentDate.getMonth());
    return {
      shifts: currentDateStats.shifts,
      meetings: currentDateStats.meetings,
      training: currentDateStats.training,
      holidays: currentDateStats.holidays
    };
  };

  // Get today's schedule from service
  const todaysSchedule = attendanceService.getScheduleEvents(new Date());

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
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
        {/* Header Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
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

            <h1 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>

            <div className="flex bg-gray-100 rounded-lg p-1">
              {['Month', 'Week', 'Day'].map((view) => (
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
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Department:</label>
              <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Team:</label>
              <select 
                value={selectedTeam} 
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Teams</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="DevOps">DevOps</option>
                <option value="Design">Design</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Event Type:</label>
              <select 
                value={selectedEventType} 
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Types</option>
                <option value="shift">Shift</option>
                <option value="meeting">Meeting</option>
                <option value="training">Training</option>
                <option value="deadline">Deadline</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
            {viewMode === 'Month' && (
              <div className="p-4">
                <div className="grid grid-cols-7 gap-px mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-px bg-gray-200">
                  {days.map((day, index) => {
                    const events = getScheduleEvents(day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const dayName = dayNames[day.getDay()];
                    
                    return (
                      <div
                        key={index}
                        className={`bg-white min-h-[140px] p-2 relative ${
                          isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
                        } ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
                      >
                        <div className={`flex items-center justify-between text-sm font-medium mb-2 ${
                          isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                          <span className="text-xs text-gray-500">{dayName}</span>
                          <span>{day.getDate()}</span>
                          {isToday && <span className="text-xs bg-blue-500 text-white px-1 rounded">Today</span>}
                        </div>
                        
                        <div className="space-y-1">
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              className={`${getEventStyle(event.type).bg} ${getEventStyle(event.type).text} p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                            >
                              <div className="font-medium flex items-center">
                                <span className="mr-1">{getEventIcon(event.type)}</span>
                                {event.title}
                              </div>
                              <div className="text-xs opacity-90">
                                {event.startTime} – {event.endTime}
                              </div>
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-gray-500 text-center py-1">
                              +{events.length - 2} more...
                            </div>
                          )}
                          {events.length === 0 && isCurrentMonth && (
                            <div className="text-xs text-gray-400 text-center py-2">
                              No events
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'Week' && (
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Week of {monthNames[currentDate.getMonth()]} {currentDate.getDate() - currentDate.getDay()}-{currentDate.getDate() - currentDate.getDay() + 6}, {currentDate.getFullYear()}
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-8 gap-px bg-gray-200 min-w-[800px]">
                    {/* Time column header */}
                    <div className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-500">
                      Time
                    </div>
                    
                    {/* Day headers */}
                    {dayNames.map((day) => (
                      <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    
                    {/* Time slots */}
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                      <React.Fragment key={time}>
                        <div className="bg-white p-3 text-sm text-gray-600 border-r">
                          {time}
                        </div>
                        {Array.from({length: 7}).map((_, dayIndex) => {
                          const weekStart = new Date(currentDate);
                          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
                          const currentDay = new Date(weekStart);
                          currentDay.setDate(weekStart.getDate() + dayIndex);
                          
                          const dayEvents = getScheduleEvents(currentDay).filter(event => 
                            event.startTime.startsWith(time.split(':')[0])
                          );
                          
                          return (
                            <div key={dayIndex} className="bg-white p-2 min-h-[60px] border-r">
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  onClick={() => handleEventClick(event)}
                                  className={`${getEventStyle(event.type).bg} ${getEventStyle(event.type).text} p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity mb-1`}
                                >
                                  <div className="font-medium flex items-center">
                                    <span className="mr-1">{getEventIcon(event.type)}</span>
                                    {event.title}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {viewMode === 'Day' && (
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => {
                    const timeEvents = getScheduleEvents(currentDate).filter(event => 
                      event.startTime.startsWith(time.split(':')[0])
                    );
                    
                    return (
                      <div key={time} className="flex items-start space-x-4 p-3 border-b border-gray-100">
                        <div className="w-20 text-sm text-gray-600 font-medium">
                          {time}
                        </div>
                        <div className="flex-1">
                          {timeEvents.length > 0 ? (
                            <div className="space-y-1">
                              {timeEvents.map((event) => (
                                <div
                                  key={event.id}
                                  onClick={() => handleEventClick(event)}
                                  className={`${getEventStyle(event.type).bg} ${getEventStyle(event.type).text} p-3 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                  <div className="font-medium flex items-center mb-1">
                                    <span className="mr-2">{getEventIcon(event.type)}</span>
                                    {event.title}
                                  </div>
                                  <div className="text-sm opacity-90">
                                    {event.startTime} – {event.endTime}
                                  </div>
                                  {event.description && (
                                    <div className="text-sm opacity-75 mt-1">
                                      {event.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400 italic">
                              No events scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Connection Status */}
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 dark:text-green-300 font-medium">Connected to Dashboard</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Real-time sync with Today's Attendance
              </p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Schedule Summary
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">🟢 {stats.shifts}</div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">Shifts</div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">🔵 {stats.meetings}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Meetings</div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">🟠 {stats.training}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Training</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="text-xl font-bold text-gray-600 dark:text-gray-400">⚪ {stats.holidays}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Holidays</div>
              </div>
            </div>
            
            {/* Today's Schedule */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
              <h6 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">Today's Schedule</h6>
              <div className="space-y-2">
                {todaysSchedule.length > 0 ? (
                  todaysSchedule.map((event) => (
                    <div key={event.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">{getEventIcon(event.type)}</span>
                        <span className="font-medium text-blue-800 dark:text-blue-200">{event.title}</span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-300 text-xs">{event.startTime}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-blue-700 dark:text-blue-300">No events today</div>
                )}
              </div>
            </div>
            
            {/* Color Legend */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Event Types</h6>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">🟢</span>
                    <span className="text-gray-700 dark:text-gray-300">Shifts</span>
                  </div>
                  <span className="text-green-600 dark:text-green-400">Work schedules</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">🔵</span>
                    <span className="text-gray-700 dark:text-gray-300">Meetings</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400">Team events</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">🟠</span>
                    <span className="text-gray-700 dark:text-gray-300">Training</span>
                  </div>
                  <span className="text-orange-600 dark:text-orange-400">Special sessions</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">🔴</span>
                    <span className="text-gray-700 dark:text-gray-300">Deadlines</span>
                  </div>
                  <span className="text-red-600 dark:text-red-400">Critical tasks</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">⚪</span>
                    <span className="text-gray-700 dark:text-gray-300">Holiday</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Weekend/Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Modal */}
        {showModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Details</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event</label>
                    <div className="flex items-center mt-1">
                      <span className="mr-2">{getEventIcon(selectedEvent.type)}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedEvent.title}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(selectedEvent.type)} mt-1 border`}>
                      {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedEvent.startTime} – {selectedEvent.endTime}</p>
                  </div>
                  
                  {selectedEvent.department && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedEvent.department}</p>
                    </div>
                  )}
                  
                  {selectedEvent.team && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Team</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedEvent.team}</p>
                    </div>
                  )}
                  
                  {selectedEvent.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedEvent.description}</p>
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
    </Layout>
  );
}