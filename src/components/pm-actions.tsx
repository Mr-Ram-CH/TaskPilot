'use client';
import { useState } from 'react';
import { AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { Task } from '@/lib/definitions';
import { summarizeTaskUpdates } from '@/ai/flows/summarize-task-updates';

type PMActionsProps = {
  allTasks: Task[];
};

export default function PMActions({ allTasks }: PMActionsProps) {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const overdueTasks = allTasks.filter(
    (task) => new Date(task.deadline) < new Date() && task.status !== 'Done'
  );

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    setSummary('');
    try {
      const result = await summarizeTaskUpdates({});
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Could not generate summary at this time.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="grid gap-4">
      {overdueTasks.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Overdue Tasks!</AlertTitle>
          <AlertDescription>
            There {overdueTasks.length === 1 ? 'is' : 'are'}{' '}
            <strong>{overdueTasks.length}</strong> task
            {overdueTasks.length > 1 ? 's' : ''} past the deadline.
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="font-semibold">Weekly Progress Summary</h3>
            <p className="text-sm text-muted-foreground">
              Use AI to generate a summary of the team&apos;s progress.
            </p>
          </div>
          <Button onClick={handleGenerateSummary} disabled={isSummarizing}>
            {isSummarizing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Summary
          </Button>
        </div>
        {summary && (
          <Alert className="mt-4">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>AI Generated Summary</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {summary}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
