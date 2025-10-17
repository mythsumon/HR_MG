'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';

export default function CreatePayrollPage() {
  const [payrollData, setPayrollData] = useState({
    payPeriod: '',
    payDate: '',
    department: '',
    employmentType: 'full-time',
    baseSalary: '',
    overtimeHours: '',
    overtimeRate: '',
    allowances: [{ name: '', amount: '' }],
    deductions: [{ name: '', amount: '' }],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPayrollData(prev => ({ ...prev, [name]: value }));
  };

  const handleAllowanceChange = (index: number, field: string, value: string) => {
    const newAllowances = [...payrollData.allowances];
    newAllowances[index] = { ...newAllowances[index], [field]: value };
    setPayrollData(prev => ({ ...prev, allowances: newAllowances }));
  };

  const handleDeductionChange = (index: number, field: string, value: string) => {
    const newDeductions = [...payrollData.deductions];
    newDeductions[index] = { ...newDeductions[index], [field]: value };
    setPayrollData(prev => ({ ...prev, deductions: newDeductions }));
  };

  const addAllowance = () => {
    setPayrollData(prev => ({
      ...prev,
      allowances: [...prev.allowances, { name: '', amount: '' }]
    }));
  };

  const addDeduction = () => {
    setPayrollData(prev => ({
      ...prev,
      deductions: [...prev.deductions, { name: '', amount: '' }]
    }));
  };

  const removeAllowance = (index: number) => {
    setPayrollData(prev => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index)
    }));
  };

  const removeDeduction = (index: number) => {
    setPayrollData(prev => ({
      ...prev,
      deductions: prev.deductions.filter((_, i) => i !== index)
    }));
  };

  const calculateOvertime = () => {
    const hours = parseFloat(payrollData.overtimeHours) || 0;
    const rate = parseFloat(payrollData.overtimeRate) || 0;
    return hours * rate;
  };

  const calculateAllowances = () => {
    return payrollData.allowances.reduce((sum, allowance) => {
      return sum + (parseFloat(allowance.amount) || 0);
    }, 0);
  };

  const calculateDeductions = () => {
    return payrollData.deductions.reduce((sum, deduction) => {
      return sum + (parseFloat(deduction.amount) || 0);
    }, 0);
  };

  const calculateGrossPay = () => {
    const base = parseFloat(payrollData.baseSalary) || 0;
    const overtime = calculateOvertime();
    const allowances = calculateAllowances();
    return base + overtime + allowances;
  };

  const calculateNetPay = () => {
    const gross = calculateGrossPay();
    const deductions = calculateDeductions();
    return gross - deductions;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payroll data submitted:', payrollData);
    // Here you would typically send the data to your backend
    alert('Payroll entry created successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Payroll Entry</h1>
            <p className="text-gray-600 dark:text-gray-400">Add a new payroll entry for an employee</p>
          </div>
          <a 
            href="/payroll" 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Payroll
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pay Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pay Period
                </label>
                <select
                  name="payPeriod"
                  value={payrollData.payPeriod}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select pay period</option>
                  <option value="monthly">Monthly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {/* Pay Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pay Date
                </label>
                <input
                  type="date"
                  name="payDate"
                  value={payrollData.payDate}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={payrollData.department}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select department</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={payrollData.employmentType}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              {/* Base Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Base Salary ($)
                </label>
                <input
                  type="number"
                  name="baseSalary"
                  value={payrollData.baseSalary}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Overtime */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white md:col-span-2">Overtime</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hours
                </label>
                <input
                  type="number"
                  name="overtimeHours"
                  value={payrollData.overtimeHours}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                  step="0.1"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rate ($/hour)
                </label>
                <input
                  type="number"
                  name="overtimeRate"
                  value={payrollData.overtimeRate}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Allowances */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Allowances</h3>
                <button
                  type="button"
                  onClick={addAllowance}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  + Add Allowance
                </button>
              </div>
              
              {payrollData.allowances.map((allowance, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <input
                      type="text"
                      value={allowance.name}
                      onChange={(e) => handleAllowanceChange(index, 'name', e.target.value)}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Allowance name"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={allowance.amount}
                      onChange={(e) => handleAllowanceChange(index, 'amount', e.target.value)}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    {payrollData.allowances.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAllowance(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Deductions */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deductions</h3>
                <button
                  type="button"
                  onClick={addDeduction}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  + Add Deduction
                </button>
              </div>
              
              {payrollData.deductions.map((deduction, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <input
                      type="text"
                      value={deduction.name}
                      onChange={(e) => handleDeductionChange(index, 'name', e.target.value)}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Deduction name"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={deduction.amount}
                      onChange={(e) => handleDeductionChange(index, 'amount', e.target.value)}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    {payrollData.deductions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeduction(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payroll Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600 dark:text-gray-400">Base Salary:</span>
                    <span className="font-medium">${parseFloat(payrollData.baseSalary) || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600 dark:text-gray-400">Overtime:</span>
                    <span className="font-medium">${calculateOvertime()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600 dark:text-gray-400">Allowances:</span>
                    <span className="font-medium">${calculateAllowances()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-gray-200 dark:border-gray-700 font-semibold">
                    <span>Gross Pay:</span>
                    <span>${calculateGrossPay()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600 dark:text-gray-400">Deductions:</span>
                    <span className="font-medium text-red-600">-${calculateDeductions()}</span>
                  </div>
                  <div className="flex justify-between py-1 mt-4 border-t border-gray-200 dark:border-gray-700 font-bold text-lg">
                    <span>Net Pay:</span>
                    <span className="text-green-600">${calculateNetPay()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Create Payroll Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}