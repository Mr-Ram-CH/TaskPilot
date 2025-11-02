'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Task, TaskStatus, User } from './definitions';
import { TaskSchema } from './validation';
import { tasks as dbTasks, initialUsers } from './data';

// A simple in-memory store. This will reset on server restart.
let tasks: Task[] = [...dbTasks];
let users: User[] = [...initialUsers];

export async function addUser(user: User): Promise<void> {
  if (!users.find(u => u.email === user.email)) {
    users.push(user);
  }
}

export async function updateUser(userId: string, data: Partial<User>): Promise<User> {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found for update');
  }
  users[userIndex] = { ...users[userIndex], ...data };
  return users[userIndex];
}

export async function findUserById(userId: string): Promise<User | undefined> {
  return users.find(u => u.id === userId);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find(u => u.email === email);
}

export async function addTask(data: z.infer<typeof TaskSchema>) {
  const validatedData = TaskSchema.parse(data);

  const newTask: Task = {
    id: `task-${Date.now()}`,
    ...validatedData,
    deadline: validatedData.deadline.toISOString(),
    status: 'Pending',
  };

  tasks.unshift(newTask);
  revalidatePath('/dashboard');
  return newTask;
}

export async function editTask(id: string, data: z.infer<typeof TaskSchema>) {
  const validatedData = TaskSchema.parse(data);

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...validatedData,
    deadline: validatedData.deadline.toISOString(),
  };

  tasks[taskIndex] = updatedTask;
  revalidatePath('/dashboard');
  return updatedTask;
}

export async function deleteTask(id: string) {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  tasks.splice(taskIndex, 1);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  tasks[taskIndex].status = status;
  revalidatePath('/dashboard');
  return tasks[taskIndex];
}

export async function getTasksForActions(): Promise<Task[]> {
  return tasks;
}

export async function getUsersForActions(): Promise<User[]> {
    return users;
}
