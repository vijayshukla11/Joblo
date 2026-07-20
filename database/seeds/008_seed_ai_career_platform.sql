-- SQL Seed File: 008_seed_ai_career_platform.sql
-- Description: Seed baseline metrics and sample usage logs for the centralized AI Career Platform

-- 1. Seed AI Usage Metrics (Module 13 / 14)
INSERT INTO public.ai_usage_metrics (module, total_calls, success_count, error_count, avg_latency_ms, last_used)
VALUES
('Resume Parser', 142, 138, 4, 1150, NOW() - INTERVAL '15 minutes'),
('ATS Score Engine', 380, 375, 5, 1450, NOW() - INTERVAL '5 minutes'),
('Resume Optimizer', 95, 93, 2, 1300, NOW() - INTERVAL '1 hour'),
('Cover Letter', 210, 208, 2, 980, NOW() - INTERVAL '22 minutes'),
('Skill Gap Analysis', 312, 311, 1, 1100, NOW() - INTERVAL '2 hours'),
('Career Roadmap', 185, 182, 3, 1600, NOW() - INTERVAL '4 hours'),
('Interview Coach', 260, 252, 8, 1250, NOW() - INTERVAL '30 minutes'),
('Employer AI', 115, 115, 0, 850, NOW() - INTERVAL '12 minutes'),
('Admin AI', 88, 88, 0, 720, NOW() - INTERVAL '40 minutes'),
('AI Natural Search', 542, 538, 4, 340, NOW() - INTERVAL '2 minutes'),
('Chat Assistant', 1120, 1112, 8, 890, NOW() - INTERVAL '10 seconds')
ON CONFLICT (module) DO UPDATE 
SET total_calls = EXCLUDED.total_calls,
    success_count = EXCLUDED.success_count,
    error_count = EXCLUDED.error_count,
    avg_latency_ms = EXCLUDED.avg_latency_ms,
    last_used = EXCLUDED.last_used;

-- 2. Seed Sample AI History Logs for demonstration
INSERT INTO public.ai_history_logs (module, prompt_text, response_text, response_time_ms, success)
VALUES
('Resume Parser', 'Parse resume text: Aravind Sharma, IIT Bombay, Senior React Web Developer...', '{"name": "Aravind Sharma", "email": "aravind@example.com", "skills": ["React", "TypeScript"]}', 1120, TRUE),
('ATS Score Engine', 'Compare CV for Priya Nair against Senior UI Developer job listing...', '{"score": 85, "keywordMatch": {"matched": ["React", "Tailwind"], "missing": ["Next.js"]}}', 1320, TRUE),
('Skill Gap Analysis', 'Analyze gaps from JavaScript dev to ML Engineer path...', '{"missingSkills": ["Python", "TensorFlow"], "estimatedLearningTimeWeeks": 12}', 1080, TRUE),
('Interview Coach Evaluation', 'Question: Explain React 19 server actions. Answer: It handles data mutation natively...', '{"score": 92, "feedback": "Excellent answer explaining asynchronous hooks."}', 1140, TRUE),
('Employer AI', 'Scan candidate portfolio link and check for duplicate submissions...', '{"duplicateDetected": false, "candidateScore": 91, "matchingSkills": ["Tailwind", "Git"]}', 780, TRUE);
