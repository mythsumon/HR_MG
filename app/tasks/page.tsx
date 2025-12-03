'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  Task, 
  Project, 
  StatusChip, 
  PriorityChip, 
  ProgressBar, 
  Avatar, 
  TaskCard, 
  TaskSummaryCard, 
  KanbanColumn 
} from '@/components/TaskComponents';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import Pagination from '@/components/Pagination';

export default function TasksPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'employee' | 'hr'>('employee');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [activeTab, setActiveTab] = useState('pending');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [projects] = useState<Project[]>([
    { id: 'proj-1', name: 'Website Redesign', description: 'Company website overhaul', color: 'bg-blue-100', taskCount: 8 },
    { id: 'proj-2', name: 'Mobile App', description: 'Employee mobile application', color: 'bg-green-100', taskCount: 12 },
    { id: 'proj-3', name: 'HR System', description: 'Internal HR management system', color: 'bg-purple-100', taskCount: 6 },
    { id: 'proj-4', name: 'Marketing Campaign', description: 'Q4 marketing initiatives', color: 'bg-orange-100', taskCount: 4 }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-001',
      title: 'Design Homepage Layout',
      description: 'Create wireframes and mockups for the new homepage design',
      project: 'Website Redesign',
      assignee: { id: 'emp-1', name: 'John Doe', avatar: undefined },
      dueDate: '2024-10-15',
      priority: 'high',
      status: 'in-progress',
      progress: 65,
      estimatedHours: 40,
      actualHours: 26,
      tags: ['design', 'frontend', 'urgent'],
      comments: [
        { id: 'c1', author: 'Sarah Johnson', text: 'Please ensure mobile responsiveness', date: '2024-09-20' }
      ],
      subtasks: [
        { id: 'st1', title: 'Create wireframes', completed: true },
        { id: 'st2', title: 'Design mockups', completed: true },
        { id: 'st3', title: 'Review with team', completed: false }
      ],
      createdBy: 'Sarah Johnson',
      createdAt: '2024-09-15',
      updatedAt: '2024-09-25'
    },
    {
      id: 'task-002',
      title: 'Implement User Authentication',
      description: 'Set up secure login and registration system for mobile app',
      project: 'Mobile App',
      assignee: { id: 'emp-2', name: 'Jane Smith' },
      dueDate: '2024-10-20',
      priority: 'high',
      status: 'pending',
      progress: 0,
      estimatedHours: 60,
      actualHours: 0,
      tags: ['backend', 'security', 'authentication'],
      comments: [],
      subtasks: [
        { id: 'st4', title: 'Set up OAuth', completed: false },
        { id: 'st5', title: 'Implement JWT tokens', completed: false },
        { id: 'st6', title: 'Add password reset', completed: false }
      ],
      createdBy: 'Mike Johnson',
      createdAt: '2024-09-18',
      updatedAt: '2024-09-18'
    },
    {
      id: 'task-003',
      title: 'Employee Onboarding Module',
      description: 'Create digital onboarding process for new employees',
      project: 'HR System',
      assignee: { id: 'emp-3', name: 'Mike Johnson' },
      dueDate: '2024-10-10',
      priority: 'medium',
      status: 'completed',
      progress: 100,
      estimatedHours: 80,
      actualHours: 75,
      tags: ['frontend', 'forms', 'workflow'],
      comments: [
        { id: 'c2', author: 'HR Team', text: 'Great work on the user interface!', date: '2024-09-22' }
      ],
      subtasks: [
        { id: 'st7', title: 'Design form layouts', completed: true },
        { id: 'st8', title: 'Implement validation', completed: true },
        { id: 'st9', title: 'Add document upload', completed: true }
      ],
      createdBy: 'Sarah Johnson',
      createdAt: '2024-08-15',
      updatedAt: '2024-09-22'
    },
    {
      id: 'task-004',
      title: 'Social Media Content Calendar',
      description: 'Plan and schedule Q4 social media content across all platforms',
      project: 'Marketing Campaign',
      assignee: { id: 'emp-4', name: 'Sarah Wilson' },
      dueDate: '2024-09-30',
      priority: 'medium',
      status: 'failed',
      progress: 30,
      estimatedHours: 30,
      actualHours: 12,
      tags: ['marketing', 'content', 'social-media'],
      comments: [
        { id: 'c3', author: 'Marketing Lead', text: 'Need to reschedule due to budget constraints', date: '2024-09-25' }
      ],
      subtasks: [
        { id: 'st10', title: 'Content audit', completed: true },
        { id: 'st11', title: 'Create content calendar', completed: false },
        { id: 'st12', title: 'Schedule posts', completed: false }
      ],
      createdBy: 'Marketing Lead',
      createdAt: '2024-09-01',
      updatedAt: '2024-09-25'
    },
    {
      id: 'task-005',
      title: 'Database Optimization',
      description: 'Optimize database queries and improve performance',
      project: 'Website Redesign',
      assignee: { id: 'emp-5', name: 'Alex Chen' },
      dueDate: '2024-11-01',
      priority: 'low',
      status: 'pending',
      progress: 0,
      estimatedHours: 35,
      actualHours: 0,
      tags: ['backend', 'database', 'performance'],
      comments: [],
      subtasks: [
        { id: 'st13', title: 'Analyze current queries', completed: false },
        { id: 'st14', title: 'Implement indexing', completed: false },
        { id: 'st15', title: 'Test performance', completed: false }
      ],
      createdBy: 'Tech Lead',
      createdAt: '2024-09-20',
      updatedAt: '2024-09-20'
    },
    {
      id: 'task-006',
      title: 'Push Notification System',
      description: 'Implement real-time push notifications for mobile app',
      project: 'Mobile App',
      assignee: { id: 'emp-6', name: 'David Kim' },
      dueDate: '2024-10-25',
      priority: 'medium',
      status: 'in-progress',
      progress: 40,
      estimatedHours: 45,
      actualHours: 18,
      tags: ['mobile', 'notifications', 'realtime'],
      comments: [
        { id: 'c4', author: 'Product Manager', text: 'Focus on user preferences first', date: '2024-09-23' }
      ],
      subtasks: [
        { id: 'st16', title: 'Set up FCM', completed: true },
        { id: 'st17', title: 'Implement notification service', completed: false },
        { id: 'st18', title: 'Add user preferences', completed: false }
      ],
      createdBy: 'Product Manager',
      createdAt: '2024-09-10',
      updatedAt: '2024-09-24'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    estimatedHours: 0,
    tags: '',
    attachments: [] as File[]
  });

  // Filter and search logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesProject = selectedProject === 'all' || task.project === selectedProject;
    
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
    
    // For employee view, only show their own tasks
    const matchesUser = userRole === 'hr' || task.assignee.name === 'John Doe'; // Mock current user
    
    return matchesSearch && matchesStatus && matchesTime && matchesProject && matchesUser;
  });

  // Group tasks by status and project
  const tasksByStatus = {
    pending: filteredTasks.filter(task => task.status === 'pending'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    completed: filteredTasks.filter(task => task.status === 'completed'),
    failed: filteredTasks.filter(task => task.status === 'failed')
  };

  const tasksByProject = projects.reduce((acc, project) => {
    acc[project.name] = filteredTasks.filter(task => task.project === project.name);
    return acc;
  }, {} as Record<string, Task[]>);

  // Calculate analytics
  const analytics = {
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    totalHours: tasks.reduce((sum, t) => sum + t.estimatedHours, 0),
    loggedHours: tasks.reduce((sum, t) => sum + t.actualHours, 0)
  };

  // Auto-detect mobile view
  React.useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setViewMode('list');
      }
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

  const handleDrop = (newStatus: Task['status']) => {
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(prev => prev.map(task => 
        task.id === draggedTask.id 
          ? { 
              ...task, 
              status: newStatus, 
              progress: newStatus === 'completed' ? 100 : task.progress,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : task
      ));
    }
    setDraggedTask(null);
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status, 
            progress: status === 'completed' ? 100 : status === 'pending' ? 0 : task.progress,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : task
    ));
  };

  const handleAddTask = () => {
    const newTaskItem: Task = {
      id: `task-${String(tasks.length + 1).padStart(3, '0')}`,
      title: newTask.title,
      description: newTask.description,
      project: newTask.project,
      assignee: { 
        id: 'emp-new', 
        name: newTask.assignee, 
        avatar: undefined 
      },
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      status: 'pending',
      progress: 0,
      estimatedHours: newTask.estimatedHours,
      actualHours: 0,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      comments: [],
      subtasks: [],
      createdBy: userRole === 'hr' ? 'HR Manager' : 'Self-assigned',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks(prev => [...prev, newTaskItem]);
    setNewTask({
      title: '',
      description: '',
      project: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      estimatedHours: 0,
      tags: '',
      attachments: []
    });
    setShowAddTaskModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewTask(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)]
      }));
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  // Employee View - Personal Task Management
  if (userRole === 'employee') {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Employee Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-gray-600 mt-1">Track and manage your assigned tasks</p>
                <div className="mt-2 text-sm text-gray-500">
                  You have {tasksByStatus.pending.length} pending, {tasksByStatus['in-progress'].length} in progress, {tasksByStatus.completed.length} completed this week.
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setUserRole('hr')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  🏢 Switch to HR View
                </button>
                
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>➕</span>
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Employee Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <TaskSummaryCard 
              title="Pending" 
              value={tasksByStatus.pending.length} 
              icon="🟤" 
              color="bg-gray-50" 
              subtitle="To start"
            />
            <TaskSummaryCard 
              title="In Progress" 
              value={tasksByStatus['in-progress'].length} 
              icon="🔵" 
              color="bg-blue-50" 
              subtitle="Working on"
            />
            <TaskSummaryCard 
              title="Completed" 
              value={tasksByStatus.completed.length} 
              icon="🟢" 
              color="bg-green-50" 
              subtitle="Finished"
            />
            <TaskSummaryCard 
              title="Failed" 
              value={tasksByStatus.failed.length} 
              icon="🔴" 
              color="bg-red-50" 
              subtitle="Cancelled"
            />
          </div>

          {/* Employee Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status ▾</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>

                <select 
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time ▾</option>
                  <option value="this-week">This Week</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'kanban' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    📋 Kanban
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    📝 List
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search my tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Task View */}
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KanbanColumn 
                title="Pending" 
                status="pending" 
                tasks={tasksByStatus.pending}
                viewMode="employee"
                onTaskClick={handleTaskClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
              />
              <KanbanColumn 
                title="In Progress" 
                status="in-progress" 
                tasks={tasksByStatus['in-progress']}
                viewMode="employee"
                onTaskClick={handleTaskClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
              />
              <KanbanColumn 
                title="Completed" 
                status="completed" 
                tasks={tasksByStatus.completed}
                viewMode="employee"
                onTaskClick={handleTaskClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
              />
              <KanbanColumn 
                title="Failed" 
                status="failed" 
                tasks={tasksByStatus.failed}
                viewMode="employee"
                onTaskClick={handleTaskClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
              />
            </div>
          ) : (
            // Mobile-friendly list view with tabs
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200">
                {[
                  { key: 'pending', label: 'Pending', count: tasksByStatus.pending.length },
                  { key: 'in-progress', label: 'Progress', count: tasksByStatus['in-progress'].length },
                  { key: 'completed', label: 'Complete', count: tasksByStatus.completed.length },
                  { key: 'failed', label: 'Failed', count: tasksByStatus.failed.length }
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
                    <StatusChip status={tab.key as Task['status']} size="sm" />
                    <span className="ml-2">({tab.count})</span>
                  </button>
                ))}
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {tasksByStatus[activeTab as keyof typeof tasksByStatus].map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      viewMode="employee"
                      onTaskClick={handleTaskClick}
                      isDraggable={false}
                    />
                  ))}
                  
                  {tasksByStatus[activeTab as keyof typeof tasksByStatus].length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <p className="text-sm">No tasks in this category</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // HR View - Project-based Task Management
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
              <p className="text-gray-600 mt-1">Assign, track, and manage team tasks across projects</p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setUserRole('employee')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                👤 Switch to Employee View
              </button>
              
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Assign Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TaskSummaryCard 
            title="Total Tasks" 
            value={analytics.totalTasks} 
            icon="📋" 
            color="bg-blue-50" 
            subtitle="All projects"
          />
          <TaskSummaryCard 
            title="Active Tasks" 
            value={analytics.activeTasks} 
            icon="🔄" 
            color="bg-amber-50" 
            subtitle="In progress + pending"
          />
          <TaskSummaryCard 
            title="Completed" 
            value={analytics.completedTasks} 
            icon="✅" 
            color="bg-green-50" 
            subtitle="This month"
          />
          <TaskSummaryCard 
            title="Overdue" 
            value={analytics.overdueTasks} 
            icon="⚠️" 
            color="bg-red-50" 
            subtitle="Need attention"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Project Filter */}
              <select 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Projects ▾</option>
                {projects.map(project => (
                  <option key={project.id} value={project.name}>{project.name}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status ▾</option>
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
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'kanban' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📋 Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📝 List
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks, assignees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {viewMode === 'kanban' ? (
          <>
            {/* Project Tabs */}
            {selectedProject === 'all' ? (
              <div className="space-y-8">
                {projects.map(project => {
                  const projectTasks = tasksByProject[project.name] || [];
                  if (projectTasks.length === 0) return null;
                  
                  return (
                    <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${project.color.replace('bg-', 'bg-')}`} />
                          <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                            {projectTasks.length} tasks
                          </span>
                        </div>
                        <p className="text-gray-600">{project.description}</p>
                      </div>
                      
                      {/* Kanban Board for Project */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KanbanColumn 
                          title="Pending" 
                          status="pending" 
                          tasks={projectTasks.filter(t => t.status === 'pending')}
                          viewMode="hr"
                          onTaskClick={handleTaskClick}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragStart={handleDragStart}
                        />
                        <KanbanColumn 
                          title="In Progress" 
                          status="in-progress" 
                          tasks={projectTasks.filter(t => t.status === 'in-progress')}
                          viewMode="hr"
                          onTaskClick={handleTaskClick}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragStart={handleDragStart}
                        />
                        <KanbanColumn 
                          title="Completed" 
                          status="completed" 
                          tasks={projectTasks.filter(t => t.status === 'completed')}
                          viewMode="hr"
                          onTaskClick={handleTaskClick}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragStart={handleDragStart}
                        />
                        <KanbanColumn 
                          title="Failed" 
                          status="failed" 
                          tasks={projectTasks.filter(t => t.status === 'failed')}
                          viewMode="hr"
                          onTaskClick={handleTaskClick}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragStart={handleDragStart}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-4 h-4 rounded-full ${
                    projects.find(p => p.name === selectedProject)?.color || 'bg-gray-400'
                  }`} />
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProject}</h2>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                    {filteredTasks.length} tasks
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KanbanColumn 
                    title="Pending" 
                    status="pending" 
                    tasks={tasksByStatus.pending}
                    viewMode="hr"
                    onTaskClick={handleTaskClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                  />
                  <KanbanColumn 
                    title="In Progress" 
                    status="in-progress" 
                    tasks={tasksByStatus['in-progress']}
                    viewMode="hr"
                    onTaskClick={handleTaskClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                  />
                  <KanbanColumn 
                    title="Completed" 
                    status="completed" 
                    tasks={tasksByStatus.completed}
                    viewMode="hr"
                    onTaskClick={handleTaskClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                  />
                  <KanbanColumn 
                    title="Failed" 
                    status="failed" 
                    tasks={tasksByStatus.failed}
                    viewMode="hr"
                    onTaskClick={handleTaskClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Task List View</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleTaskClick(task)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                          {task.project}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar name={task.assignee.name} size="xs" />
                          <span className="ml-2 text-sm text-gray-900">{task.assignee.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityChip priority={task.priority} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusChip status={task.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ProgressBar progress={task.progress} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredTasks.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredTasks.length}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </div>
        )}

        {/* Task Detail Modal */}
        <TaskDetailModal 
          task={selectedTask}
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onUpdateTask={handleUpdateTask}
          userRole={userRole}
        />
      </div>
    </Layout>
  );
}