-- SQL Migration: 007_telemetry_and_security_schema.sql
-- Description: Define database schemas for AI LLM monitoring logs, cybersecurity firewalls, and system auditing registers.

-- 1. Create AI LLM Monitoring logs table
CREATE TABLE IF NOT EXISTS public.admin_ai_monitoring_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL DEFAULT 'gemini-2.5-flash',
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Success', -- 'Success', 'Timeout', 'RateLimit', 'Error'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Security/Firewall audit logs table
CREATE TABLE IF NOT EXISTS public.admin_security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    severity VARCHAR(50) DEFAULT 'Low', -- 'Low', 'Medium', 'Critical'
    action_taken VARCHAR(100) DEFAULT 'Logged', -- 'Logged', 'IP Blocked', 'Captcha Enforced'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
