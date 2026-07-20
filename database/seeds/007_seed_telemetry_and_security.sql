-- SQL Seed File: 007_seed_telemetry_and_security.sql
-- Description: Seed sample parameters for AI LLM trace audits and cybersecurity firewall logs

-- 1. Seed AI LLM Logs
INSERT INTO public.admin_ai_monitoring_logs (model_name, prompt_tokens, completion_tokens, latency_ms, status)
VALUES
('gemini-2.5-flash', 1420, 850, 420, 'Success'),
('gemini-2.5-pro', 8500, 2400, 1150, 'Success'),
('gemini-2.5-flash', 1900, 0, 1500, 'Timeout'),
('gemini-2.5-flash', 450, 210, 180, 'Success')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Security Logs
INSERT INTO public.admin_security_logs (event_name, ip_address, severity, action_taken)
VALUES
('SQL Injection attempts detected on search endpoint', '45.12.19.141', 'Critical', 'IP Blocked'),
('Excessive login attempts on employer gate', '192.168.1.52', 'Medium', 'Captcha Enforced'),
('Cross-Origin resource block alert', '103.5.21.90', 'Low', 'Logged'),
('Authorized DPDP audit log deletion requested', '110.12.5.4', 'Medium', 'Logged')
ON CONFLICT (id) DO NOTHING;
