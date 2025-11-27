'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';

interface Office {
  id: string;
  name: string;
  location: string;
  clockIn: string;
  clockOut: string;
  workingHours: string;
  status: 'active' | 'inactive';
  employees: number;
}

const mockOffices: Office[] = [
  {
    id: '1',
    name: 'Main Office',
    location: '123 Business District, City Center',
    clockIn: '08:00 AM',
    clockOut: '05:00 PM',
    workingHours: '9h',
    status: 'active',
    employees: 42
  },
  {
    id: '2',
    name: 'Downtown Branch',
    location: '456 Downtown Ave, Financial District',
    clockIn: '09:00 AM',
    clockOut: '06:00 PM',
    workingHours: '9h',
    status: 'active',
    employees: 28
  },
  {
    id: '3',
    name: 'Tech Hub',
    location: '789 Innovation Blvd, Tech Park',
    clockIn: '10:00 AM',
    clockOut: '07:00 PM',
    workingHours: '9h',
    status: 'inactive',
    employees: 0
  }
];

export default function OfficeManagementPage() {
  const [offices, setOffices] = useState<Office[]>(mockOffices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    clockIn: '09:00 AM',
    clockOut: '06:00 PM',
    workingHours: '9h',
    status: 'active' as 'active' | 'inactive'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOffice) {
      // Update existing office
      setOffices(offices.map(office => 
        office.id === editingOffice.id 
          ? { ...office, ...formData } 
          : office
      ));
      setEditingOffice(null);
    } else {
      // Add new office
      const newOffice: Office = {
        id: (offices.length + 1).toString(),
        ...formData,
        employees: 0
      };
      setOffices([...offices, newOffice]);
    }
    
    // Reset form
    setFormData({
      name: '',
      location: '',
      clockIn: '09:00 AM',
      clockOut: '06:00 PM',
      workingHours: '9h',
      status: 'active'
    });
    setShowAddForm(false);
  };

  const handleEdit = (office: Office) => {
    setEditingOffice(office);
    setFormData({
      name: office.name,
      location: office.location,
      clockIn: office.clockIn,
      clockOut: office.clockOut,
      workingHours: office.workingHours,
      status: office.status
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this office?')) {
      setOffices(offices.filter(office => office.id !== id));
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingOffice(null);
    setFormData({
      name: '',
      location: '',
      clockIn: '09:00 AM',
      clockOut: '06:00 PM',
      workingHours: '9h',
      status: 'active'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Office Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your organization's office locations and working hours</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
          >
            <span>+</span>
            <span className="ml-2">Add New Office</span>
          </button>
        </div>

        {/* Add/Edit Office Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingOffice ? 'Edit Office' : 'Add New Office'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Office Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Clock In Time
                  </label>
                  <input
                    type="text"
                    name="clockIn"
                    value={formData.clockIn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Clock Out Time
                  </label>
                  <input
                    type="text"
                    name="clockOut"
                    value={formData.clockOut}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingOffice ? 'Update Office' : 'Add Office'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Offices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map((office) => (
            <div 
              key={office.id} 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 ${
                office.status === 'inactive' 
                  ? 'border-gray-300 dark:border-gray-600 opacity-70' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{office.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{office.location}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  office.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {office.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Clock In</span>
                  <span className="font-medium text-gray-900 dark:text-white">{office.clockIn}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Clock Out</span>
                  <span className="font-medium text-gray-900 dark:text-white">{office.clockOut}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Working Hours</span>
                  <span className="font-medium text-gray-900 dark:text-white">{office.workingHours}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Location</span>
                  <span className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]" title={office.location}>
                    {office.name}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600 dark:text-gray-400">Employees</span>
                  <span className="font-medium text-gray-900 dark:text-white">{office.employees}</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleEdit(office)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(office.id)}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {offices.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No offices found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first office location
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add Office
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}