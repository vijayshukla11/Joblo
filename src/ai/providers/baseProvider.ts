import { AIModelConfig } from '../types';

/**
 * Base AI Provider Interface
 * All concrete AI providers must implement this to remain swappable.
 */
export interface IAIProvider {
  /**
   * Generates text content based on a prompt and system instruction.
   */
  generateText(
    prompt: string,
    systemInstruction?: string,
    config?: Partial<AIModelConfig>
  ): Promise<string>;

  /**
   * Generates structured JSON based on a prompt and system instruction.
   * Ensures the response matches a specified schema structure or can be safely parsed.
   */
  generateStructuredJSON<T>(
    prompt: string,
    systemInstruction?: string,
    config?: Partial<AIModelConfig>
  ): Promise<T>;
}
