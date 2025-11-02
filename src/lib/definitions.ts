export type UserRole = 'Project Manager' | 'User';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
};

export type TaskStatus = 'Pending' | 'In Progress' | 'Done';

export type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO string
  assignedUserId: string;
  status: TaskStatus;
};
