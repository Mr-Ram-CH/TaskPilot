'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Task, TaskStatus, User } from './definitions';
import { TaskSchema } from './validation';
import { tasks as dbTasks, initialUsers } from './data';
import { auth } from './firebase';

// A simple in-memory store for tasks. This will reset on server restart.
let tasks: Task[] = [...dbTasks];
let users: User[] = [...initialUsers];

// This function is for seeding the in-memory user store when a user signs up.
// In a real app, this would be a database call to create a new user record.
export async function addUser(user: User): Promise<void> {
  if (!users.find(u => u.id === user.id)) {
    users.push(user);
  }
}

// In a real app, this would get a user from a database.
export async function findUserById(userId: string): Promise<User | undefined> {
  return users.find(u => u.id === userId);
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
  // In a real app, this would fetch from a database.
  // Here, we return the current state of our in-memory array.
  return tasks;
}

export async function getUsersForActions(): Promise<User[]> {
    // In a real app, this would fetch from a database.
    return users;
}
