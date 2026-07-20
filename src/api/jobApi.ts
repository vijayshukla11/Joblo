import { jobRepository } from '../repositories/jobRepository';
import { Job, GovernmentJob } from '../types';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  isOffline?: boolean;
}

export class JobApi {
  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async fetchAllJobs(options?: {
    forceError?: boolean;
    simulateOffline?: boolean;
    delayMs?: number;
  }): Promise<ApiResponse<Job[]>> {
    const delay = options?.delayMs ?? 300;
    await this.simulateDelay(delay);

    if (options?.simulateOffline) {
      return {
        data: [],
        status: 0,
        message: 'Network connection lost. Please check your internet connection.',
        isOffline: true
      };
    }

    if (options?.forceError) {
      return {
        data: [],
        status: 500,
        message: 'Internal Database Server Exception. Failed to load corporate job feed.'
      };
    }

    const data = await jobRepository.getJobs();
    return {
      data,
      status: 200,
      message: 'OK'
    };
  }

  async fetchGovernmentJobs(options?: {
    forceError?: boolean;
    simulateOffline?: boolean;
    delayMs?: number;
  }): Promise<ApiResponse<GovernmentJob[]>> {
    const delay = options?.delayMs ?? 300;
    await this.simulateDelay(delay);

    if (options?.simulateOffline) {
      return {
        data: [],
        status: 0,
        message: 'Offline state detected.',
        isOffline: true
      };
    }

    if (options?.forceError) {
      return {
        data: [],
        status: 500,
        message: 'Failed to synchronize public sector databases.'
      };
    }

    const data = await jobRepository.getGovernmentJobs();
    return {
      data,
      status: 200,
      message: 'OK'
    };
  }
}

export const jobApi = new JobApi();
