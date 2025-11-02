'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TaskSchema } from '@/lib/validation';
import { getUsers, User } from '@/lib/data';
import { addTask, editTask } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { suggestTaskDescription } from '@/ai/flows/suggest-task-descriptions';

type TaskFormValues = z.infer<typeof TaskSchema>;

type TaskDialogProps = {
  taskToEdit?: Task;
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TaskDialog({
  taskToEdit,
  trigger,
  open,
  onOpenChange,
}: TaskDialogProps) {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const isEditMode = !!taskToEdit;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: isEditMode
      ? {
          ...taskToEdit,
          deadline: new Date(taskToEdit.deadline),
        }
      : {
          title: '',
          description: '',
          assignedUserId: undefined,
          deadline: undefined,
        },
  });

  useEffect(() => {
    async function fetchUsers() {
      const allUsers = await getUsers();
      setUsers(allUsers.filter(u => u.role === 'User'));
    }
    if (open) {
        fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      form.reset(
        isEditMode
          ? {
              ...taskToEdit,
              deadline: new Date(taskToEdit.deadline),
            }
          : {
              title: '',
              description: '',
              assignedUserId: undefined,
              deadline: undefined,
            }
      );
    }
  }, [open, taskToEdit, isEditMode, form]);

  const handleSuggestDescription = async () => {
    const title = form.getValues('title');
    if (!title) {
      toast({
        variant: 'destructive',
        title: 'Title is required',
        description: 'Please enter a title before suggesting a description.',
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestTaskDescription({ taskTitle: title });
      form.setValue('description', result.taskDescription, {
        shouldValidate: true,
      });
    } catch (error) {
      console.error('Failed to suggest description:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not generate a description at this time.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (isEditMode) {
        await editTask(taskToEdit.id, data);
        toast({ title: 'Task Updated', description: 'The task has been successfully updated.' });
      } else {
        await addTask(data);
        toast({ title: 'Task Added', description: 'A new task has been created.' });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not save the task. Please try again.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the details of the task.'
              : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Design new homepage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Description</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSuggestDescription}
                      disabled={isSuggesting}
                    >
                      {isSuggesting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4 text-accent" />
                      )}
                      Suggest
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Add a detailed description of the task..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isEditMode ? 'Save Changes' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
