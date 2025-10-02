// Test Connection between Dashboard and Attendance
import { SharedAttendanceService } from '../services/AttendanceService';

// Test the shared service
const service = SharedAttendanceService.getInstance();

console.log('Testing Shared Attendance Service:');
console.log('Today\'s attendance:', service.getTodayAttendance());
console.log('Schedule events for today:', service.getScheduleEvents(new Date()));
console.log('Monthly stats:', service.getMonthlyStats(new Date().getFullYear(), new Date().getMonth()));

// Test clock in/out functionality
service.clockIn('09:15');
console.log('After clock in:', service.getTodayAttendance());

// Test attendance record update
const today = new Date().toISOString().split('T')[0];
const todayRecord = service.getAttendanceRecord(today);
console.log('Today\'s record:', todayRecord);

export default function TestConnection() {
  return null;
}