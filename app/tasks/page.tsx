'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  assignedBy: string;
  comments?: Array<{ author: string; text: string; date: string }>;
}

export default function TasksPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'employee' | 'manager'>('employee');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'mobile'>('kanban');
  const [activeTab, setActiveTab] = useState('pending');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
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
    },
    {
      id: 4,
      title: 'Security Training Completion',
      description: 'Complete mandatory cybersecurity training modules',
      dueDate: '2024-10-15',
      priority: 'high',
      status: 'failed',
      progress: 25,
      assignedBy: 'IT Security Team'
    },
    {
      id: 5,
      title: 'Team Building Event Planning',
      description: 'Organize quarterly team building activities',
      dueDate: '2024-10-05',
      priority: 'low',
      status: 'pending',
      progress: 0,
      assignedBy: 'HR Team'
    }
  ]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    attachments: [] as File[]
  });

  // Filter and search logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    const matchesTime = filterTime === 'all' || (() => {
      const taskDate = new Date(task.dueDate);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      switch (filterTime) {
        case 'this-week':
          return taskDate <= weekFromNow;
        case 'overdue':
          return taskDate < now && task.status !== 'completed';
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesTime;
  });

  // Group tasks by status
  const tasksByStatus = {
    pending: filteredTasks.filter(task => task.status === 'pending'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    completed: filteredTasks.filter(task => task.status === 'completed'),
    failed: filteredTasks.filter(task => task.status === 'failed')
  };

  // Check screen size for mobile view
  React.useEffect(() => {
    const checkScreenSize = () => {
      setViewMode(window.innerWidth < 768 ? 'mobile' : 'kanban');
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(prev => prev.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : task.progress }
          : task
      ));
    }
    setDraggedTask(null);
  };

  const handleAddTask = () => {
    const newTaskItem: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority as 'high' | 'medium' | 'low',
      status: 'pending',
      progress: 0,
      assignedBy: 'Self-assigned'
    };
    
    setTasks(prev => [...prev, newTaskItem]);
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      attachments: []
    });
    setShowAddTaskModal(false);
  };

  // Task Card Component
  const TaskCard = ({ task }: { task: Task }) => {
    const getStatusColors = (status: Task['status']) => {
      switch (status) {
        case 'pending': return 'border-l-gray-400 bg-gray-50';
        case 'in-progress': return 'border-l-blue-500 bg-blue-50';
        case 'completed': return 'border-l-green-500 bg-green-50';
        case 'failed': return 'border-l-red-500 bg-red-50';
        default: return 'border-l-gray-400 bg-gray-50';
      }
    };

    const getPriorityColors = (priority: Task['priority']) => {
      switch (priority) {
        case 'high': return 'bg-red-100 text-red-700 border-red-200';
        case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    return (
      <div 
        className={`bg-white rounded-lg shadow-sm border-l-4 p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 ${getStatusColors(task.status)}`}
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onClick={() => setSelectedTask(task)}
      >
        {/* Task Header */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 mb-2 leading-tight">{task.title}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColors(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <span className="text-xs text-gray-500">
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Task Body */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Assigned By */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">
            👤 {task.assignedBy}
          </span>
        </div>

        {/* Footer Buttons */}
        <div className="flex space-x-2">
          <button 
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask(task);
            }}
          >
            View
          </button>
          <button 
            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask(task);
            }}
          >
            Update
          </button>
        </div>
      </div>
    );
  };

  // Column Component
  const Column = ({ title, status, tasks: columnTasks, color, emoji }: {
    title: string;
    status: Task['status'];
    tasks: Task[];
    color: string;
    emoji: string;
  }) => (
    <div 
      className="bg-gray-50 rounded-lg p-4 min-h-96"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <span className="mr-2">{emoji}</span>
          {title}
        </h3>
        <span className={`${color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
          {columnTasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {columnTasks.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );

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

  // Employee View - New Kanban Interface
  if (userRole === 'employee') {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-gray-600">Manage and track your assigned tasks</p>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Status Filter */}
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All ▾</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Time Filter */}
                <select 
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time ▾</option>
                  <option value="this-week">This Week</option>
                  <option value="overdue">Overdue</option>
                </select>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
                </div>

                {/* Add Task Button */}
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <span>➕</span>
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile View - Tabs */}
          {viewMode === 'mobile' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                {[
                  { key: 'pending', label: 'Pending', count: tasksByStatus.pending.length, emoji: '🟤' },
                  { key: 'in-progress', label: 'Progress', count: tasksByStatus['in-progress'].length, emoji: '🔵' },
                  { key: 'completed', label: 'Complete', count: tasksByStatus.completed.length, emoji: '🟢' },
                  { key: 'failed', label: 'Failed', count: tasksByStatus.failed.length, emoji: '🔴' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-1">{tab.emoji}</span>
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4">
                <div className="space-y-3">
                  {tasksByStatus[activeTab as keyof typeof tasksByStatus].map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {tasksByStatus[activeTab as keyof typeof tasksByStatus].length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <p>No tasks in this category</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Desktop View - Kanban Board */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Column 
                title="Pending" 
                status="pending" 
                tasks={tasksByStatus.pending}
                color="bg-gray-500"
                emoji="🟤"
              />
              <Column 
                title="In Progress" 
                status="in-progress" 
                tasks={tasksByStatus['in-progress']}
                color="bg-blue-500"
                emoji="🔵"
              />
              <Column 
                title="Complete" 
                status="completed" 
                tasks={tasksByStatus.completed}
                color="bg-green-500"
                emoji="🟢"
              />
              <Column 
                title="Failed" 
                status="failed" 
                tasks={tasksByStatus.failed}
                color="bg-red-500"
                emoji="🔴"
              />
            </div>
          )}

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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        selectedTask.priority === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                        selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-green-100 text-green-700 border-green-200'
                      }`}>
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
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
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
                      <button className="block mt-2 text-blue-600 hover:text-blue-700 text-sm">
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
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Update Progress
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Task Modal */}
          {showAddTaskModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddTaskModal(false)}>
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Task</h3>
                  <button 
                    onClick={() => setShowAddTaskModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={e => { e.preventDefault(); handleAddTask(); }} className="space-y-4">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                      placeholder="Enter task description"
                      required
                    />
                  </div>
                  
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
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowAddTaskModal(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Task
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                {tasks.map((task: Task) => (
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-green-100 text-green-700 border-green-200'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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