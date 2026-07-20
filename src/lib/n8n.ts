/**
 * n8n Automation & Integration Gateway
 * 
 * Provides client handlers to trigger active n8n workflow webhooks
 * for background job ingestion, sitemap updating, and notification syncs.
 */

export interface AutomationTriggerOptions {
  workflowId: string;
  payload: Record<string, any>;
}

class N8NAutomationGateway {
  private n8nBaseUrl: string | undefined;

  constructor() {
    this.n8nBaseUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  }

  isConfigured(): boolean {
    return !!this.n8nBaseUrl;
  }

  /**
   * Dispatches custom actions to active webhook listeners.
   */
  async triggerWorkflow(options: AutomationTriggerOptions): Promise<{ success: boolean; data?: any }> {
    if (!this.isConfigured()) {
      console.log(`[n8n Automation] Triggered workflow "${options.workflowId}" in dry-run mode (URL is unconfigured).`, options.payload);
      return { success: true, data: { status: 'mock_delivered', timestamp: new Date().toISOString() } };
    }

    try {
      const url = `${this.n8nBaseUrl}/${options.workflowId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.payload),
      });

      if (!response.ok) {
        throw new Error(`n8n workflow trigger returned bad status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error(`[n8n Automation Error] Failed to trigger workflow "${options.workflowId}":`, err);
      return { success: false };
    }
  }
}

export const n8nGateway = new N8NAutomationGateway();
export default n8nGateway;
