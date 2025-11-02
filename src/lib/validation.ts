import { z } from 'zod';

export const TaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long.' }),
  assignedUserId: z.string({ required_error: 'Please assign the task to a user.' }),
  deadline: z.date({ required_error: 'A deadline is required.' }),
});
