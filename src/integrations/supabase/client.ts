import { environment } from '../../config/environment';
import { Job } from '../../types';
import { MOCK_JOBS } from '../../constants';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

// Local Storage Helper functions to manage the simulated Supabase database tables
const getLocalTable = (table: string): any[] => {
  const key = `jl_table_${table}`;
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Pre-populate tables on first load
  if (table === 'jobs' || table === 'public.jobs') {
    localStorage.setItem(key, JSON.stringify(MOCK_JOBS));
    return MOCK_JOBS;
  }

  if (table === 'applications' || table === 'job_applications' || table === 'public.job_applications') {
    const defaultApps = [
      {
        id: 'app-1',
        user_id: 'usr_default',
        job_id: 'job-1',
        resume_url: 'https://example.com/resumes/default_resume.pdf',
        status: 'Sourced (Automated Scan Passed)',
        stage: 'Under Review',
        applied_at: 'Today, 14:20 IST'
      },
      {
        id: 'app-2',
        user_id: 'usr_default',
        job_id: 'job-2',
        resume_url: 'https://example.com/resumes/default_resume.pdf',
        status: 'Webhook Transferred',
        stage: 'Queued',
        applied_at: 'Yesterday, 10:00 IST'
      }
    ];
    localStorage.setItem(key, JSON.stringify(defaultApps));
    return defaultApps;
  }

  return [];
};

const setLocalTable = (table: string, data: any[]) => {
  localStorage.setItem(`jl_table_${table}`, JSON.stringify(data));
};

// Builder class for chaining Supabase-like queries in simulation mode
class SupabaseQueryBuilder {
  private table: string;
  private filters: Array<(item: any) => boolean> = [];

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => {
      if (item[column] === undefined) return false;
      return String(item[column]) === String(value);
    });
    return this;
  }

  match(query: Record<string, any>) {
    this.filters.push((item) => {
      return Object.entries(query).every(([col, val]) => String(item[col]) === String(val));
    });
    return this;
  }

  // Support thenable for standard async/await usage
  async then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any[] | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<any> {
    try {
      const data = getLocalTable(this.table);
      const filtered = data.filter(item => this.filters.every(fn => fn(item)));
      const result = { data: filtered, error: null };
      if (onfulfilled) {
        return Promise.resolve(onfulfilled(result));
      }
      return result;
    } catch (err: any) {
      const result = { data: null, error: err instanceof Error ? err : new Error(String(err)) };
      if (onrejected) {
        return Promise.resolve(onrejected(result));
      }
      return result;
    }
  }

  async single() {
    const data = getLocalTable(this.table);
    const filtered = data.filter(item => this.filters.every(fn => fn(item)));
    const item = filtered[0] || null;
    return { data: item, error: item ? null : new Error('Row not found') };
  }

  async maybeSingle() {
    const data = getLocalTable(this.table);
    const filtered = data.filter(item => this.filters.every(fn => fn(item)));
    const item = filtered[0] || null;
    return { data: item, error: null };
  }

  async insert(rowOrRows: any) {
    const rows = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
    const data = getLocalTable(this.table);
    const newRows = rows.map(r => ({
      id: r.id || 'id_' + Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...r
    }));
    const updated = [...data, ...newRows];
    setLocalTable(this.table, updated);
    return { data: Array.isArray(rowOrRows) ? newRows : newRows[0], error: null };
  }

  async upsert(rowOrRows: any) {
    const rows = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
    const data = getLocalTable(this.table);
    const updatedRows: any[] = [];
    const currentData = [...data];

    for (const r of rows) {
      const idx = currentData.findIndex(item => 
        (r.id && String(item.id) === String(r.id)) || 
        (r.user_id && String(item.user_id) === String(r.user_id))
      );

      const updatedRow = {
        id: r.id || (idx >= 0 ? currentData[idx].id : 'id_' + Math.random().toString(36).substring(2, 11)),
        created_at: idx >= 0 ? currentData[idx].created_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...r
      };

      if (idx >= 0) {
        currentData[idx] = updatedRow;
      } else {
        currentData.push(updatedRow);
      }
      updatedRows.push(updatedRow);
    }

    setLocalTable(this.table, currentData);
    return { data: Array.isArray(rowOrRows) ? updatedRows : updatedRows[0], error: null };
  }

  async update(updates: any) {
    const data = getLocalTable(this.table);
    const affectedRows: any[] = [];
    const updated = data.map(item => {
      const matches = this.filters.every(fn => fn(item));
      if (matches) {
        const newItem = { ...item, ...updates, updated_at: new Date().toISOString() };
        affectedRows.push(newItem);
        return newItem;
      }
      return item;
    });
    setLocalTable(this.table, updated);
    return { data: affectedRows, error: null };
  }

  async delete() {
    const data = getLocalTable(this.table);
    const remaining = data.filter(item => !this.filters.every(fn => fn(item)));
    setLocalTable(this.table, remaining);
    return { data: null, error: null };
  }
}

