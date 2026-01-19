// Comprehensive mock data for Leave Management

export interface LeaveRequest {
  id: string;
  employee: string;
  employeeId: string;
  department: string;
  leaveType: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  startDate: string;
  endDate: string;
  duration: number;
  reason?: string;
  requestedOn: string;
  approvedBy?: string;
  approvedByRole?: string;
  approvedOn?: string;
  rejectedBy?: string;
  rejectedByRole?: string;
  rejectedOn?: string;
  rejectionReason?: string;
}

// Get current date and calculate dates relative to today
const today = new Date();
const getDateString = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const getDateTimeString = (daysOffset: number, hours: number = 10, minutes: number = 0) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const mockLeaveRequests: LeaveRequest[] = [
  // Pending Requests (Current Month)
  {
    id: 'LR001',
    employee: 'John Smith',
    employeeId: 'EMP001',
    department: 'Operations',
    leaveType: 'Annual Leave',
    date: getDateString(5),
    status: 'pending',
    startDate: getDateString(5),
    endDate: getDateString(9),
    duration: 5,
    reason: 'Family vacation during holidays',
    requestedOn: getDateTimeString(-5, 10, 0)
  },
  {
    id: 'LR002',
    employee: 'Sarah Johnson',
    employeeId: 'EMP002',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    date: getDateString(2),
    status: 'pending',
    startDate: getDateString(2),
    endDate: getDateString(3),
    duration: 2,
    reason: 'Medical appointment and recovery',
    requestedOn: getDateTimeString(-1, 14, 30)
  },
  {
    id: 'LR003',
    employee: 'Mike Chen',
    employeeId: 'EMP003',
    department: 'Marketing',
    leaveType: 'Casual Leave',
    date: getDateString(1),
    status: 'pending',
    startDate: getDateString(1),
    endDate: getDateString(1),
    duration: 1,
    reason: 'Personal day',
    requestedOn: getDateTimeString(-2, 9, 15)
  },
  {
    id: 'LR004',
    employee: 'Emily Rodriguez',
    employeeId: 'EMP004',
    department: 'HR',
    leaveType: 'Annual Leave',
    date: getDateString(7),
    status: 'pending',
    startDate: getDateString(7),
    endDate: getDateString(10),
    duration: 4,
    reason: 'Extended weekend trip',
    requestedOn: getDateTimeString(-3, 11, 0)
  },
  {
    id: 'LR005',
    employee: 'David Wilson',
    employeeId: 'EMP005',
    department: 'Finance',
    leaveType: 'Sick Leave',
    date: getDateString(0),
    status: 'pending',
    startDate: getDateString(0),
    endDate: getDateString(0),
    duration: 1,
    reason: 'Feeling unwell',
    requestedOn: getDateTimeString(-1, 8, 0)
  },
  {
    id: 'LR006',
    employee: 'Lisa Park',
    employeeId: 'EMP006',
    department: 'Design',
    leaveType: 'Annual Leave',
    date: getDateString(12),
    status: 'pending',
    startDate: getDateString(12),
    endDate: getDateString(15),
    duration: 4,
    reason: 'Year-end vacation',
    requestedOn: getDateTimeString(-4, 13, 45)
  },
  {
    id: 'LR007',
    employee: 'Robert Taylor',
    employeeId: 'EMP007',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    date: getDateString(5),
    status: 'pending',
    startDate: getDateString(5),
    endDate: getDateString(6),
    duration: 2,
    reason: 'Personal matters',
    requestedOn: getDateTimeString(-3, 9, 0)
  },
  {
    id: 'LR008',
    employee: 'Jennifer Lee',
    employeeId: 'EMP008',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    date: getDateString(2),
    status: 'pending',
    startDate: getDateString(2),
    endDate: getDateString(2),
    duration: 1,
    reason: 'Doctor appointment',
    requestedOn: getDateTimeString(-1, 10, 30)
  },
  {
    id: 'LR009',
    employee: 'Michael Brown',
    employeeId: 'EMP009',
    department: 'Operations',
    leaveType: 'Casual Leave',
    date: getDateString(8),
    status: 'pending',
    startDate: getDateString(8),
    endDate: getDateString(8),
    duration: 1,
    reason: 'Family event',
    requestedOn: getDateTimeString(-2, 15, 20)
  },
  {
    id: 'LR010',
    employee: 'Amanda White',
    employeeId: 'EMP010',
    department: 'HR',
    leaveType: 'Unpaid Leave',
    date: getDateString(10),
    status: 'pending',
    startDate: getDateString(10),
    endDate: getDateString(11),
    duration: 2,
    reason: 'Personal emergency',
    requestedOn: getDateTimeString(-1, 16, 0)
  },

  // Approved Requests
  {
    id: 'LR011',
    employee: 'Thomas Anderson',
    employeeId: 'EMP011',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    date: getDateString(-5),
    status: 'approved',
    startDate: getDateString(-5),
    endDate: getDateString(-3),
    duration: 3,
    reason: 'Extended weekend trip',
    requestedOn: getDateTimeString(-10, 11, 0),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-9, 15, 30)
  },
  {
    id: 'LR012',
    employee: 'Jessica Martinez',
    employeeId: 'EMP012',
    department: 'Design',
    leaveType: 'Sick Leave',
    date: getDateString(-3),
    status: 'approved',
    startDate: getDateString(-3),
    endDate: getDateString(-3),
    duration: 1,
    reason: 'Flu symptoms',
    requestedOn: getDateTimeString(-4, 8, 0),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-4, 10, 20)
  },
  {
    id: 'LR013',
    employee: 'Christopher Davis',
    employeeId: 'EMP013',
    department: 'Finance',
    leaveType: 'Annual Leave',
    date: getDateString(-10),
    status: 'approved',
    startDate: getDateString(-10),
    endDate: getDateString(-8),
    duration: 3,
    reason: 'Family gathering',
    requestedOn: getDateTimeString(-12, 13, 0),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-11, 14, 15)
  },
  {
    id: 'LR014',
    employee: 'Patricia Garcia',
    employeeId: 'EMP014',
    department: 'Marketing',
    leaveType: 'Casual Leave',
    date: getDateString(-7),
    status: 'approved',
    startDate: getDateString(-7),
    endDate: getDateString(-7),
    duration: 1,
    reason: 'Personal day',
    requestedOn: getDateTimeString(-8, 9, 30),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-8, 11, 0)
  },
  {
    id: 'LR015',
    employee: 'Daniel Miller',
    employeeId: 'EMP015',
    department: 'Operations',
    leaveType: 'Annual Leave',
    date: getDateString(15),
    status: 'approved',
    startDate: getDateString(15),
    endDate: getDateString(18),
    duration: 4,
    reason: 'Holiday vacation',
    requestedOn: getDateTimeString(-7, 10, 0),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-6, 16, 0)
  },
  {
    id: 'LR016',
    employee: 'Linda Wilson',
    employeeId: 'EMP016',
    department: 'HR',
    leaveType: 'Sick Leave',
    date: getDateString(-2),
    status: 'approved',
    startDate: getDateString(-2),
    endDate: getDateString(-2),
    duration: 1,
    reason: 'Medical checkup',
    requestedOn: getDateTimeString(-3, 7, 30),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-3, 9, 15)
  },
  {
    id: 'LR017',
    employee: 'James Moore',
    employeeId: 'EMP017',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    date: getDateString(20),
    status: 'approved',
    startDate: getDateString(20),
    endDate: getDateString(22),
    duration: 3,
    reason: 'Weekend getaway',
    requestedOn: getDateTimeString(-5, 12, 0),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-4, 14, 30)
  },
  {
    id: 'LR018',
    employee: 'Barbara Taylor',
    employeeId: 'EMP018',
    department: 'Design',
    leaveType: 'Casual Leave',
    date: getDateString(-1),
    status: 'approved',
    startDate: getDateString(-1),
    endDate: getDateString(-1),
    duration: 1,
    reason: 'Family event',
    requestedOn: getDateTimeString(-2, 8, 45),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-2, 10, 0)
  },

  // Rejected Requests
  {
    id: 'LR019',
    employee: 'William Jackson',
    employeeId: 'EMP019',
    department: 'Finance',
    leaveType: 'Annual Leave',
    date: getDateString(-15),
    status: 'rejected',
    startDate: getDateString(-15),
    endDate: getDateString(-13),
    duration: 3,
    reason: 'Team capacity issue',
    requestedOn: getDateTimeString(-18, 13, 45),
    rejectedBy: 'Sarah Johnson',
    rejectedByRole: 'Manager',
    rejectedOn: getDateTimeString(-17, 16, 0),
    rejectionReason: 'Critical project deadline during this period'
  },
  {
    id: 'LR020',
    employee: 'Elizabeth Harris',
    employeeId: 'EMP020',
    department: 'Marketing',
    leaveType: 'Annual Leave',
    date: getDateString(25),
    status: 'rejected',
    startDate: getDateString(25),
    endDate: getDateString(28),
    duration: 4,
    reason: 'Year-end vacation',
    requestedOn: getDateTimeString(-6, 11, 0),
    rejectedBy: 'Sarah Johnson',
    rejectedByRole: 'Manager',
    rejectedOn: getDateTimeString(-5, 15, 30),
    rejectionReason: 'Too many team members already on leave during this period'
  },
  {
    id: 'LR021',
    employee: 'Richard Clark',
    employeeId: 'EMP021',
    department: 'Operations',
    leaveType: 'Annual Leave',
    date: getDateString(-20),
    status: 'rejected',
    startDate: getDateString(-20),
    endDate: getDateString(-18),
    duration: 3,
    reason: 'Personal trip',
    requestedOn: getDateTimeString(-22, 10, 30),
    rejectedBy: 'Sarah Johnson',
    rejectedByRole: 'Manager',
    rejectedOn: getDateTimeString(-21, 14, 0),
    rejectionReason: 'Insufficient notice period'
  },

  // Multiple requests on same dates (for calendar testing)
  {
    id: 'LR022',
    employee: 'Susan Lewis',
    employeeId: 'EMP022',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    date: getDateString(5),
    status: 'pending',
    startDate: getDateString(5),
    endDate: getDateString(5),
    duration: 1,
    reason: 'Medical appointment',
    requestedOn: getDateTimeString(-2, 9, 0)
  },
  {
    id: 'LR023',
    employee: 'Joseph Walker',
    employeeId: 'EMP023',
    department: 'Design',
    leaveType: 'Casual Leave',
    date: getDateString(5),
    status: 'pending',
    startDate: getDateString(5),
    endDate: getDateString(5),
    duration: 1,
    reason: 'Personal day',
    requestedOn: getDateTimeString(-1, 14, 0)
  },
  {
    id: 'LR024',
    employee: 'Nancy Hall',
    employeeId: 'EMP024',
    department: 'HR',
    leaveType: 'Annual Leave',
    date: getDateString(2),
    status: 'approved',
    startDate: getDateString(2),
    endDate: getDateString(2),
    duration: 1,
    reason: 'Family event',
    requestedOn: getDateTimeString(-5, 10, 0),
    approvedBy: 'Sarah Johnson',
    approvedByRole: 'Manager',
    approvedOn: getDateTimeString(-4, 11, 30)
  },
  {
    id: 'LR025',
    employee: 'Kevin Allen',
    employeeId: 'EMP025',
    department: 'Finance',
    leaveType: 'Sick Leave',
    date: getDateString(2),
    status: 'pending',
    startDate: getDateString(2),
    endDate: getDateString(2),
    duration: 1,
    reason: 'Feeling unwell',
    requestedOn: getDateTimeString(-1, 8, 30)
  }
];

