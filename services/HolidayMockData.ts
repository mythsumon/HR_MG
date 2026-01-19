// Mock data for Holiday Management

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'Public Holiday' | 'Company Holiday' | 'Optional / Observance';
  appliesTo: 'All Employees' | string;
  description?: string;
  status: 'upcoming' | 'today' | 'past';
}

// Get current date and calculate dates relative to today
const today = new Date();
const getDateString = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const getStatus = (date: string): 'upcoming' | 'today' | 'past' => {
  const todayStr = today.toISOString().split('T')[0];
  if (date === todayStr) return 'today';
  if (date > todayStr) return 'upcoming';
  return 'past';
};

export const mockHolidays: Holiday[] = [
  // Past Holidays
  {
    id: 'H001',
    name: 'New Year\'s Day',
    date: getDateString(-30),
    type: 'Public Holiday',
    appliesTo: 'All Employees',
    description: 'New Year celebration',
    status: getStatus(getDateString(-30))
  },
  {
    id: 'H002',
    name: 'Independence Day',
    date: getDateString(-15),
    type: 'Public Holiday',
    appliesTo: 'All Employees',
    description: 'National independence day',
    status: getStatus(getDateString(-15))
  },
  {
    id: 'H003',
    name: 'Company Foundation Day',
    date: getDateString(-10),
    type: 'Company Holiday',
    appliesTo: 'All Employees',
    description: 'Company anniversary celebration',
    status: getStatus(getDateString(-10))
  },
  
  // Upcoming Holidays
  {
    id: 'H004',
    name: 'Christmas Day',
    date: getDateString(10),
    type: 'Public Holiday',
    appliesTo: 'All Employees',
    description: 'Christmas celebration',
    status: getStatus(getDateString(10))
  },
  {
    id: 'H005',
    name: 'New Year\'s Eve',
    date: getDateString(15),
    type: 'Public Holiday',
    appliesTo: 'All Employees',
    description: 'Year-end celebration',
    status: getStatus(getDateString(15))
  },
  {
    id: 'H006',
    name: 'New Year\'s Day',
    date: getDateString(16),
    type: 'Public Holiday',
    appliesTo: 'All Employees',
    description: 'New Year celebration',
    status: getStatus(getDateString(16))
  },
  {
    id: 'H007',
    name: 'Spring Festival',
    date: getDateString(25),
    type: 'Public Holiday',
    appliesTo: 'All Employees',
    description: 'Traditional spring festival',
    status: getStatus(getDateString(25))
  },
  {
    id: 'H008',
    name: 'Company Retreat Day',
    date: getDateString(20),
    type: 'Company Holiday',
    appliesTo: 'All Employees',
    description: 'Annual company team building',
    status: getStatus(getDateString(20))
  },
  {
    id: 'H009',
    name: 'Labor Day',
    date: getDateString(30),
    type: 'Public Holiday',
    appliesTo: 'All Employees',
    description: 'International Labor Day',
    status: getStatus(getDateString(30))
  },
  {
    id: 'H010',
    name: 'Memorial Day',
    date: getDateString(35),
    type: 'Optional / Observance',
    appliesTo: 'All Employees',
    description: 'Memorial observance',
    status: getStatus(getDateString(35))
  }
];

