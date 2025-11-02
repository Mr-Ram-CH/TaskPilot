'use server';

/**
 * @fileOverview Task description suggestion AI agent.
 *
 * - suggestTaskDescription - A function that suggests a task description given a task title.
 * - SuggestTaskDescriptionInput - The input type for the suggestTaskDescription function.
 * - SuggestTaskDescriptionOutput - The return type for the suggestTaskDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskDescriptionInputSchema = z.object({
  taskTitle: z.string().describe('The title of the task.'),
});
export type SuggestTaskDescriptionInput = z.infer<typeof SuggestTaskDescriptionInputSchema>;

const SuggestTaskDescriptionOutputSchema = z.object({
  taskDescription: z.string().describe('A suggested description for the task.'),
});
export type SuggestTaskDescriptionOutput = z.infer<typeof SuggestTaskDescriptionOutputSchema>;

export async function suggestTaskDescription(input: SuggestTaskDescriptionInput): Promise<SuggestTaskDescriptionOutput> {
  return suggestTaskDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskDescriptionPrompt',
  input: {schema: SuggestTaskDescriptionInputSchema},
  output: {schema: SuggestTaskDescriptionOutputSchema},
  prompt: `You are an AI assistant helping project managers create clear and concise task descriptions.

  Given the task title, suggest a detailed description that clarifies the task's objectives, required steps, and expected outcomes.
  The task description should be easy to understand for the assigned user.

  Task Title: {{{taskTitle}}}

  Suggested Task Description:`,
});

const suggestTaskDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestTaskDescriptionFlow',
    inputSchema: SuggestTaskDescriptionInputSchema,
    outputSchema: SuggestTaskDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
