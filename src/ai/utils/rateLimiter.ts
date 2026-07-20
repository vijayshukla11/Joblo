import { AIRequestLog, AIUsageStats } from '../types';

const STATS_STORAGE_KEY = 'joblo_ai_analytics_v1';

/**
 * AI Request Logger and Rate Limiter
 * Handles rate limits, token simulation, and logs usage stats.
 */
export class AIRateLimiterAndLogger {
  private static instance: AIRateLimiterAndLogger;

  private constructor() {
    this.initStats();
  }

  public static getInstance(): AIRateLimiterAndLogger {
    if (!AIRateLimiterAndLogger.instance) {
      AIRateLimiterAndLogger.instance = new AIRateLimiterAndLogger();
    }
    return AIRateLimiterAndLogger.instance;
  }

  private initStats(): void {
    if (!localStorage.getItem(STATS_STORAGE_KEY)) {
      const initialStats: AIUsageStats = {
        totalRequests: 0,
        successRate: 100,
        avgResponseTimeMs: 0,
        moduleUsage: {},
        logs: []
      };
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(initialStats));
    }
  }

  public getStats(): AIUsageStats {
    this.initStats();
    try {
      return JSON.parse(localStorage.getItem(STATS_STORAGE_KEY) || '{}') as AIUsageStats;
    } catch {
      return {
        totalRequests: 0,
        successRate: 100,
        avgResponseTimeMs: 0,
        moduleUsage: {},
        logs: []
      };
    }
  }

  public logRequest(log: Omit<AIRequestLog, 'id' | 'timestamp'>): void {
    const stats = this.getStats();
    
    const newLog: AIRequestLog = {
      ...log,
      id: `ai-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    stats.logs.unshift(newLog); // prepend
    if (stats.logs.length > 200) {
      stats.logs = stats.logs.slice(0, 200); // keep last 200 logs
    }

    stats.totalRequests += 1;
    
    // Calculate average response time
    const prevTotal = stats.totalRequests - 1;
    stats.avgResponseTimeMs = Math.round(
      (stats.avgResponseTimeMs * prevTotal + log.responseTimeMs) / stats.totalRequests
    );

    // Calculate success rate
    const successfulLogs = stats.logs.filter(l => l.success).length;
    stats.successRate = stats.logs.length > 0 
      ? Math.round((successfulLogs / stats.logs.length) * 100) 
      : 100;

    // Track module specific counts
    stats.moduleUsage[log.module] = (stats.moduleUsage[log.module] || 0) + 1;

    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    console.log(`[AI Analytics Logged] Module: ${log.module} | Success: ${log.success} | Time: ${log.responseTimeMs}ms`);
  }

  /**
   * Check if a request can be made (simple client-side rate limit)
   * Limits to 30 requests per minute per client for security and cost control
   */
  public checkRateLimit(module: string): { allowed: boolean; waitSeconds: number } {
    const stats = this.getStats();
    const oneMinuteAgo = Date.now() - 60000;
    
    const recentRequests = stats.logs.filter(
      log => new Date(log.timestamp).getTime() > oneMinuteAgo
    );

    if (recentRequests.length >= 30) {
      return { allowed: false, waitSeconds: 15 };
    }

    return { allowed: true, waitSeconds: 0 };
  }
}

export const aiAnalytics = AIRateLimiterAndLogger.getInstance();
