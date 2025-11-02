'use client';

import { useEffect, useState } from 'react';
import { getTasks, Task } from '@/lib/data';
import { useUser } from '@/hooks/use-user';
import TaskCard from '@/components/tasks/task-card';

export function UserDashboard() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchTasks = async () => {
      setIsLoading(true);
      const allTasks = await getTasks();
      const userTasks = allTasks.filter(
        (task) => task.assignedUserId === user.id
      );
      setTasks(userTasks);
      setIsLoading(false);
    };
    fetchTasks();
  }, [user]);

  if (!user) return null;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        Welcome, {user.name}!
      </h1>
      <p className="text-muted-foreground">Here are the tasks assigned to you.</p>

      {isLoading ? (
        <p>Loading your tasks...</p>
      ) : tasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h3 className="text-xl font-medium tracking-tight">
            You&apos;re all caught up!
          </h3>
          <p className="text-sm text-muted-foreground">
            You have no pending tasks.
          </p>
        </div>
      )}
    </>
  );
}
