'use client';

import React from 'react';

// Task interfaces
export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  comments: Array<{
    id: string;
    author: string;
    text: string;
    date: string;
  }>;
  subtasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  taskCount: number;
}

// Status Chip Component
export const StatusChip: React.FC<{ status: Task['status']; size?: 'sm' | 'md' }> = ({ 
  status, 
  size = 'sm' 
}) => {
  const getStatusConfig = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: '🟤',
          label: 'Pending'
        };
      case 'in-progress':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: '🔵',
          label: 'In Progress'
        };
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: '🟢',
          label: 'Completed'
        };
      case 'failed':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: '🔴',
          label: 'Failed'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: '🟤',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span className={`inline-flex items-center ${sizeClasses} font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

// Priority Chip Component
export const PriorityChip: React.FC<{ priority: Task['priority']; size?: 'sm' | 'md' }> = ({ 
  priority, 
  size = 'sm' 
}) => {
  const getPriorityConfig = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          label: 'High'
        };
      case 'medium':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          label: 'Medium'
        };
      case 'low':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          label: 'Low'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          label: 'Unknown'
        };
    }
  };

  const config = getPriorityConfig(priority);
  const sizeClasses = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span className={`inline-flex items-center ${sizeClasses} font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// Progress Bar Component
export const ProgressBar: React.FC<{ 
  progress: number; 
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}> = ({ progress, size = 'sm', showLabel = true }) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex-1 bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`bg-blue-600 ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-600 font-medium min-w-[3rem]">
          {progress}%
        </span>
      )}
    </div>
  );
};

// Avatar Component
export const Avatar: React.FC<{ 
  name: string; 
  avatar?: string; 
  size?: 'xs' | 'sm' | 'md' | 'lg' 
}> = ({ name, avatar, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-blue-500 text-white flex items-center justify-center font-medium`}>
      {initials}
    </div>
  );
};

// Task Card Component
export const TaskCard: React.FC<{
  task: Task;
  viewMode: 'employee' | 'hr';
  onTaskClick: (task: Task) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}> = ({ 
  task, 
  viewMode, 
  onTaskClick, 
  onStatusChange, 
  isDraggable = false,
  onDragStart 
}) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getDueDateColor = () => {
    if (task.status === 'completed') return 'text-green-600';
    if (isOverdue) return 'text-red-600';
    if (diffDays <= 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
        isOverdue ? 'border-l-4 border-l-red-500' : ''
      }`}
      draggable={isDraggable}
      onDragStart={onDragStart ? (e) => onDragStart(e, task) : undefined}
      onClick={() => onTaskClick(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {task.title}
          </h3>
          <span className="text-xs text-gray-500">#{task.id}</span>
        </div>
        <PriorityChip priority={task.priority} />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Project Badge (HR View) */}
      {viewMode === 'hr' && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
            📁 {task.project}
          </span>
        </div>
      )}

      {/* Assignee (HR View) */}
      {viewMode === 'hr' && (
        <div className="flex items-center mb-3">
          <Avatar name={task.assignee.name} avatar={task.assignee.avatar} size="xs" />
          <span className="ml-2 text-sm text-gray-600">{task.assignee.name}</span>
        </div>
      )}

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs text-gray-600">{task.actualHours}h / {task.estimatedHours}h</span>
        </div>
        <ProgressBar progress={task.progress} size="sm" showLabel={false} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <StatusChip status={task.status} />
          {task.subtasks.length > 0 && (
            <span className="text-xs text-gray-500">
              ✓ {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <span className={`text-xs ${getDueDateColor()}`}>
            📅 {dueDate.toLocaleDateString()}
          </span>
          {isOverdue && (
            <span className="text-xs text-red-600 font-medium">⚠️</span>
          )}
        </div>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Summary Stats Component
export const TaskSummaryCard: React.FC<{
  title: string;
  value: number;
  icon: string;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Analytics Chart Component
export const AnalyticsChart: React.FC<{
  data: Array<{
    name: string;
    tasks: number;
    completed: number;
    overdue: number;
  }>;
  title: string;
}> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.tasks, d.completed, d.overdue)), 10);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{item.name}</span>
              <span className="text-gray-500">{item.tasks} tasks</span>
            </div>
            <div className="flex h-6 rounded-full bg-gray-100 overflow-hidden">
              <div 
                className="bg-green-500" 
                style={{ width: `${(item.completed / maxValue) * 100}%` }}
              />
              <div 
                className="bg-blue-500" 
                style={{ width: `${((item.tasks - item.completed - item.overdue) / maxValue) * 100}%` }}
              />
              <div 
                className="bg-red-500" 
                style={{ width: `${(item.overdue / maxValue) * 100}%` }}
              />
            </div>
            <div className="flex text-xs text-gray-500 mt-1 space-x-4">
              <span>🟢 {item.completed} completed</span>
              <span>🔵 {item.tasks - item.completed - item.overdue} in progress</span>
              <span>🔴 {item.overdue} overdue</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Kanban Column Component
export const KanbanColumn: React.FC<{
  title: string;
  status: Task['status'];
  tasks: Task[];
  viewMode: 'employee' | 'hr';
  onTaskClick: (task: Task) => void;
  onDrop: (status: Task['status']) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}> = ({ 
  title, 
  status, 
  tasks, 
  viewMode, 
  onTaskClick, 
  onDrop, 
  onDragOver, 
  onDragStart 
}) => {
  const getColumnColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="bg-gray-50 rounded-lg p-4 min-h-96"
      onDragOver={onDragOver}
      onDrop={() => onDrop(status)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <StatusChip status={status} size="md" />
          <span className="ml-2">{title}</span>
        </h3>
        <span className={`${getColumnColor(status)} text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.5rem] text-center`}>
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            viewMode={viewMode}
            onTaskClick={onTaskClick}
            isDraggable={true}
            onDragStart={onDragStart}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};