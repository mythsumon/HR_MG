// Shared Holiday Service for managing company holidays
'use client';

import { mockHolidays, Holiday } from './HolidayMockData';

export class HolidayService {
  private static instance: HolidayService;
  private holidays: Holiday[] = [];
  private listeners: (() => void)[] = [];

  private constructor() {
    // Initialize with mock data
    this.holidays = [...mockHolidays];
    // Load from localStorage if available
    this.loadFromStorage();
  }

  static getInstance(): HolidayService {
    if (!HolidayService.instance) {
      HolidayService.instance = new HolidayService();
    }
    return HolidayService.instance;
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('holidays');
      if (stored) {
        try {
          this.holidays = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to load holidays from storage', e);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('holidays', JSON.stringify(this.holidays));
    }
  }

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(callback => callback());
  }

  getAllHolidays(): Holiday[] {
    return [...this.holidays].sort((a, b) => a.date.localeCompare(b.date));
  }

  getHolidayById(id: string): Holiday | null {
    return this.holidays.find(h => h.id === id) || null;
  }

  getHolidaysByDate(date: string): Holiday[] {
    return this.holidays.filter(h => h.date === date);
  }

  addHoliday(holiday: Omit<Holiday, 'id' | 'status'>): Holiday {
    const todayStr = new Date().toISOString().split('T')[0];
    const status: 'upcoming' | 'today' | 'past' = 
      holiday.date === todayStr ? 'today' :
      holiday.date > todayStr ? 'upcoming' : 'past';

    const newHoliday: Holiday = {
      id: `H${String(this.holidays.length + 1).padStart(3, '0')}`,
      ...holiday,
      status
    };

    this.holidays.push(newHoliday);
    this.saveToStorage();
    this.notify();
    return newHoliday;
  }

  updateHoliday(id: string, updates: Partial<Omit<Holiday, 'id'>>): boolean {
    const index = this.holidays.findIndex(h => h.id === id);
    if (index === -1) return false;

    const todayStr = new Date().toISOString().split('T')[0];
    const date = updates.date || this.holidays[index].date;
    const status: 'upcoming' | 'today' | 'past' = 
      date === todayStr ? 'today' :
      date > todayStr ? 'upcoming' : 'past';

    this.holidays[index] = {
      ...this.holidays[index],
      ...updates,
      status
    };

    this.saveToStorage();
    this.notify();
    return true;
  }

  deleteHoliday(id: string): boolean {
    const index = this.holidays.findIndex(h => h.id === id);
    if (index === -1) return false;

    this.holidays.splice(index, 1);
    this.saveToStorage();
    this.notify();
    return true;
  }

  getHolidaysForDateRange(startDate: string, endDate: string): Holiday[] {
    return this.holidays.filter(h => h.date >= startDate && h.date <= endDate);
  }

  isHoliday(date: string): boolean {
    return this.holidays.some(h => h.date === date);
  }
}

