'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'shift' | 'meeting' | 'holiday' | 'training' | 'deadline' | 'personal';
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
}

export default function PersonalSchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<ScheduleEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize with some mock data
  useEffect(() => {
    const mockEvents: ScheduleEvent[] = [
      {
        id: '1',
        title: 'Morning Shift',
        type: 'shift',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        description: 'Regular work shift',
        location: 'Main Office'
      },
      {
        id: '2',
        title: 'Team Meeting',
        type: 'meeting',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        description: 'Weekly team sync',
        location: 'Conference Room A'
      },
      {
        id: '3',
        title: 'Personal Appointment',
        type: 'personal',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '15:00',
        description: 'Doctor appointment',
        location: 'Medical Center'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const handleCreateEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: Date.now().toString()
    };
    setEvents([...events, newEvent]);
    setShowCreateModal(false);
  };

  const handleUpdateEvent = (updatedEvent: ScheduleEvent | Omit<ScheduleEvent, 'id'>) => {
    if ('id' in updatedEvent) {
      setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
      setShowEditModal(false);
      setCurrentEvent(null);
    }
  };

  const handleDeleteEvent = () => {
    if (currentEvent) {
      setEvents(events.filter(event => event.id !== currentEvent.id));
      setShowDeleteModal(false);
      setCurrentEvent(null);
    }
  };

  const openEditModal = (event: ScheduleEvent) => {
    setCurrentEvent(event);
    setShowEditModal(true);
  };

  const openDeleteModal = (event: ScheduleEvent) => {
    setCurrentEvent(event);
    setShowDeleteModal(true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'shift': return 'bg-green-100 text-green-800 border-green-200';
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'holiday': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'training': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'deadline': return 'bg-red-100 text-red-800 border-red-200';
      case 'personal': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'shift': return '🟢';
      case 'meeting': return '🔵';
      case 'holiday': return '⚪';
      case 'training': return '🟠';
      case 'deadline': return '🔴';
      case 'personal': return '💕';
      default: return '📝';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Get days for calendar view
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getCalendarDays();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Personal Schedule</h1>
            <p className="text-gray-600">Manage your personal events and schedule</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <span>+</span>
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* View Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ◀
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button 
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ▶
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  viewMode === 'day' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  viewMode === 'week' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  viewMode === 'month' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {dayNames.map((day) => (
              <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-32 border-r border-b border-gray-200"></div>;
              }
              
              const dayEvents = getEventsForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={day.toString()} 
                  className={`min-h-32 p-2 border-r border-b border-gray-200 ${
                    isToday ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event.id}
                        className={`text-xs p-1 rounded truncate border cursor-pointer ${getEventTypeColor(event.type)}`}
                        onClick={() => openEditModal(event)}
                      >
                        <div className="flex items-center">
                          <span className="mr-1">{getEventTypeIcon(event.type)}</span>
                          <span className="truncate">{event.title}</span>
                        </div>
                        <div className="text-xs">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          
          {sortedEvents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-5xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No events scheduled</h3>
              <p className="text-gray-500">Create your first event to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Event
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedEvents.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-xl mt-1">{getEventTypeIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(event.type)}`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.startTime} - {event.endTime}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </div>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="mt-2 text-gray-600 text-sm">{event.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Event"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteModal(event)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        {showCreateModal && (
          <EventModal
            mode="create"
            onSubmit={handleCreateEvent}
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {/* Edit Event Modal */}
        {showEditModal && currentEvent && (
          <EventModal
            mode="edit"
            event={currentEvent}
            onSubmit={handleUpdateEvent}
            onClose={() => {
              setShowEditModal(false);
              setCurrentEvent(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && currentEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Event</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the event "<span className="font-medium">{currentEvent.title}</span>"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentEvent(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Event Modal Component
function EventModal({ 
  mode, 
  event, 
  onSubmit, 
  onClose 
}: { 
  mode: 'create' | 'edit';
  event?: ScheduleEvent;
  onSubmit: (event: ScheduleEvent | Omit<ScheduleEvent, 'id'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Omit<ScheduleEvent, 'id'> | ScheduleEvent>({
    title: event?.title || '',
    type: event?.type || 'personal',
    date: event?.date || new Date().toISOString().split('T')[0],
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '10:00',
    description: event?.description || '',
    location: event?.location || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ('id' in formData) {
      onSubmit(formData as ScheduleEvent);
    } else {
      onSubmit(formData as Omit<ScheduleEvent, 'id'>);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Create New Event' : 'Edit Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="personal">Personal</option>
                  <option value="meeting">Meeting</option>
                  <option value="shift">Shift</option>
                  <option value="holiday">Holiday</option>
                  <option value="training">Training</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Event location (optional)"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Event description (optional)"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {mode === 'create' ? 'Create Event' : 'Update Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}