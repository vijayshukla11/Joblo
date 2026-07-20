-- SQL Migration: 006_automation_webhooks_schema.sql
-- Description: Define database representation for automation pipelines, scrapers, and REST Webhooks.

CREATE TABLE IF NOT EXISTS public.admin_automation_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    endpoint_url VARCHAR(512) NOT NULL,
    method VARCHAR(20) DEFAULT 'POST', -- 'POST', 'GET', 'PUT'
    interval_schedule VARCHAR(100) NOT NULL DEFAULT 'Every 24 Hours',
    last_run TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Healthy', -- 'Healthy', 'Failed', 'Paused'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updating the updated_at timestamp automatically
CREATE TRIGGER tr_admin_automation_webhooks_updated_at 
BEFORE UPDATE ON public.admin_automation_webhooks 
FOR EACH ROW EXECUTE FUNCTION public.handle_admin_tables_updated_at();
