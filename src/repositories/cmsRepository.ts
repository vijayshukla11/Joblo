import { adminService, AdminBlog, CareerResource, AdminCategory } from '../services/adminService';
import { GovernmentJob } from '../types';

export class CMSRepository {
  /**
   * Fetch all CMS categories
   */
  async getCategories(): Promise<AdminCategory[]> {
    return adminService.getCategories();
  }

  /**
   * Save or update CMS category
   */
  async saveCategory(category: AdminCategory): Promise<AdminCategory> {
    return adminService.saveCategory(category);
  }

  /**
   * Fetch all blog articles
   */
  async getBlogs(): Promise<AdminBlog[]> {
    return adminService.getBlogs();
  }

  /**
   * Create or update a blog article
   */
  async saveBlog(blog: AdminBlog): Promise<AdminBlog> {
    return adminService.saveBlog(blog);
  }

  /**
   * Permanently delete a blog article
   */
  async deleteBlog(blogId: string): Promise<boolean> {
    await adminService.deleteBlog(blogId);
    return true;
  }

  /**
   * Fetch all career resources / guides
   */
  async getCareerResources(): Promise<CareerResource[]> {
    return adminService.getCareerResources();
  }

  /**
   * Create or update career preparation content
   */
  async saveCareerResource(resource: CareerResource): Promise<CareerResource> {
    return adminService.saveCareerResource(resource);
  }

  /**
   * Fetch government job notifications from the database
   */
  async getGovernmentJobs(): Promise<GovernmentJob[]> {
    return adminService.getGovernmentJobs();
  }

  /**
   * Create or update government job notification
   */
  async saveGovernmentJob(job: GovernmentJob): Promise<GovernmentJob> {
    return adminService.saveGovernmentJob(job);
  }
}

export const cmsRepository = new CMSRepository();
export default cmsRepository;
