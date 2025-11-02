'use server';
/**
 * @fileOverview Summarizes task updates for project managers.
 *
 * - summarizeTaskUpdates - A function that summarizes completed tasks this week.
 * - SummarizeTaskUpdatesInput - The input type for the summarizeTaskUpdates function (currently empty).
 * - SummarizeTaskUpdatesOutput - The return type for the summarizeTaskUpdates function, containing the summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTaskUpdatesInputSchema = z.object({});
export type SummarizeTaskUpdatesInput = z.infer<typeof SummarizeTaskUpdatesInputSchema>;

const SummarizeTaskUpdatesOutputSchema = z.object({
  summary: z.string().describe('A summary of all tasks completed this week.'),
  progress: z.string().describe('One-sentence summary of what has been generated.'),
});
export type SummarizeTaskUpdatesOutput = z.infer<typeof SummarizeTaskUpdatesOutputSchema>;

export async function summarizeTaskUpdates(input: SummarizeTaskUpdatesInput): Promise<SummarizeTaskUpdatesOutput> {
  return summarizeTaskUpdatesFlow(input);
}

const summarizeTaskUpdatesPrompt = ai.definePrompt({
  name: 'summarizeTaskUpdatesPrompt',
  input: {schema: SummarizeTaskUpdatesInputSchema},
  output: {schema: SummarizeTaskUpdatesOutputSchema},
  prompt: `You are a project management assistant. Your task is to summarize the completed tasks for the week.

  Completed Tasks:
  {{completedTasks}}
  
  Provide a concise summary of the progress made this week, highlighting key achievements and any potential roadblocks.
  Progress:
  `,
});

const summarizeTaskUpdatesFlow = ai.defineFlow(
  {
    name: 'summarizeTaskUpdatesFlow',
    inputSchema: SummarizeTaskUpdatesInputSchema,
    outputSchema: SummarizeTaskUpdatesOutputSchema,
  },
  async input => {
    // Here, you would typically fetch the completed tasks from a database or other source.
    // For this example, we'll use mock data.
    const completedTasks = [
      'Task 1: Design mockups completed by John Doe',
      'Task 2: Initial backend setup finished by Jane Smith',
      'Task 3: User authentication implemented by Peter Jones',
    ].join('\n');

    const {output} = await summarizeTaskUpdatesPrompt({
      ...input,
      completedTasks: completedTasks,
    });

    // Add a short summary of what was generated to the progress field.
    output!.progress = 'Generated a summary of completed tasks for the week.';

    return output!;
  }
);
