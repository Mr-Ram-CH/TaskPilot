import { Target } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-2 text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md',
        className
      )}
    >
      <Target className="h-7 w-7" />
      <h1 className="text-xl font-bold tracking-tight">TaskPilot</h1>
    </Link>
  );
}
