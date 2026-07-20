import { environment } from '../../config/environment';

export interface AutomationTriggerOptions {
  workflowId: string;
  payload: Record<string, any>;
}

class N8NAutomationGateway {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = environment.n8n.webhookUrl;
  }

  isConfigured(): boolean {
    return !!this.webhookUrl;
  }

  async triggerWorkflow(options: AutomationTriggerOptions): Promise<{ success: boolean; data?: any }> {
    if (!this.isConfigured()) {
      console.log(`[n8n Integration] Dry-run trigger for workflow "${options.workflowId}".`, options.payload);
      return { success: true, data: { status: 'mock_delivered', timestamp: new Date().toISOString() } };
    }

    try {
      const url = `${this.webhookUrl}/${options.workflowId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.payload),
      });

      if (!response.ok) {
        throw new Error(`n8n gateway returned status code ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('[n8n Integration] Failed to trigger workflow:', error);
      return { success: false, data: error };
    }
  }
}

export const n8nGateway = new N8NAutomationGateway();
export default n8nGateway;
