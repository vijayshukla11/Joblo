/**
 * Unified AI Types & Interfaces for JOB Lo Platform
 */

export enum AIProviderType {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI',
  MOCK = 'MOCK'
}

export interface AIModelConfig {
  provider: AIProviderType;
  modelName: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface AIRequestLog {
  id: string;
  timestamp: string;
  module: string;
  prompt: string;
  responseTimeMs: number;
  success: boolean;
  tokensUsed?: number;
  error?: string;
}

export interface AIUsageStats {
  totalRequests: number;
  successRate: number;
  avgResponseTimeMs: number;
  moduleUsage: Record<string, number>;
  logs: AIRequestLog[];
}

// Module 2: AI Resume Parser Types
export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
    gpa?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: string[];
  languages: string[];
  achievements: string[];
  socials: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

// Module 3: ATS Score Engine Types
export interface ATSReport {
  score: number; // Out of 100
  matchPercentage: number;
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
  resumeWeaknesses: string[];
  suggestions: string[];
  formattingAdvice: string[];
  industryCompatibility: string;
}

// Module 4: AI Resume Optimizer Types
export interface OptimizedResume {
  originalScore: number;
  optimizedScore: number;
  professionalSummary: string;
  improvedBulletPoints: Array<{
    original: string;
    improved: string;
    impactExplanation: string;
  }>;
  keywordSuggestions: string[];
  achievementImprovements: string[];
  grammarImprovements: string[];
}

// Module 5: AI Cover Letter Types
export interface CoverLetterRequest {
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  candidateName: string;
  skills: string[];
  experienceBrief?: string;
  tone: 'professional' | 'creative' | 'enthusiastic' | 'confident';
  length: 'short' | 'medium' | 'long';
}

export interface CoverLetterResponse {
  subjectLine: string;
  content: string;
  metadata: {
    tone: string;
    wordCount: number;
  };
}

// Module 6: Skill Gap Analysis Types
export interface SkillGapReport {
  currentSkills: string[];
  targetJobTitle: string;
  missingSkills: string[];
  recommendedCourses: Array<{
    title: string;
    provider: string;
    link: string;
    duration: string;
    price: string;
  }>;
  learningRoadmap: Array<{
    phase: string;
    skills: string[];
    topics: string[];
    duration: string;
  }>;
  estimatedLearningTimeWeeks: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Module 7: Career Roadmap Types
export interface CareerRoadmap {
  targetRole: string;
  timeframeMonths: number;
  salaryGrowthEstimate: {
    current: string;
    year1: string;
    year2: string;
    final: string;
  };
  phases: Array<{
    title: string;
    duration: string;
    requiredSkills: string[];
    certifications: string[];
    projects: Array<{
      title: string;
      desc: string;
      tech: string[];
    }>;
  }>;
}

// Module 8: Interview Coach Types
export interface InterviewQuestion {
  id: string;
  text: string;
  type: 'technical' | 'hr' | 'behavioral' | 'company-specific';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  suggestedAnswerGuide: string;
}

export interface InterviewEvaluation {
  feedback: string;
  score: number; // 0-100
  confidenceScore: number; // 0-100
  positives: string[];
  improvements: string[];
  sampleModelAnswer: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  jobTitle: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> candidateAnswer
  evaluations: Record<string, InterviewEvaluation>; // questionId -> evaluation
  status: 'active' | 'completed';
  createdAt: string;
}

// Module 9: Employer AI Types
export interface EmployerCandidateAnalysis {
  candidateId: string;
  summary: string;
  candidateScore: number; // 0-100
  matchingSkills: string[];
  missingSkills: string[];
  rankScore: number; // overall rank weight
  duplicateDetected: boolean;
  duplicateCandidateId?: string;
  potentialFraudWarning?: string;
}

// Module 10: Admin AI Types
export interface AdminModerationReport {
  isSpam: boolean;
  spamScore: number;
  isFakeJob: boolean;
  fakeJobScore: number;
  isDuplicateJob: boolean;
  duplicateJobId?: string;
  seoSuggestions: {
    metaTitle: string;
    metaDescription: string;
    suggestedKeywords: string[];
    contentImprovements: string[];
  };
}

export interface AdminAISummary {
  totalJobsScanned: number;
  spamJobsBlocked: number;
  fraudAlertsRaised: number;
  activeModerations: number;
  recentAlerts: Array<{
    id: string;
    type: string;
    target: string;
    reason: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }>;
}

// Module 12: Chatbot Types
export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
