/**
 * OpenAI GPT SDK Integration client placeholder.
 * Prepared for advanced resume and cover-letter styling hooks in Sprint 2.
 */
class OpenAIIntegrationClient {
  private hasKey: boolean = false;

  constructor() {
    // Left as placeholder for developer API config
    this.hasKey = false;
  }

  isConfigured(): boolean {
    return this.hasKey;
  }

  async generateCareerAdvice(prompt: string): Promise<string> {
    console.log('[OpenAI Integration] dry-run advice generation:', prompt);
    return "Scalable AI advice placeholder. Configured client required.";
  }
}

export const openAIClient = new OpenAIIntegrationClient();
export default openAIClient;
