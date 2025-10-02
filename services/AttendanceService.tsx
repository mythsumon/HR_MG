// Shared Attendance Service that connects Dashboard and Attendance Menu
'use client';

// Types for attendance and schedule data
export interface AttendanceRecord {
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

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'shift' | 'meeting' | 'holiday' | 'training' | 'deadline';
  startTime: string;
  endTime: string;
  department?: string;
  team?: string;
  description?: string;
}

export interface TodayAttendance {
  clockInTime: string | null;
  clockOutTime: string | null;
  isClocked: boolean;
  status: 'present' | 'absent' | 'late';
  workingHours: string;
  location: string;
}

export interface AttendanceSummary {
  present: number;
  late: number;
  absent: number;
  leave: number;
  overtimeHours: number;
  workingDays: number;
}

// Shared Attendance Service Singleton
export class SharedAttendanceService {
  private static instance: SharedAttendanceService;
  private attendanceData: { [key: string]: AttendanceRecord } = {};
  private scheduleData: ScheduleEvent[] = [];
  private todayData: TodayAttendance;
  private listeners: (() => void)[] = [];

  private constructor() {
    this.initializeData();
    this.initializeScheduleData();
    this.todayData = this.initializeTodayData();
  }

  static getInstance(): SharedAttendanceService {
    if (!SharedAttendanceService.instance) {
      SharedAttendanceService.instance = new SharedAttendanceService();
    }
    return SharedAttendanceService.instance;
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
      },
      // Add today's date dynamically
      [new Date().toISOString().split('T')[0]]: {
        date: new Date().toISOString().split('T')[0],
        status: 'today',
        clockIn: '09:00',
        location: 'office',
        workTimeline: { expectedStart: '09:00', expectedEnd: '18:00', actualStart: '09:00' }
      }
    };
  }

  private initializeScheduleData() {
    this.scheduleData = [
      {
        id: '1',
        title: 'Morning Shift',
        type: 'shift',
        startTime: '09:00',
        endTime: '13:00',
        department: 'Engineering',
        team: 'Frontend',
        description: 'Regular morning work schedule'
      },
      {
        id: '2',
        title: 'Team Meeting',
        type: 'meeting',
        startTime: '15:00',
        endTime: '16:00',
        department: 'Engineering',
        team: 'Frontend',
        description: 'Weekly team sync'
      },
      {
        id: '3',
        title: 'React Training',
        type: 'training',
        startTime: '10:00',
        endTime: '12:00',
        department: 'Engineering',
        team: 'Frontend',
        description: 'Advanced React concepts'
      },
      {
        id: '4',
        title: 'Project Deadline',
        type: 'deadline',
        startTime: '17:00',
        endTime: '17:00',
        department: 'Engineering',
        team: 'Frontend',
        description: 'Submit final deliverables'
      },
      {
        id: '5',
        title: 'Company Holiday',
        type: 'holiday',
        startTime: '00:00',
        endTime: '23:59',
        department: 'All',
        team: 'All',
        description: 'Independence Day'
      }
    ];
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

  // Subscription management for reactive updates
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(callback => callback());
  }

  // Public API methods
  getTodayAttendance(): TodayAttendance {
    return { ...this.todayData };
  }

  getAttendanceRecord(date: string): AttendanceRecord | null {
    return this.attendanceData[date] || null;
  }

  getAllAttendanceData(): { [key: string]: AttendanceRecord } {
    return { ...this.attendanceData };
  }

  getScheduleData(): ScheduleEvent[] {
    return [...this.scheduleData];
  }

  getScheduleEvents(date: Date, filters?: { department?: string, team?: string, eventType?: string }): ScheduleEvent[] {
    const dateKey = date.getDate();
    const today = new Date().getDate();
    
    // Mock schedule events for different dates - synchronized with attendance
    const scheduleByDate: { [key: number]: ScheduleEvent[] } = {
      1: [this.scheduleData[0], this.scheduleData[1]], // Morning Shift + Team Meeting
      2: [this.scheduleData[0]], // Morning Shift only
      3: [this.scheduleData[0], this.scheduleData[2]], // Morning Shift + Training
      4: [this.scheduleData[0], this.scheduleData[3]], // Morning Shift + Deadline
      5: [this.scheduleData[4]], // Holiday
      8: [this.scheduleData[0], this.scheduleData[1]], // Morning Shift + Team Meeting
      9: [this.scheduleData[0]], // Morning Shift only
      10: [this.scheduleData[0], this.scheduleData[2]], // Morning Shift + Training
      12: [this.scheduleData[1]], // Meeting only
      15: [this.scheduleData[0], this.scheduleData[1]], // Morning Shift + Team Meeting
      17: [this.scheduleData[0], this.scheduleData[1]], // Current events
      19: [this.scheduleData[0], this.scheduleData[1]], // Today's events
      [today]: [this.scheduleData[0], this.scheduleData[1]], // Dynamic today
    };
    
    const events = scheduleByDate[dateKey] || [];
    
    // Apply filters if provided
    if (filters) {
      return events.filter(event => {
        const departmentMatch = !filters.department || filters.department === 'All' || event.department === filters.department;
        const teamMatch = !filters.team || filters.team === 'All' || event.team === filters.team;
        const typeMatch = !filters.eventType || filters.eventType === 'All' || event.type === filters.eventType;
        return departmentMatch && teamMatch && typeMatch;
      });
    }
    
    return events;
  }

  // Clock in/out methods that update both attendance and schedule
  clockIn(time?: string): boolean {
    const currentTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];
    
    this.todayData.clockInTime = currentTime;
    this.todayData.isClocked = true;
    this.todayData.status = 'present';
    this.todayData.location = 'office';
    
    // Update attendance record
    this.attendanceData[today] = {
      ...this.attendanceData[today],
      date: today,
      status: 'today',
      clockIn: currentTime,
      location: 'office',
      workTimeline: {
        expectedStart: '09:00',
        expectedEnd: '18:00',
        actualStart: currentTime
      }
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
      this.attendanceData[today] = {
        ...this.attendanceData[today],
        clockOut: currentTime,
        workingHours: workingHours,
        status: 'present',
        workTimeline: {
          ...this.attendanceData[today].workTimeline!,
          actualEnd: currentTime
        }
      };
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
      rate: 0,
      shifts: 0,
      meetings: 0,
      training: 0,
      holidays: 0
    };
    
    // Calculate attendance stats
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
    
    // Calculate schedule stats
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const events = this.getScheduleEvents(date);
      events.forEach(event => {
        if (event.type === 'shift') stats.shifts++;
        else if (event.type === 'meeting') stats.meetings++;
        else if (event.type === 'training') stats.training++;
        else if (event.type === 'holiday') stats.holidays++;
      });
    }
    
    const total = stats.present + stats.absent + stats.leave;
    stats.rate = total > 0 ? Math.round((stats.present / total) * 100) : 0;
    
    return stats;
  }

  // Update attendance status (for manual corrections)
  updateAttendanceStatus(date: string, status: AttendanceRecord['status'], details?: Partial<AttendanceRecord>): boolean {
    if (this.attendanceData[date]) {
      this.attendanceData[date] = {
        ...this.attendanceData[date],
        status,
        ...details
      };
      
      // If updating today's record, also update todayData
      const today = new Date().toISOString().split('T')[0];
      if (date === today) {
        this.todayData = this.initializeTodayData();
      }
      
      this.notify();
      return true;
    }
    return false;
  }

  // Add new schedule event
  addScheduleEvent(event: ScheduleEvent): boolean {
    this.scheduleData.push(event);
    this.notify();
    return true;
  }

  // Update schedule event
  updateScheduleEvent(eventId: string, updates: Partial<ScheduleEvent>): boolean {
    const index = this.scheduleData.findIndex(event => event.id === eventId);
    if (index !== -1) {
      this.scheduleData[index] = { ...this.scheduleData[index], ...updates };
      this.notify();
      return true;
    }
    return false;
  }

  // Delete schedule event
  deleteScheduleEvent(eventId: string): boolean {
    const index = this.scheduleData.findIndex(event => event.id === eventId);
    if (index !== -1) {
      this.scheduleData.splice(index, 1);
      this.notify();
      return true;
    }
    return false;
  }
}