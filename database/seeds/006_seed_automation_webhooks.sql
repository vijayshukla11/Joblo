-- SQL Seed File: 006_seed_automation_webhooks.sql
-- Description: Seed initial mock data for automation webhooks and scrapper schedulers

INSERT INTO public.admin_automation_webhooks (name, endpoint_url, method, interval_schedule, status, is_active)
VALUES
(
  'National Gazette Scraper', 
  'https://n8n.joblo.in/webhook/v1/national-gazette-scraper', 
  'POST', 
  'Every 4 Hours', 
  'Healthy', 
  TRUE
),
(
  'Drizzle Table Index Optimization', 
  'https://n8n.joblo.in/webhook/v1/optimize-database-indexes', 
  'POST', 
  'Every 24 Hours', 
  'Healthy', 
  TRUE
),
(
  'OpenAI/Gemini Cache Eviction', 
  'https://n8n.joblo.in/webhook/v1/evict-llm-cache', 
  'GET', 
  'Every 30 Minutes', 
  'Healthy', 
  TRUE
)
ON CONFLICT (endpoint_url) DO NOTHING;
