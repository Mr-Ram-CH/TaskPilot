import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/lib/definitions';
import { cn } from '@/lib/utils';

type TaskStatusBadgeProps = {
  status: TaskStatus;
  className?: string;
};

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const statusStyles = {
    Pending: 'bg-muted text-muted-foreground border-transparent',
    'In Progress': 'bg-accent/20 text-accent-foreground border-accent/50',
    Done: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50',
  };

  return (
    <Badge className={cn(statusStyles[status], className)}>{status}</Badge>
  );
}
