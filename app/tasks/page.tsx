'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function TasksPage() {
  const router = useRouter();
  const [userRole, setUserRole] = React.useState<'employee' | 'manager'>('employee');
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<any>(null);
  const [newTask, setNewTask] = React.useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    attachments: [] as File[]
  });

  // Mock task data
  const employeeTasks = [
    {
      id: 1,
      title: 'Complete Q3 Performance Review',
      description: 'Fill out self-assessment form and submit performance review documents',
      dueDate: '2024-09-25',
      priority: 'high',
      status: 'in-progress',
      progress: 60,
      assignedBy: 'Sarah Johnson',
      comments: [
        { author: 'Sarah Johnson', text: 'Please focus on achievements section', date: '2024-09-15' }
      ]
    },
    {
      id: 2,
      title: 'Update Employee Handbook Acknowledgment',
      description: 'Review and acknowledge the updated employee handbook',
      dueDate: '2024-09-20',
      priority: 'medium',
      status: 'completed',
      progress: 100,
      assignedBy: 'HR Team'
    },
    {
      id: 3,
      title: 'Submit Monthly Expense Report',
      description: 'Upload receipts and submit monthly expense report for August',
      dueDate: '2024-09-30',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      assignedBy: 'Finance Team'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignTask = () => {
    // Mock task assignment
    console.log('Assigning task:', newTask);
    setShowAssignModal(false);
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      attachments: []
    });
    // In real app: API call to create task and send notification
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewTask(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)]
      }));
    }
  };

  // Employee View
  if (userRole === 'employee') {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Header with Role Switch */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-600">Manage your assigned tasks and track progress</p>
            </div>
            
            {/* Demo Role Switch */}
            <button
              onClick={() => setUserRole('manager')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Switch to Manager View
            </button>
          </div>

          {/* Task Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-50">
                  <span className="text-blue-600 text-xl">📋</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-50">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-50">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-50">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {employeeTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span>👤 Assigned by: {task.assignedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Detail Modal */}
          {selectedTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h3>
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Task Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedTask.description}</p>
                  </div>
                  
                  {/* Task Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Due Date</h4>
                      <p className="text-gray-600">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Priority</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Checklist */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Progress Checklist</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" checked={selectedTask.progress >= 25} className="mr-2" readOnly />
                        <span className={selectedTask.progress >= 25 ? 'text-gray-600' : 'text-gray-400'}>Review task requirements</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={selectedTask.progress >= 50} className="mr-2" readOnly />
                        <span className={selectedTask.progress >= 50 ? 'text-gray-600' : 'text-gray-400'}>Begin task execution</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={selectedTask.progress >= 75} className="mr-2" readOnly />
                        <span className={selectedTask.progress >= 75 ? 'text-gray-600' : 'text-gray-400'}>Complete draft/initial work</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={selectedTask.progress >= 100} className="mr-2" readOnly />
                        <span className={selectedTask.progress >= 100 ? 'text-gray-600' : 'text-gray-400'}>Final review and submission</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Comments */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Comments</h4>
                    <div className="space-y-3">
                      {selectedTask.comments?.map((comment: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-gray-600">{comment.text}</p>
                        </div>
                      ))}
                      
                      {/* Add Comment */}
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          placeholder="Add a comment..." 
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Attachments */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Attachments</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <span className="text-gray-500">📎 No attachments yet</span>
                      <input type="file" multiple className="hidden" />
                      <button className="block mt-2 text-primary-600 hover:text-primary-700 text-sm">
                        Upload files
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Update Progress
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Manager View
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Assign and manage team tasks</p>
          </div>
          
          <div className="flex space-x-3">
            {/* Demo Role Switch */}
            <button
              onClick={() => setUserRole('employee')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Switch to Employee View
            </button>
            
            {/* Assign Task Button */}
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Assign Task</span>
            </button>
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-50">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-50">
                <span className="text-green-600 text-xl">📋</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-50">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Due This Week</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-50">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Task Assignments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{task.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign Task Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAssignModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Assign New Task</h3>
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={e => { e.preventDefault(); handleAssignTask(); }} className="space-y-6">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                    placeholder="Enter task description"
                    required
                  />
                </div>
                
                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee(s)</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select employee</option>
                    <option value="john-doe">John Doe</option>
                    <option value="jane-smith">Jane Smith</option>
                    <option value="mike-johnson">Mike Johnson</option>
                    <option value="sarah-wilson">Sarah Wilson</option>
                  </select>
                </div>
                
                {/* Due Date and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block text-center">
                      <span className="text-gray-500">📎 Click to upload files or drag and drop</span>
                    </label>
                    {newTask.attachments.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {newTask.attachments.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}