'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  getTaskById, 
  updateTask, 
  deleteTask, 
  getUsers, 
  getTaskHistory,
  getTasks,
  getBlockingTasks,
  getBlockedTasks,
  addDependency,
  removeDependency,
  isTaskBlocked
} from '@/lib/store';
import { Task, User, Priority, TaskStatus, TaskHistory } from '@/lib/types';

export default function TaskDetail() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [blockingTasks, setBlockingTasks] = useState<Task[]>([]);
  const [blockedTasks, setBlockedTasks] = useState<Task[]>([]);
  const [showAddDependency, setShowAddDependency] = useState(false);
  const [selectedBlocker, setSelectedBlocker] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do' as TaskStatus,
    priority: 'Medium' as Priority,
    assigneeId: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const loadData = () => {
    const taskData = getTaskById(taskId);
    if (taskData) {
      setTask(taskData);
      setFormData({
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: taskData.priority,
        assigneeId: taskData.assigneeId,
        dueDate: taskData.dueDate || ''
      });
    }
    setUsers(getUsers());
    setHistory(getTaskHistory(taskId));
    setAllTasks(getTasks());
    setBlockingTasks(getBlockingTasks(taskId));
    setBlockedTasks(getBlockedTasks(taskId));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedTask = updateTask(
      taskId,
      {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        assigneeId: formData.assigneeId,
        dueDate: formData.dueDate || undefined
      },
      formData.assigneeId
    );

    if (updatedTask) {
      setTask(updatedTask);
      setIsEditing(false);
      loadData();
    }
  };

  const handleCancel = () => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate || ''
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const handleDelete = () => {
    if (deleteTask(taskId)) {
      router.push('/tasks');
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleAddDependency = () => {
    if (selectedBlocker && addDependency(taskId, selectedBlocker)) {
      loadData();
      setShowAddDependency(false);
      setSelectedBlocker('');
    }
  };

  const handleRemoveDependency = (blockerTaskId: string) => {
    if (removeDependency(taskId, blockerTaskId)) {
      loadData();
    }
  };

  const getAvailableBlockers = () => {
    return allTasks.filter(t => 
      t.id !== taskId && 
      !blockingTasks.some(bt => bt.id === t.id)
    );
  };

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  const isBlocked = isTaskBlocked(taskId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Details</h1>
        <button
          onClick={() => router.push('/tasks')}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {!isEditing ? (
          // Read-only view
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Task ID</label>
              <p className="text-lg">#{task.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
              <p className="text-lg font-semibold">{task.title}</p>
            </div>

            {task.description && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <p className="text-gray-700">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <p className="text-lg">{task.status}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Priority</label>
                <p className="text-lg">{task.priority}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Assignee</label>
                <p className="text-lg">{getUserName(task.assigneeId)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created Date</label>
                <p className="text-lg">{formatDateShort(task.createdDate)}</p>
              </div>

              {task.dueDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Due Date</label>
                  <p className="text-lg">{formatDateShort(task.dueDate)}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        ) : (
          // Edit mode
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={101}
              />
              <div className="flex justify-between mt-1">
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                <p className="text-sm text-gray-500 ml-auto">{formData.title.length}/100</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={501}
              />
              <div className="flex justify-between mt-1">
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                <p className="text-sm text-gray-500 ml-auto">{formData.description.length}/500</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <select
                  value={formData.assigneeId}
                  onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  min={getTodayDate()}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task Dependencies */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Task Dependencies</h2>
          <button
            onClick={() => setShowAddDependency(!showAddDependency)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            {showAddDependency ? 'Cancel' : '+ Add Blocker'}
          </button>
        </div>

        {/* Blocked Status Banner */}
        {isBlocked && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-red-800">This task is blocked by incomplete dependencies</span>
            </div>
          </div>
        )}

        {/* Add Dependency Form */}
        {showAddDependency && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a task that blocks this one:
            </label>
            <div className="flex gap-2">
              <select
                value={selectedBlocker}
                onChange={(e) => setSelectedBlocker(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a blocker task...</option>
                {getAvailableBlockers().map(t => (
                  <option key={t.id} value={t.id}>
                    #{t.id} - {t.title} ({t.status})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddDependency}
                disabled={!selectedBlocker}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: Circular dependencies are automatically prevented
            </p>
          </div>
        )}

        {/* Blocking This Task */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
            <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Blocked By ({blockingTasks.length})
          </h3>
          {blockingTasks.length === 0 ? (
            <p className="text-sm text-gray-500 ml-7">No blocking tasks</p>
          ) : (
            <div className="space-y-2">
              {blockingTasks.map(blockerTask => (
                <div
                  key={blockerTask.id}
                  className={`ml-7 p-3 rounded-lg border-l-4 ${
                    blockerTask.status === 'Done' 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-orange-50 border-orange-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/tasks/${blockerTask.id}`)}
                          className="font-semibold text-gray-800 hover:text-blue-600"
                        >
                          #{blockerTask.id} - {blockerTask.title}
                        </button>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          blockerTask.status === 'Done' 
                            ? 'bg-green-200 text-green-800'
                            : blockerTask.status === 'In Progress'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          {blockerTask.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Assigned to {getUserName(blockerTask.assigneeId)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveDependency(blockerTask.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* This Task Blocks */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
            <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Blocking ({blockedTasks.length})
          </h3>
          {blockedTasks.length === 0 ? (
            <p className="text-sm text-gray-500 ml-7">Not blocking any tasks</p>
          ) : (
            <div className="space-y-2">
              {blockedTasks.map(blockedTask => (
                <div
                  key={blockedTask.id}
                  className="ml-7 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/tasks/${blockedTask.id}`)}
                          className="font-semibold text-gray-800 hover:text-blue-600"
                        >
                          #{blockedTask.id} - {blockedTask.title}
                        </button>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          blockedTask.status === 'Done' 
                            ? 'bg-green-200 text-green-800'
                            : blockedTask.status === 'In Progress'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          {blockedTask.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Assigned to {getUserName(blockedTask.assigneeId)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Task History</h2>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-500">No history available</p>
          ) : (
            history.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-gray-800">
                  <span className="font-semibold">{item.action}</span> by {getUserName(item.userId)}
                </p>
                <p className="text-sm text-gray-500">{formatDate(item.timestamp)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the task <span className="font-semibold">&ldquo;{task.title}&rdquo;</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
