'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { getTasks, getUsers, updateTask, isTaskBlocked, getBlockingTasks } from '@/lib/store';
import { Task, User, TaskStatus } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  getUserName: (id: string) => string;
  isDragging?: boolean;
}

function TaskCard({ task, getUserName, isDragging = false }: TaskCardProps) {
  const router = useRouter();
  const blocked = isTaskBlocked(task.id);
  const blockingTasks = getBlockingTasks(task.id);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-l-4 border-l-red-500';
      case 'Medium': return 'border-l-4 border-l-yellow-500';
      case 'Low': return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-gray-300';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-3 sm:p-4 mb-2 sm:mb-3 cursor-move hover:shadow-lg transition-shadow ${getPriorityColor(task.priority)} ${
        isDragging ? 'opacity-50' : ''
      } ${blocked ? 'ring-2 ring-red-300' : ''}`}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('[data-no-click]')) {
          router.push(`/tasks/${task.id}`);
        }
      }}
    >
      {/* Blocked Banner */}
      {blocked && (
        <div className="mb-2 px-2 py-1 bg-red-50 rounded flex items-center gap-1">
          <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold text-red-700">Blocked by {blockingTasks.length} task{blockingTasks.length > 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
        <span className="text-xs text-gray-500 ml-2">#{task.id}</span>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className="text-xs text-gray-600">{getUserName(task.assigneeId)}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.blockedBy && task.blockedBy.length > 0 && (
            <div className="flex items-center gap-1" title={`Has ${task.blockedBy.length} dependency/dependencies`}>
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
              <span className="text-xs text-orange-600 font-semibold">{task.blockedBy.length}</span>
            </div>
          )}
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'To Do', title: 'To Do', color: 'bg-gray-100' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'Done', title: 'Done', color: 'bg-green-100' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(getTasks());
    setUsers(getUsers());
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTask(taskId, { status: newStatus }, task.assigneeId);
      loadData();
    }
    
    setActiveTask(null);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Kanban Board</h1>
        <div className="text-xs sm:text-sm text-gray-600">
          <span className="font-semibold">{tasks.length}</span> tasks
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.id);
            
            return (
              <div
                key={column.id}
                id={column.id}
                className="flex flex-col"
              >
                <div className={`${column.color} rounded-lg p-3 sm:p-4 mb-3 sm:mb-4`}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm sm:text-base font-bold text-gray-800">{column.title}</h2>
                    <span className="bg-white text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div
                  data-droppable-id={column.id}
                  className="flex-1 bg-gray-50 rounded-lg p-2 sm:p-4 min-h-[300px] sm:min-h-[500px] transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-blue-50', 'ring-2', 'ring-blue-300');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-300');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-300');
                    
                    const taskId = e.dataTransfer.getData('taskId');
                    if (taskId) {
                      const task = tasks.find(t => t.id === taskId);
                      if (task && task.status !== column.id) {
                        updateTask(taskId, { status: column.id }, task.assigneeId);
                        loadData();
                      }
                    }
                  }}
                >
                  {columnTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('taskId', task.id);
                        setActiveTask(task);
                      }}
                      onDragEnd={() => setActiveTask(null)}
                    >
                      <TaskCard
                        task={task}
                        getUserName={getUserName}
                        isDragging={activeTask?.id === task.id}
                      />
                    </div>
                  ))}
                  
                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              getUserName={getUserName}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
