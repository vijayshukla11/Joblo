/**
 * Cloud Run & GitHub CI/CD Deployment configurations.
 * Sourced by pipeline hooks for canary and blue-green container scheduling.
 */
export const deploymentConfig = {
  platform: 'google-cloud-run',
  region: 'asia-east1',
  serviceName: 'job-lo-frontend',
  maxInstances: 10,
  memoryLimit: '512Mi',
  cpuAllocated: 1,
  canaryWeightPercentage: 10,
  healthCheckPath: '/api/health',
};
