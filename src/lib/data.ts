import type { Task, User } from './definitions';
import { PlaceHolderImages } from './placeholder-images';
import { getTasksForActions, getUsersForActions } from './actions';

const avatarPM = PlaceHolderImages.find(p => p.id === 'avatar-pm')?.imageUrl ?? '';
const avatarUser1 = PlaceHolderImages.find(p => p.id === 'avatar-user1')?.imageUrl ?? '';
const avatarUser2 = PlaceHolderImages.find(p => p.id === 'avatar-user2')?.imageUrl ?? '';
const avatarUser3 = PlaceHolderImages.find(p => p.id === 'avatar-user3')?.imageUrl ?? '';


export const initialUsers: User[] = [
  {
    id: 'pm-1',
    name: 'Alex Ray',
    email: 'pm@example.com',
    role: 'Project Manager',
    avatar: avatarPM,
  },
  {
    id: 'user-1',
    name: 'Casey Jordan',
    email: 'user@example.com',
    role: 'User',
    avatar: avatarUser1,
  },
  {
    id: 'user-2',
    name: 'Taylor Morgan',
    email: 'taylor@example.com',
    role: 'User',
    avatar: avatarUser2,
  },
    {
    id: 'user-3',
    name: 'Jamie Bell',
    email: 'jamie@example.com',
    role: 'User',
    avatar: avatarUser3,
    },
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Develop User Authentication',
    description:
      'Implement user login and registration functionality using secure, modern practices. Include password hashing and session management.',
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    assignedUserId: 'user-1',
    status: 'In Progress',
  },
  {
    id: 'task-2',
    title: 'Design Dashboard UI',
    description:
      'Create mockups and a design system for the main application dashboard. Focus on user experience and a clean, intuitive layout.',
    deadline: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    assignedUserId: 'user-2',
    status: 'Pending',
  },
  {
    id: 'task-3',
    title: 'Setup CI/CD Pipeline',
    description:
      'Configure a continuous integration and continuous deployment pipeline to automate testing and deployment processes.',
    deadline: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    assignedUserId: 'user-1',
    status: 'Pending',
  },
  {
    id: 'task-4',
    title: 'API Endpoint for Tasks',
    description:
      'Develop RESTful API endpoints for creating, reading, updating, and deleting tasks. Ensure proper validation and error handling.',
    deadline: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    assignedUserId: 'user-3',
    status: 'Done',
  },
    {
    id: 'task-5',
    title: 'Client-side State Management',
    description:
        'Choose and implement a state management library (e.g., Redux, Zustand) to handle client-side state for the application.',
    deadline: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(),
    assignedUserId: 'user-2',
    status: 'Pending',
    },
];

export async function getTasks(): Promise<Task[]> {
    // In a real app this would be a database call.
    // We use a server action to get the current state of the in-memory store.
    return getTasksForActions();
}

export async function getUsers(): Promise<User[]> {
    return getUsersForActions();
}
