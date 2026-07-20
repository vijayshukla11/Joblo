import { GeminiProvider } from '../providers/geminiProvider';
import { MockProvider } from '../providers/mockProvider';
import { IAIProvider } from '../providers/baseProvider';
import { SYSTEM_INSTRUCTIONS } from '../prompts/templates';
import { aiAnalytics } from '../utils/rateLimiter';
import {
  ParsedResume,
  ATSReport,
  OptimizedResume,
  CoverLetterRequest,
  CoverLetterResponse,
  SkillGapReport,
  CareerRoadmap,
  InterviewQuestion,
  InterviewEvaluation,
  EmployerCandidateAnalysis,
  AdminModerationReport,
  AIChatMessage,
  AIProviderType
} from '../types';

/**
 * Centered AI Service Controller
 * Swaps providers and orchestrates all AI actions on JOB Lo.
 */
export class AIService {
  private static instance: AIService;
  private provider: IAIProvider;
  private currentProviderType: AIProviderType = AIProviderType.MOCK;

  private constructor() {
    const gemini = new GeminiProvider();
    if (gemini.isAvailable()) {
      this.provider = gemini;
      this.currentProviderType = AIProviderType.GEMINI;
    } else {
      this.provider = new MockProvider();
      this.currentProviderType = AIProviderType.MOCK;
    }
    console.log(`[AIService] Running on provider: ${this.currentProviderType}`);
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public getProviderType(): AIProviderType {
    return this.currentProviderType;
  }

  /**
   * Helper to execute requests safely with timing, rate limiting and logging
   */
  private async executeWithLogging<T>(
    moduleName: string,
    prompt: string,
    action: (provider: IAIProvider) => Promise<T>
  ): Promise<T> {
    const limiter = aiAnalytics.checkRateLimit(moduleName);
    if (!limiter.allowed) {
      throw new Error(`Rate limit exceeded for ${moduleName}. Please wait ${limiter.waitSeconds} seconds.`);
    }

    const startTime = Date.now();
    try {
      const result = await action(this.provider);
      const responseTimeMs = Date.now() - startTime;
      
      aiAnalytics.logRequest({
        module: moduleName,
        prompt: prompt.slice(0, 100), // log snippet for safety
        responseTimeMs,
        success: true
      });

      return result;
    } catch (error: any) {
      const responseTimeMs = Date.now() - startTime;
      aiAnalytics.logRequest({
        module: moduleName,
        prompt: prompt.slice(0, 100),
        responseTimeMs,
        success: false,
        error: error?.message || 'Unknown provider error'
      });
      
      // If live Gemini failed, try to fallback to Mock so the user never gets blocked!
      if (this.currentProviderType === AIProviderType.GEMINI) {
        console.warn(`[AIService] Gemini failed for ${moduleName}, attempting high-fidelity Mock fallback.`, error);
        try {
          const fallbackProvider = new MockProvider();
          const fallbackStartTime = Date.now();
          const result = await action(fallbackProvider);
          
          aiAnalytics.logRequest({
            module: `${moduleName}_FALLBACK`,
            prompt: prompt.slice(0, 100),
            responseTimeMs: Date.now() - fallbackStartTime,
            success: true
          });
          return result;
        } catch (fallbackErr) {
          console.error('[AIService] Mock fallback also failed:', fallbackErr);
        }
      }

      throw error;
    }
  }

  // ==========================================
  // MODULE 2: AI RESUME PARSER
  // ==========================================
  public async parseResume(resumeText: string): Promise<ParsedResume> {
    const prompt = `Please parse this candidate resume text:\n\n${resumeText}`;
    return this.executeWithLogging<ParsedResume>('Resume Parser', prompt, (prov) =>
      prov.generateStructuredJSON<ParsedResume>(prompt, SYSTEM_INSTRUCTIONS.RESUME_PARSER)
    );
  }

  // ==========================================
  // MODULE 3: ATS SCORE ENGINE
  // ==========================================
  public async analyzeATS(resumeText: string, jobDescription: string): Promise<ATSReport> {
    const prompt = `RESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;
    return this.executeWithLogging<ATSReport>('ATS Score Engine', prompt, (prov) =>
      prov.generateStructuredJSON<ATSReport>(prompt, SYSTEM_INSTRUCTIONS.ATS_ENGINE)
    );
  }

  // ==========================================
  // MODULE 4: AI RESUME OPTIMIZER
  // ==========================================
  public async optimizeResume(resumeText: string): Promise<OptimizedResume> {
    const prompt = `Optimize the following resume to sound highly impact-oriented and clear:\n\n${resumeText}`;
    return this.executeWithLogging<OptimizedResume>('Resume Optimizer', prompt, (prov) =>
      prov.generateStructuredJSON<OptimizedResume>(prompt, SYSTEM_INSTRUCTIONS.RESUME_OPTIMIZER)
    );
  }

  // ==========================================
  // MODULE 5: AI COVER LETTER
  // ==========================================
  public async generateCoverLetter(req: CoverLetterRequest): Promise<CoverLetterResponse> {
    const prompt = `Draft a cover letter with these parameters:
Job Title: ${req.jobTitle}
Company Name: ${req.companyName}
Job Description: ${req.jobDescription || 'Standard requirements'}
Candidate Name: ${req.candidateName}
Skills: ${req.skills.join(', ')}
Brief Experience: ${req.experienceBrief || 'N/A'}
Tone: ${req.tone}
Length: ${req.length}`;

    return this.executeWithLogging<CoverLetterResponse>('Cover Letter', prompt, (prov) =>
      prov.generateStructuredJSON<CoverLetterResponse>(prompt, SYSTEM_INSTRUCTIONS.COVER_LETTER)
    );
  }

  // ==========================================
  // MODULE 6: SKILL GAP ANALYSIS
  // ==========================================
  public async analyzeSkillGap(currentSkills: string[], targetJobTitle: string): Promise<SkillGapReport> {
    const prompt = `Current Skills: ${currentSkills.join(', ')}\nTarget Job: ${targetJobTitle}`;
    return this.executeWithLogging<SkillGapReport>('Skill Gap Analysis', prompt, (prov) =>
      prov.generateStructuredJSON<SkillGapReport>(prompt, SYSTEM_INSTRUCTIONS.SKILL_GAP)
    );
  }

  // ==========================================
  // MODULE 7: CAREER ROADMAP
  // ==========================================
  public async generateCareerRoadmap(targetRole: string, timeframeMonths: number): Promise<CareerRoadmap> {
    const prompt = `Target Role: ${targetRole}\nTimeframe: ${timeframeMonths} months`;
    return this.executeWithLogging<CareerRoadmap>('Career Roadmap', prompt, (prov) =>
      prov.generateStructuredJSON<CareerRoadmap>(prompt, SYSTEM_INSTRUCTIONS.CAREER_ROADMAP)
    );
  }

  // ==========================================
  // MODULE 8: INTERVIEW COACH
  // ==========================================
  public async generateInterviewQuestions(
    jobTitle: string,
    difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
  ): Promise<InterviewQuestion[]> {
    const prompt = `Generate standard interview questions for the job title "${jobTitle}" at ${difficulty} difficulty level.`;
    return this.executeWithLogging<InterviewQuestion[]>('Interview Coach Questions', prompt, (prov) =>
      prov.generateStructuredJSON<InterviewQuestion[]>(prompt, SYSTEM_INSTRUCTIONS.INTERVIEW_COACH)
    );
  }

  public async evaluateInterviewAnswer(question: string, answer: string): Promise<InterviewEvaluation> {
    const prompt = `Question: ${question}\nCandidate Answer: ${answer}`;
    return this.executeWithLogging<InterviewEvaluation>('Interview Coach Evaluation', prompt, (prov) =>
      prov.generateStructuredJSON<InterviewEvaluation>(prompt, `Evaluate this interview answer: ${SYSTEM_INSTRUCTIONS.INTERVIEW_COACH}`)
    );
  }

  // ==========================================
  // MODULE 9: EMPLOYER AI
  // ==========================================
  public async analyzeCandidateForEmployer(
    candidateId: string,
    resumeText: string,
    jobRequirements: string
  ): Promise<EmployerCandidateAnalysis> {
    const prompt = `Candidate ID: ${candidateId}\nResume text:\n${resumeText}\n\nJob Requirements:\n${jobRequirements}`;
    return this.executeWithLogging<EmployerCandidateAnalysis>('Employer AI', prompt, (prov) =>
      prov.generateStructuredJSON<EmployerCandidateAnalysis>(prompt, SYSTEM_INSTRUCTIONS.EMPLOYER_AI)
    );
  }

  // ==========================================
  // MODULE 10: ADMIN AI
  // ==========================================
  public async moderateJobListing(jobTitle: string, jobDescription: string): Promise<AdminModerationReport> {
    const prompt = `Job Title: ${jobTitle}\nDescription:\n${jobDescription}`;
    return this.executeWithLogging<AdminModerationReport>('Admin AI', prompt, (prov) =>
      prov.generateStructuredJSON<AdminModerationReport>(prompt, SYSTEM_INSTRUCTIONS.ADMIN_AI)
    );
  }

  // ==========================================
  // MODULE 11: AI NATURAL LANGUAGE SEARCH
  // ==========================================
  public async parseNaturalSearch(query: string): Promise<{
    titleQuery: string;
    location: string;
    isRemote: boolean;
    minSalary: number;
    skills: string[];
    employmentType: string;
  }> {
    const prompt = `Search Query: "${query}"`;
    return this.executeWithLogging<{
      titleQuery: string;
      location: string;
      isRemote: boolean;
      minSalary: number;
      skills: string[];
      employmentType: string;
    }>('AI Natural Search', prompt, (prov) =>
      prov.generateStructuredJSON<{
        titleQuery: string;
        location: string;
        isRemote: boolean;
        minSalary: number;
        skills: string[];
        employmentType: string;
      }>(prompt, SYSTEM_INSTRUCTIONS.SEARCH_AI)
    );
  }

  // ==========================================
  // MODULE 12: AI CHATBOT PLATFORM ASSISTANT
  // ==========================================
  public async chatAssistant(message: string, history: AIChatMessage[]): Promise<string> {
    const historySnippet = history
      .slice(-6)
      .map((m) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join('\n');

    const prompt = `Conversation history:\n${historySnippet}\n\nUser: ${message}\n\nAssistant:`;
    
    return this.executeWithLogging<string>('Chat Assistant', prompt, (prov) =>
      prov.generateText(
        prompt,
        'You are the friendly, helpful career counselor and general technical job search assistant on JOB Lo, a premier AI Career Platform. Provide clear, smart, encouraging advice.'
      )
    );
  }
}

export const aiService = AIService.getInstance();
