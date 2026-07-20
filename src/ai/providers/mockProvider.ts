import { IAIProvider } from './baseProvider';
import { AIModelConfig } from '../types';

/**
 * Intelligent Mock Provider
 * Analyzes keywords in the incoming prompt and generates extremely realistic,
 * highly structured, and customized reports for each module.
 */
export class MockProvider implements IAIProvider {
  
  public async generateText(
    prompt: string,
    systemInstruction?: string,
    config?: Partial<AIModelConfig>
  ): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulating natural network lag
    
    const lowerPrompt = prompt.toLowerCase();
    
    // Check which module is being requested based on text keywords
    if (lowerPrompt.includes('interview') || lowerPrompt.includes('question')) {
      return `Based on your request, I suggest focusing on core architecture concepts, memory management, and asynchronous flow control. Here is a high-intent technical interview answer pattern:\n\n1. Use standard STAR format.\n2. Incorporate explicit metrics. For instance, 'Optimized query latency by 40%'.\n3. Describe any trade-offs you made between performance and code readability.`;
    }
    
    if (lowerPrompt.includes('cover letter')) {
      return `Dear Hiring Manager,\n\nI am thrilled to submit my application for this role. With strong foundations in modern software development and design patterns, I am confident in my ability to immediately add value to your engineering team.\n\nOver the past years, I have successfully engineered scalable web interfaces and robust database pipelines. I would love to discuss how I can contribute to your team's immediate milestones.\n\nSincerely,\nCandidate`;
    }

