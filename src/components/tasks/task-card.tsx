'use client';

import { useState, useEffect } from 'react';
import { Calendar, Edit, Trash2, User as UserIcon } from 'lucide-react';
import { Task } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TaskStatusBadge } from './task-status-badge';
import { useUser } from '@/hooks/use-user';
import { getUsers, User } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateTaskStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { TaskDialog } from './task-dialog';
import { DeleteTaskAlert } from './delete-task-alert';
import { Button } from '../ui/button';

export default function TaskCard({ task }: { task: Task }) {
  const { user: currentUser } = useUser();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
        const users = await getUsers();
        setAllUsers(users);
    }
    fetchUsers();
  }, []);

  const assignedUser = allUsers.find((u) => u.id === task.assignedUserId);

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await updateTaskStatus(task.id, newStatus);
      toast({
        title: 'Status Updated',
        description: `Task status changed to "${newStatus}".`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update task status.',
      });
    }
  };

  const isPM = currentUser?.role === 'Project Manager';
  const isAssignedUser = currentUser?.id === task.assignedUserId;

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
            <TaskStatusBadge status={task.status} />
          </div>
          <CardDescription className="line-clamp-3">
            {task.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <Separator />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(task.deadline)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="h-4 w-4" />
            <span>{assignedUser?.name ?? 'Unassigned'}</span>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          {isAssignedUser && !isPM && (
            <div className="w-full">
              <label className="text-xs font-medium text-muted-foreground">
                Update Status
              </label>
              <Select
                defaultValue={task.status}
                onValueChange={(value: Task['status']) =>
                  handleStatusChange(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {isPM && (
            <div className="flex w-full justify-end gap-2">
              <TaskDialog
                taskToEdit={task}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                trigger={
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                }
              />

              <DeleteTaskAlert taskId={task.id}>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </DeleteTaskAlert>
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
