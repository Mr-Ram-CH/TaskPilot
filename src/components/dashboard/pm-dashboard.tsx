'use client';

import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { getTasks, Task } from '@/lib/data';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/tasks/task-card';
import { TaskDialog } from '@/components/tasks/task-dialog';
import PMActions from '@/components/pm-actions';

export function PMDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      const allTasks = await getTasks();
      setTasks(allTasks);
      setIsLoading(false);
    };
    fetchTasks();
  }, [isDialogOpen]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          All Tasks
        </h1>
        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          }
        />
      </div>

      <PMActions allTasks={tasks} />

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h3 className="text-xl font-medium tracking-tight">No tasks yet</h3>
          <p className="text-sm text-muted-foreground">
            Get started by creating a new task.
          </p>
          <TaskDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            trigger={
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            }
          />
        </div>
      )}
    </>
  );
}