    return `This is a highly customized AI recommendation tailored specifically for your career goals. 
Focus on building direct hands-on portfolio apps, writing clean structured documentation, and demonstrating performance optimization benchmarks (such as keeping bundle sizes minimal and optimizing SQL querying layouts). Let me know if you would like me to build a more specific roadmap or step-by-step curriculum.`;
  }

  public async generateStructuredJSON<T>(
    prompt: string,
    systemInstruction?: string,
    config?: Partial<AIModelConfig>
  ): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate AI computation latency
    const lp = prompt.toLowerCase();
    
    // 1. Module 2: AI Resume Parser
    if (lp.includes('resume') && (lp.includes('parse') || lp.includes('extract'))) {
      const isTech = lp.includes('tech') || lp.includes('developer') || lp.includes('react') || lp.includes('engineer');
      const data = {
        name: isTech ? "Aravind Sharma" : "Priya Nair",
        email: isTech ? "aravind.sharma@example.com" : "priya.nair@example.com",
        phone: "+91 98765 43210",
        education: [
          {
            institution: isTech ? "Indian Institute of Technology (IIT), Bombay" : "Delhi University",
            degree: isTech ? "B.Tech" : "B.Com",
            fieldOfStudy: isTech ? "Computer Science and Engineering" : "Finance & Commerce",
            startYear: "2021",
            endYear: "2025",
            gpa: isTech ? "8.8/10" : "9.2/10"
          }
        ],
        experience: [
          {
            company: isTech ? "Razorpay" : "HDFC Bank",
            role: isTech ? "Software Engineering Intern" : "Financial Analyst Intern",
            location: isTech ? "Bengaluru, India" : "Mumbai, India",
            startDate: "May 2024",
            endDate: "July 2024",
            description: isTech ? [
              "Optimized checkout page loading speed by 35% using React lazy-loading and dynamic asset caching.",
              "Implemented automated Cypress testing suites, increasing test coverage from 45% to 80%."
            ] : [
              "Analyzed quarterly risk ratios for 50+ corporate loan profiles, presenting reports to regional heads.",
              "Streamlined data intake templates, saving approximately 4 hours of weekly auditing effort."
            ]
          }
        ],
        skills: isTech 
          ? ["React", "TypeScript", "Node.js", "Express", "Supabase", "Git", "Tailwind CSS", "Cypress"]
          : ["Financial Analysis", "Excel", "Data Auditing", "Risk Modeling", "Accounting", "Client Relations"],
        projects: [
          {
            title: isTech ? "CollabDoc - Realtime Editor" : "FinPort - Portfolio Tracker",
            description: isTech 
              ? "A secure real-time document workspace using CRDT matching algorithms and WebSocket channels."
              : "An automated dashboard calculating dividend tax implications and tracking real-time asset allocations.",
            technologies: isTech ? ["React", "Supabase", "TypeScript"] : ["Excel VBA", "React", "Python"],
            link: "https://github.com/example/project"
          }
        ],
        certifications: isTech 
          ? ["AWS Certified Cloud Practitioner", "React Developer Advanced Certification"]
          : ["CFA Level 1 Candidate", "NSE Certified Financial Market Expert"],
        languages: ["English", "Hindi", "Tamil"],
        achievements: [
          isTech ? "Won 1st Place in Smart India Hackathon 2024 out of 500 teams." : "Ranked 3rd in National Finance Quiz Competition.",
          "Received Outstanding Student Contribution Award."
        ],
        socials: {
          linkedin: "https://linkedin.com/in/example",
          github: isTech ? "https://github.com/example" : undefined,
          portfolio: "https://portfolio.example"
        }
      };
      return data as unknown as T;
    }
    
    // 2. Module 3: ATS Score Engine
    if (lp.includes('ats') || lp.includes('score') || lp.includes('matching')) {
      const isReact = lp.includes('react') || lp.includes('frontend') || lp.includes('typescript');
      const scoreValue = isReact ? 82 : 74;
      
      const data = {
        score: scoreValue,
        matchPercentage: scoreValue - 3,
        keywordMatch: {
          matched: isReact 
            ? ["React 19", "TypeScript", "Tailwind CSS", "Git", "Redux"]
            : ["Financial Analysis", "Data Modeling", "Excel VBA", "Risk Assessment"],
          missing: isReact 
            ? ["Next.js 15", "GraphQL", "Jest Testing", "CI/CD Pipelines"]
            : ["Tableau", "SQL Database", "Python Data Science Libraries"]
        },
        resumeWeaknesses: [
          "Lack of quantifiable business impact or numeric metrics inside task bullet points.",
          isReact ? "No mention of unit or integration testing frameworks." : "Missing database query/extraction tool references (SQL/PostgreSQL)."
        ],
        suggestions: [
          "Incorporate numbers! Replace 'Improved user interfaces' with 'Refined 12 high-priority UI paths, boosting mobile conversions by 15%'.",
          isReact ? "Add keywords like 'Jest', 'Cypress', or 'Playwright' in your technical list." : "Insert 'SQL queries', 'D3.js', or 'Tableau' to score higher in modern pipeline parsers."
        ],
        formattingAdvice: [
          "Keep your section headings completely standard (e.g., 'Work Experience' rather than 'Professional Chronicles').",
          "Remove double column layouts and graphics, as they confuse ATS parsers during scanning."
        ],
        industryCompatibility: isReact 
          ? "Highly compatible with modern product startups and agile software engineering tracks."
          : "Fitted for corporate auditing, financial services, or investment research associate programs."
      };
      return data as unknown as T;
    }
    
    // 3. Module 4: AI Resume Optimizer
    if (lp.includes('optimize') || lp.includes('improve') || lp.includes('star')) {
      const data = {
        originalScore: 58,
        optimizedScore: 89,
        professionalSummary: "High-impact, performance-driven professional with specialized experience building scalable client applications. Proven ability to translate product requirements into reusable component design systems while championing speed-to-market and code standards.",
        improvedBulletPoints: [
          {
            original: "Built website pages and worked on backend functions.",
            improved: "Spearheaded development of 8 customer-facing web screens utilizing React 19, reducing initial bundle size by 28% and increasing average session length by 14%.",
            impactExplanation: "Introduces active leadership verbs ('Spearheaded'), mentions specific tools ('React 19'), and highlights clear business outcomes ('bundle size reduced by 28%', 'session length +14%')."
          },
          {
            original: "Fixed software bugs and did testing.",
            improved: "Engineered automated Cypress test suites that captured 22 system-critical edge cases, increasing application robustness to a 99.8% crash-free rate.",
            impactExplanation: "Quantifies the scale of testing ('22 edge cases') and the direct software health impact ('99.8% crash-free rate')."
          }
        ],
        keywordSuggestions: ["Component Lifecycle", "State Reducers", "Semantic Markup", "RESTful Interfaces", "Agile Methodologies"],
        achievementImprovements: ["Quantify project achievements.", "Ensure every bullet point includes a clear tool or library name."],
        grammarImprovements: ["Eliminated 3 passive voice phrases.", "Standardized past tense verbs for completed employment roles."]
      };
      return data as unknown as T;
    }
    
    // 4. Module 5: AI Cover Letter
    if (lp.includes('cover letter') || lp.includes('letter')) {
      const title = lp.match(/jobTitle:\s*([^\n]+)/i)?.[1]?.trim() || "Software Engineer";
      const company = lp.match(/companyName:\s*([^\n]+)/i)?.[1]?.trim() || "Innovate Corp";
      
      const data = {
        subjectLine: `Application for ${title} Role - JOB Lo Candidate Referral`,
        content: `Dear Hiring Team,\n\nI am writing to express my enthusiastic interest in the ${title} position at ${company}. Having closely followed your company's incredible growth in digital services, I am eager to contribute my technical strengths and product design skills to your team's immediate pipeline milestones.\n\nIn my previous roles, I have focused heavily on building optimized user workflows, collaborating with multidisciplinary product teams, and engineering robust local or cloud database schemas. I take pride in writing pristine, well-documented code that is easily maintainable and highly performant.\n\nI am excited by the prospect of bringing this same detail-oriented energy to ${company} and helping launch upcoming features. Thank you for your time and consideration, and I look forward to discussing how my experience aligns with your engineering goals.\n\nSincerely,\nJOB Lo Career Platform Candidate`,
        metadata: {
          tone: "professional",
          wordCount: 220
        }
      };
      return data as unknown as T;
    }
    
    // 5. Module 6: Skill Gap Analysis
    if (lp.includes('gap') || lp.includes('missing') || lp.includes('course')) {
      const isData = lp.includes('data') || lp.includes('python') || lp.includes('ai');
      
      const data = {
        currentSkills: isData ? ["Python", "Pandas", "SQL"] : ["React 19", "JavaScript", "HTML/CSS"],
        targetJobTitle: isData ? "Machine Learning Engineer" : "Senior Frontend Architect",
        missingSkills: isData 
          ? ["TensorFlow", "PyTorch", "MLOps", "Docker Containerization"]
          : ["TypeScript Advanced", "Next.js 15 Server Components", "GraphQL Engine", "CI/CD Automation"],
        recommendedCourses: [
          {
            title: isData ? "Deep Learning Specialization" : "Advanced Next.js 15 Deep Dive",
            provider: isData ? "Coursera (DeepLearning.AI)" : "Frontend Masters",
            link: "https://www.coursera.org",
            duration: "4 weeks",
            price: "Free Audit available"
          },
          {
            title: isData ? "MLOps Engineering with Docker & Kubernetes" : "Production Grade TypeScript",
            provider: "Udemy",
            link: "https://www.udemy.com",
            duration: "8 hours",
            price: "₹499 (Standard Promo)"
          }
        ],
        learningRoadmap: [
          {
            phase: "Week 1-3: Architecture Foundations",
            skills: isData ? ["TensorFlow Core"] : ["TypeScript Generics & Configs"],
            topics: isData ? ["Neural Network nodes, activation loops, backpropagation"] : ["Static type boundaries, conditional types, generic utilities"],
            duration: "3 weeks"
          },
          {
            phase: "Week 4-6: Production Deployment",
            skills: isData ? ["MLOps & Docker"] : ["Next.js Server Actions"],
            topics: isData ? ["Containerizing models, setting up inference pipelines"] : ["Dynamic routing, static generation, secure API routes"],
            duration: "3 weeks"
          }
        ],
        estimatedLearningTimeWeeks: 6,
        difficulty: "Intermediate"
      };
      return data as unknown as T;
    }
    
    // 6. Module 7: Career Roadmap
    if (lp.includes('roadmap') || lp.includes('career path') || lp.includes('timeline')) {
      const isGov = lp.includes('gov') || lp.includes('bank') || lp.includes('upsc') || lp.includes('civil');
      
      const data = {
        targetRole: isGov ? "Banking Specialist (SBI PO)" : "Lead Software Engineer",
        timeframeMonths: 12,
        salaryGrowthEstimate: {
          current: isGov ? "₹5,20,000 / yr" : "₹7,20,000 / yr",
          year1: isGov ? "₹7,80,000 / yr" : "₹11,50,000 / yr",
          year2: isGov ? "₹9,50,000 / yr" : "₹15,00,000 / yr",
          final: isGov ? "₹12,00,000 / yr" : "₹22,00,000 / yr"
        },
        phases: [
          {
            title: isGov ? "Phase 1: Speed & Formulas Masterclass" : "Phase 1: Full-Stack Autonomy",
            duration: "3 Months",
            requiredSkills: isGov 
              ? ["Quantitative Shortcuts", "Logical Reasoning Speed", "Current Affairs Audits"]
              : ["Next.js 15", "Supabase Client", "Drizzle ORM", "TypeScript Type Safety"],
            certifications: isGov 
              ? ["Bank PO Mock Exam Top 5% Score Badge"]
              : ["AWS Certified Developer Associate"],
            projects: [
              {
                title: isGov ? "Personal Daily Mock Tracker" : "SaaS Ledger Workspace",
                desc: isGov 
                  ? "Track accuracy benchmarks and time-to-solve rates on reasoning puzzles."
                  : "Construct a complete invoice dashboard with real-time tax calculation, email hooks, and PDF generation.",
                tech: isGov ? ["Excel"] : ["Next.js 15", "Supabase", "Resend API"]
              }
            ]
          },
          {
            title: isGov ? "Phase 2: Descriptive Writing & Mocks" : "Phase 2: System Architecture Mastery",
            duration: "6 Months",
            requiredSkills: isGov 
              ? ["English Essay Writing", "General Banking Law", "Economic Data Analysis"]
              : ["GraphQL", "Redis Caching", "Docker Containers", "PostgreSQL Performance Optimization"],
            certifications: isGov 
              ? ["Indian Institute of Banking & Finance (IIBF) Junior Associate"]
              : ["Google Cloud Certified Cloud Architect"],
            projects: [
              {
                title: isGov ? "National Budget Analysis Essay Portfolio" : "Highly Scalable Event Hub",
                desc: isGov 
                  ? "Deep analytical essay detailing impact areas of the Union Budget."
                  : "A real-time message broker and event stream handler that scales to 10,000 concurrent updates.",
                tech: isGov ? ["Word Processing"] : ["Node.js", "Redis", "Kafka", "Docker"]
              }
            ]
          }
        ]
      };
      return data as unknown as T;
    }
    
    // 7. Module 8: Interview Coach
    if (lp.includes('interview') && lp.includes('question')) {
      const isTech = lp.includes('tech') || lp.includes('coding') || lp.includes('react') || lp.includes('javascript') || lp.includes('typescript');
      
      const data = [
        {
          id: "q-1",
          text: isTech 
            ? "Explain the difference between useEffect, useLayoutEffect, and the new useHook in React 19." 
            : "Describe a situation where you had to manage conflict within a multi-functional product team.",
          type: isTech ? "technical" : "behavioral",
          difficulty: "Medium",
          suggestedAnswerGuide: isTech 
            ? "Focus on paint timings. useEffect runs asynchronously after render paint. useLayoutEffect runs synchronously BEFORE browser paint (good for layout measurement to avoid flicker). the 'use' hook can be used inside loops or conditionals for reading promises."
            : "Structure your answer using STAR. State the context, the core disagreement, how you actively listened, suggested a data-driven consensus, and the positive project outcome."
        },
        {
          id: "q-2",
          text: isTech 
            ? "What are indexes in PostgreSQL and how do they impact write vs read speeds?" 
            : "Why do you want to join our organization specifically, and how do you envision your 12-month contribution?",
          type: isTech ? "technical" : "hr",
          difficulty: "Medium",
          suggestedAnswerGuide: isTech 
            ? "Indexes speed up read/SELECT queries by creating specialized lookup trees (e.g. B-Tree). However, they slow down write/INSERT/UPDATE queries because the database has to update the indexes too. Use indexing selectively."
            : "Align your goals with the company's core technology, service offering, or product roadmap. Highlight your ability to work autonomously and jump right into active features."
        }
      ];
      return data as unknown as T;
    }
    
    if (lp.includes('evaluate') || lp.includes('candidateanswer') || lp.includes('feedback')) {
      const data = {
        feedback: "Your answer shows strong conceptual clarity and uses appropriate industry vocabulary. To make it truly stand out, you should provide a concrete numeric example of how you applied this in a real project.",
        score: 84,
        confidenceScore: 78,
        positives: [
          "Demonstrated robust understanding of execution flow.",
          "Clear structure and logical progression in your explanation."
        ],
        improvements: [
          "Explicitly name-drop exact tools used (e.g. Next.js server actions, SQL queries).",
          "Explain the trade-offs or alternative options you would consider."
        ],
        sampleModelAnswer: "A high-fidelity answer would be: 'In my last role, we observed a 40% latency spike on user loading. I diagnosed that the secondary query was unindexed. I added a B-Tree index on company_id, which brought average query execution down from 120ms to 8ms...'"
      };
      return data as unknown as T;
    }

    // 8. Module 9: Employer AI Candidate Evaluation
    if (lp.includes('employer') && lp.includes('candidate')) {
      const score = Math.floor(Math.random() * 20) + 75;
      const data = {
        candidateId: "cand-demo-99",
        summary: "Candidate displays strong React development skills and high familiarity with Supabase. Solid documentation and beautiful design practices are evident in their project list.",
        candidateScore: score,
        matchingSkills: ["React 19", "TypeScript", "Tailwind CSS", "Git"],
        missingSkills: ["Next.js", "Jest Testing", "PostgreSQL indexing"],
        rankScore: parseFloat((score / 10).toFixed(1)),
        duplicateDetected: false,
        potentialFraudWarning: "None. Verified clean Git commit history and authentic resume structure."
      };
      return data as unknown as T;
    }

    // 9. Module 10: Admin AI Moderation
    if (lp.includes('admin') || lp.includes('moderation') || lp.includes('spam')) {
      const data = {
        isSpam: false,
        spamScore: 8,
        isFakeJob: false,
        fakeJobScore: 4,
        isDuplicateJob: false,
        seoSuggestions: {
          metaTitle: "Join Us as a Frontend Engineer - High Growth SaaS Startup",
          metaDescription: "Apply for the Frontend React Developer role. Build high-performance UI components, connect to scalable Supabase databases, and enjoy competitive salary packages in Bengaluru.",
          suggestedKeywords: ["React 19 Jobs", "SaaS Frontend Bengaluru", "Supabase Developer Positions"],
          contentImprovements: [
            "Clearly mention specific working hours or shift patterns.",
            "Explicitly list daily technologies used to trigger higher resume mapping webhooks."
          ]
        }
      };
      return data as unknown as T;
    }

    // 10. Module 11: AI Search Processing
    if (lp.includes('search') && lp.includes('query')) {
      const location = lp.includes('mumbai') ? "Mumbai" : lp.includes('bengaluru') || lp.includes('bangalore') ? "Bengaluru" : "Remote";
      const isRemote = lp.includes('remote') || location === "Remote";
      
      const data = {
        titleQuery: lp.includes('design') || lp.includes('figma') ? "Product Designer" : "React Developer",
        location: location,
        isRemote: isRemote,
        minSalary: lp.includes('high') || lp.includes('best') ? 1000000 : 500000,
        skills: lp.includes('design') ? ["Figma", "UI/UX"] : ["React", "TypeScript"],
        employmentType: isRemote ? "Remote" : "Full-time"
      };
      return data as unknown as T;
    }

    // Fallback general JSON response
    const generalData = {
      message: "AI customized suggestion crafted successfully.",
      status: "success",
      timestamp: new Date().toISOString()
    };
    return generalData as unknown as T;
  }
}
