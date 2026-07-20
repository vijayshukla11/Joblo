import { adminService, AdminUser, AdminJobSeeker, CompanyVerification, AdminCategory, SiteSettings, AdminActivity, AdminAuthor, AutomationWebhook } from '../services/adminService';

export class AdminRepository {
  /**
   * Fetch all system/portal users
   */
  async getUsers(): Promise<AdminUser[]> {
    return adminService.getUsers();
  }

  /**
   * Save / update system user info
   */
  async saveUser(user: AdminUser): Promise<AdminUser> {
    return adminService.saveUser(user);
  }

  /**
   * Retrieve all job seekers
   */
  async getJobSeekers(): Promise<AdminJobSeeker[]> {
    return adminService.getJobSeekers();
  }

  /**
   * Retrieve company verifications
   */
  async getCompanyVerifications(): Promise<CompanyVerification[]> {
    return adminService.getCompanyVerifications();
  }

  /**
   * Save or update company verification logs
   */
  async saveCompanyVerification(verification: CompanyVerification): Promise<CompanyVerification> {
    return adminService.saveCompanyVerification(verification);
  }

  /**
   * Get newsletter subscriptions
   */
  async getNewsletterSubscribers(): Promise<{ id: string; email: string; subscribedAt: string }[]> {
    return adminService.getNewsletterSubscribers();
  }

  /**
   * Get contact form queries
   */
  async getContactMessages(): Promise<any[]> {
    return adminService.getContactMessages();
  }

  /**
   * Submit reply to a contact form
   */
  async replyToContactMessage(id: string, replyMessage: string): Promise<boolean> {
    const messages = await adminService.getContactMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index >= 0) {
      const updated = {
        ...messages[index],
        status: 'Resolved' as const,
        replyMessage,
        updated_at: new Date().toISOString()
      };
      await adminService.saveContactMessage(updated);
      return true;
    }
    return false;
  }

  /**
   * Retrieve system and security audits
   */
  async getActivities(): Promise<AdminActivity[]> {
    return adminService.getActivities();
  }

  /**
   * Fetch editorial authors
   */
  async getAuthors(): Promise<AdminAuthor[]> {
    return adminService.getAuthors();
  }

  /**
   * Manage active webhooks
   */
  async getWebhooks(): Promise<AutomationWebhook[]> {
    return adminService.getWebhooks();
  }

  /**
   * Create or update system webhook
   */
  async saveWebhook(webhook: AutomationWebhook): Promise<AutomationWebhook> {
    return adminService.saveWebhook(webhook);
  }
}

export const adminRepository = new AdminRepository();
export default adminRepository;
