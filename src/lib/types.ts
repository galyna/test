export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High';
export type Role = 'Developer' | 'Designer' | 'QA' | 'Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  createdDate: string;
  dueDate?: string;
  blockedBy?: string[]; // Array of task IDs that block this task
}

export interface TaskHistory {
  taskId: string;
  action: string;
  userId: string;
  timestamp: string;
}

export interface RecentActivity {
  taskId: string;
  taskTitle: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
}
