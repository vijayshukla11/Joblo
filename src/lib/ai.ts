/**
 * Google GenAI / Gemini SDK Interface & Prompt Manager
 * 
 * Sets up lazy initialization hooks to connect the resume matching system
 * with actual Gemini models (gemini-2.5-flash) in the server environment.
 */

export interface AIScoringResult {
  score: number;
  matchPercentage: number;
  breakdown: string;
  recommendations: string[];
}

class GeminiAIService {
  private hasKey: boolean = false;

  constructor() {
    this.hasKey = !!import.meta.env.VITE_GEMINI_API_KEY;
  }

  isConfigured(): boolean {
    return this.hasKey;
  }

  /**
   * Evaluates custom resume text against target job descriptions
   * Using structural prompting constraints.
   */
  async matchResumeWithJob(
    resumeText: string,
    jobTitle: string,
    jobDescription: string
  ): Promise<AIScoringResult> {
    if (!this.hasKey) {
      console.warn('[Gemini SDK] GEMINI_API_KEY is not defined. Returning static evaluation fallback.');
      
      // Calculate a deterministic fallback score based on character mapping of skills
      const hasReact = resumeText.toLowerCase().includes('react');
      const hasDesign = resumeText.toLowerCase().includes('design');
      const scoreValue = hasReact && hasDesign ? 88 : hasReact ? 76 : 64;

      return {
        score: scoreValue,
        matchPercentage: scoreValue,
        breakdown: 'This is a simulated analysis because the Gemini API keys are currently being verified. Configure GEMINI_API_KEY inside your environment settings.',
        recommendations: [
          'Add explicit technical project descriptions outlining React or full-stack architectures.',
          'Inject semantic keywords correlating with "verified enterprise pipelines" and corporate benchmarks.',
          'Verify your Indian public gazette examination syllabus reference timelines if applying to govt roles.'
        ]
      };
    }

    try {
      // In production, this proxies requests securely to server-side routes (/api/ai/match)
      const response = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobTitle, jobDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve active AI matching scores from server endpoint.');
      }

      return await response.json();
    } catch (err) {
      console.error('[Gemini SDK Error] Active prompt execution failed:', err);
      throw err;
    }
  }
}

export const aiService = new GeminiAIService();
export default aiService;
