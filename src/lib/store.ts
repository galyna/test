import { User, Task, TaskHistory, RecentActivity } from './types';

// In-memory storage
const users: User[] = [
  {
    id: '1',
    name: 'John Developer',
    email: 'john@company.com',
    role: 'Developer'
  },
  {
    id: '2',
    name: 'Sarah Designer',
    email: 'sarah@company.com',
    role: 'Designer'
  },
  {
    id: '3',
    name: 'Mike QA',
    email: 'mike@company.com',
    role: 'QA'
  },
  {
    id: '4',
    name: 'Lisa Manager',
    email: 'lisa@company.com',
    role: 'Manager'
  }
];

const tasks: Task[] = [
  {
    id: '1',
    title: 'Setup project structure',
    description: 'Initialize the project with proper folder structure and dependencies',
    status: 'To Do',
    priority: 'High',
    assigneeId: '1',
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Design login page mockup',
    description: 'Create wireframes and high-fidelity mockups for the login page',
    status: 'In Progress',
    priority: 'Medium',
    assigneeId: '2',
    createdDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Write user authentication tests',
    description: 'Comprehensive test suite for authentication flows',
    status: 'To Do',
    priority: 'High',
    assigneeId: '3',
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    title: 'Review sprint planning',
    description: 'Review and approve sprint planning for next iteration',
    status: 'Done',
    priority: 'Low',
    assigneeId: '4',
    createdDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    title: 'Implement user registration API',
    description: 'Backend API endpoints for user registration with validation',
    status: 'In Progress',
    priority: 'High',
    assigneeId: '1',
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    title: 'Create color palette and typography guide',
    description: 'Design system foundation with colors and typography',
    status: 'Done',
    priority: 'Medium',
    assigneeId: '2',
    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    title: 'Setup automated testing pipeline',
    description: 'CI/CD pipeline with automated testing on every commit',
    status: 'To Do',
    priority: 'Medium',
    assigneeId: '3',
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    title: 'Prepare quarterly review presentation',
    description: 'Slides and data for Q4 review meeting',
    status: 'In Progress',
    priority: 'Low',
    assigneeId: '4',
    createdDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

let taskHistory: TaskHistory[] = tasks.map((task) => ({
  taskId: task.id,
  action: 'created',
  userId: task.assigneeId,
  timestamp: task.createdDate
}));

// Add some status change history
taskHistory.push({
  taskId: '2',
  action: 'status changed to In Progress',
  userId: '2',
  timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
});

taskHistory.push({
  taskId: '4',
  action: 'status changed to Done',
  userId: '4',
  timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
});

taskHistory.push({
  taskId: '5',
  action: 'status changed to In Progress',
  userId: '1',
  timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
});

taskHistory.push({
  taskId: '6',
  action: 'status changed to Done',
  userId: '2',
  timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
});

taskHistory.push({
  taskId: '8',
  action: 'status changed to In Progress',
  userId: '4',
  timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
});

// User operations
export function getUsers(): User[] {
  return [...users];
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function createUser(user: Omit<User, 'id'>): User {
  const newUser: User = {
    ...user,
    id: (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString()
  };
  users.push(newUser);
  return newUser;
}

export function updateUser(id: string, updates: Partial<Omit<User, 'id'>>): User | undefined {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return undefined;
  users[index] = { ...users[index], ...updates };
  return users[index];
}

export function deleteUser(id: string): boolean {
  const hasTasks = tasks.some(t => t.assigneeId === id);
  if (hasTasks) return false;
  
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  
  users.splice(index, 1);
  return true;
}

// Task operations
export function getTasks(): Task[] {
  return [...tasks];
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find(t => t.id === id);
}

export function createTask(task: Omit<Task, 'id' | 'createdDate'>): Task {
  const newTask: Task = {
    ...task,
    id: (Math.max(...tasks.map(t => parseInt(t.id)), 0) + 1).toString(),
    createdDate: new Date().toISOString()
  };
  tasks.push(newTask);
  
  // Add to history
  taskHistory.push({
    taskId: newTask.id,
    action: 'created',
    userId: newTask.assigneeId,
    timestamp: newTask.createdDate
  });
  
  return newTask;
}

export function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdDate'>>, userId: string): Task | undefined {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return undefined;
  
  const oldTask = tasks[index];
  tasks[index] = { ...oldTask, ...updates };
  
  // Add to history
  if (updates.status && updates.status !== oldTask.status) {
    taskHistory.push({
      taskId: id,
      action: `status changed to ${updates.status}`,
      userId,
      timestamp: new Date().toISOString()
    });
  } else {
    taskHistory.push({
      taskId: id,
      action: 'updated',
      userId,
      timestamp: new Date().toISOString()
    });
  }
  
  return tasks[index];
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tasks.splice(index, 1);
  taskHistory = taskHistory.filter(h => h.taskId !== id);
  return true;
}

// Task history operations
export function getTaskHistory(taskId: string): TaskHistory[] {
  return taskHistory
    .filter(h => h.taskId === taskId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Recent activity (last 5 updates)
export function getRecentActivity(): RecentActivity[] {
  const sorted = [...taskHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return sorted.slice(0, 5).map(h => {
    const task = tasks.find(t => t.id === h.taskId);
    const user = users.find(u => u.id === h.userId);
    
    return {
      taskId: h.taskId,
      taskTitle: task?.title || 'Unknown Task',
      action: h.action,
      userId: h.userId,
      userName: user?.name || 'Unknown User',
      timestamp: h.timestamp
    };
  });
}

// Statistics
export function getTaskStatistics() {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length
  };
}

export function getUserTaskCount(userId: string): number {
  return tasks.filter(t => t.assigneeId === userId).length;
}

// Task dependencies
export function addDependency(taskId: string, blockerTaskId: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  const blockerTask = tasks.find(t => t.id === blockerTaskId);
  
  if (!task || !blockerTask || taskId === blockerTaskId) return false;
  
  // Check for circular dependencies
  if (wouldCreateCircularDependency(taskId, blockerTaskId)) return false;
  
  if (!task.blockedBy) {
    task.blockedBy = [];
  }
  
  if (!task.blockedBy.includes(blockerTaskId)) {
    task.blockedBy.push(blockerTaskId);
    return true;
  }
  
  return false;
}

export function removeDependency(taskId: string, blockerTaskId: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  
  if (!task || !task.blockedBy) return false;
  
  const index = task.blockedBy.indexOf(blockerTaskId);
  if (index > -1) {
    task.blockedBy.splice(index, 1);
    return true;
  }
  
  return false;
}

function wouldCreateCircularDependency(taskId: string, blockerTaskId: string): boolean {
  // Check if blockerTask depends on taskId (directly or indirectly)
  const visited = new Set<string>();
  
  function checkDependencies(currentTaskId: string): boolean {
    if (currentTaskId === taskId) return true;
    if (visited.has(currentTaskId)) return false;
    
    visited.add(currentTaskId);
    
    const currentTask = tasks.find(t => t.id === currentTaskId);
    if (!currentTask?.blockedBy) return false;
    
    return currentTask.blockedBy.some(blockerId => checkDependencies(blockerId));
  }
  
  return checkDependencies(blockerTaskId);
}

export function getBlockingTasks(taskId: string): Task[] {
  const task = tasks.find(t => t.id === taskId);
  if (!task?.blockedBy) return [];
  
  return tasks.filter(t => task.blockedBy?.includes(t.id));
}

export function getBlockedTasks(taskId: string): Task[] {
  return tasks.filter(t => t.blockedBy?.includes(taskId));
}

export function isTaskBlocked(taskId: string): boolean {
  const blockingTasks = getBlockingTasks(taskId);
  return blockingTasks.some(t => t.status !== 'Done');
}
