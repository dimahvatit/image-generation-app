import { surpriseMePrompts } from '../constants';

export function getRandomPrompt(prompt: string): string {
    const randomIndex: number = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt: string = surpriseMePrompts[randomIndex];

    if (randomPrompt === prompt) return getRandomPrompt(prompt);

    return randomPrompt;
}