class SupabaseStorageBucket {
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  async upload(path: string, file: File | Blob) {
    return new Promise<{ data: { path: string } | null; error: Error | null }>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const base64data = reader.result as string;
          const storageKey = `jl_storage_${this.bucketName}_${path}`;
          localStorage.setItem(storageKey, base64data);
          resolve({ data: { path }, error: null });
        } catch (e: any) {
          resolve({ data: null, error: e instanceof Error ? e : new Error(String(e)) });
        }
      };
      reader.onerror = () => {
        resolve({ data: null, error: new Error('File reading failed') });
      };
      reader.readAsDataURL(file);
    });
  }

  async remove(paths: string[]) {
    paths.forEach(p => {
      const storageKey = `jl_storage_${this.bucketName}_${p}`;
      localStorage.removeItem(storageKey);
    });
    return { data: null, error: null };
  }

  getPublicUrl(path: string) {
    const storageKey = `jl_storage_${this.bucketName}_${path}`;
    const data = localStorage.getItem(storageKey);
    return {
      data: {
        publicUrl: data || `https://example.com/storage/${this.bucketName}/${path}`
      }
    };
  }
}

class SupabaseStorageClient {
  from(bucket: string) {
    return new SupabaseStorageBucket(bucket);
  }
}

class SimulatedAuthClient {
  async getSession() {
    const savedUser = localStorage.getItem('jl_auth_user');
    return {
      data: {
        session: savedUser ? { user: JSON.parse(savedUser) } : null
      },
      error: null
    };
  }

  async signInWithPassword({ email, password }: any) {
    if (email.includes('error') || password === 'error') {
      return { data: { user: null }, error: new Error('Invalid credentials') };
    }
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      email,
      user_metadata: {
        name: email.split('@')[0],
        role: email.includes('admin') ? 'Admin' : (email.includes('employer') ? 'Employer' : 'Applicant')
      }
    };
    localStorage.setItem('jl_auth_user', JSON.stringify(mockUser));
    return { data: { user: mockUser }, error: null };
  }

  async signUp({ email, password, options }: any) {
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      email,
      user_metadata: {
        name: options?.data?.name || email.split('@')[0],
        role: options?.data?.role || 'Applicant'
      }
    };
    localStorage.setItem('jl_auth_user', JSON.stringify(mockUser));
    return { data: { user: mockUser }, error: null };
  }

  async signOut() {
    localStorage.removeItem('jl_auth_user');
    return { error: null };
  }
}

class SupabaseClientProxy {
  public storage: any;
  public auth: any;

  constructor() {
    this.storage = isSupabaseConfigured ? supabase!.storage : new SupabaseStorageClient();
    this.auth = isSupabaseConfigured ? supabase!.auth : new SimulatedAuthClient();
  }

  isConfigured(): boolean {
    return isSupabaseConfigured;
  }

  from(table: string): any {
    if (isSupabaseConfigured && supabase) {
      return supabase.from(table);
    }
    return new SupabaseQueryBuilder(table);
  }

  // Backwards compatibility helper
  async getSession() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession();
      return {
        user: data.session?.user || null,
        active: !!data.session
      };
    }
    const savedUser = localStorage.getItem('jl_auth_user');
    return { 
      user: savedUser ? JSON.parse(savedUser) : null, 
      active: !!savedUser 
    };
  }
}

export const supabaseClient = new SupabaseClientProxy();
export default supabaseClient;