// Additional employees for more variety
export const additionalEmployees = [
  { id: 'EMP011', name: 'Thomas Anderson', department: 'Engineering' },
  { id: 'EMP012', name: 'Jessica Martinez', department: 'Design' },
  { id: 'EMP013', name: 'Christopher Davis', department: 'Finance' },
  { id: 'EMP014', name: 'Patricia Garcia', department: 'Marketing' },
  { id: 'EMP015', name: 'Daniel Miller', department: 'Operations' },
  { id: 'EMP016', name: 'Linda Wilson', department: 'HR' },
  { id: 'EMP017', name: 'James Moore', department: 'Engineering' },
  { id: 'EMP018', name: 'Barbara Taylor', department: 'Design' },
  { id: 'EMP019', name: 'William Jackson', department: 'Finance' },
  { id: 'EMP020', name: 'Elizabeth Harris', department: 'Marketing' },
  { id: 'EMP021', name: 'Richard Clark', department: 'Operations' },
  { id: 'EMP022', name: 'Susan Lewis', department: 'Engineering' },
  { id: 'EMP023', name: 'Joseph Walker', department: 'Design' },
  { id: 'EMP024', name: 'Nancy Hall', department: 'HR' },
  { id: 'EMP025', name: 'Kevin Allen', department: 'Finance' }
];


