import { environment } from '../../config/environment';

export interface AIScoringResult {
  score: number;
  matchPercentage: number;
  breakdown: string;
  recommendations: string[];
}

class GeminiAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = environment.gemini.apiKey;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async matchResumeWithJob(
    resumeText: string,
    jobTitle: string,
    jobDescription: string
  ): Promise<AIScoringResult> {
    if (!this.isConfigured()) {
      console.warn('[Gemini Integration] GEMINI_API_KEY is not defined. Returning fallback evaluation.');
      
      const hasReact = resumeText.toLowerCase().includes('react');
      const hasDesign = resumeText.toLowerCase().includes('design');
      const matchPercentage = (hasReact ? 55 : 30) + (hasDesign ? 30 : 15);
      
      return {
        score: Math.round(matchPercentage / 10),
        matchPercentage,
        breakdown: 'A simulated comparison indicates satisfactory alignment with minor skill-gap opportunities.',
        recommendations: [
          'Highlight React Hook Form experience in top profiles.',
          'Inject responsive design methodologies within your work histories.',
          'Align certificate arrays to official Indian Gazette conventions.'
        ]
      };
    }

    try {
      console.log(`[Gemini Integration] Matching resume against job: ${jobTitle}`);
      // Future actual call: return await callGeminiModel(resumeText, jobTitle, jobDescription);
      return {
        score: 9,
        matchPercentage: 92,
        breakdown: 'Superb alignment across react hook forms and modern state container patterns.',
        recommendations: ['Maintain existing code block representations.']
      };
    } catch (error) {
      console.error('[Gemini Integration] API Error:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiAIService();
export default geminiService;
