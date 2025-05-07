
import { createClient } from '@supabase/supabase-js';

// Define custom database types
export type Tables = {
  jobs: {
    Row: {
      id: string;
      title: string;
      company: string;
      location: string;
      salary_min?: number;
      salary_max?: number;
      job_type: string;
      experience_level: string;
      remote: boolean;
      description: string;
      posted_at: string;
      source: string;
      updated_at?: string;
    };
    Insert: {
      id?: string;
      title: string;
      company: string;
      location: string;
      salary_min?: number;
      salary_max?: number;
      job_type: string;
      experience_level: string;
      remote: boolean;
      description: string;
      posted_at?: string;
      source: string;
      updated_at?: string;
    };
    Update: {
      title?: string;
      company?: string;
      location?: string;
      salary_min?: number;
      salary_max?: number;
      job_type?: string;
      experience_level?: string;
      remote?: boolean;
      description?: string;
      posted_at?: string;
      source?: string;
      updated_at?: string;
    };
  };
  saved_jobs: {
    Row: {
      id: number;
      user_id: string;
      job_id: string;
      created_at: string;
    };
    Insert: {
      id?: number;
      user_id: string;
      job_id: string;
      created_at?: string;
    };
    Update: {
      user_id?: string;
      job_id?: string;
      created_at?: string;
    };
  };
  profiles: {
    Row: {
      id: string;
      email: string;
      name: string | null;
      avatar_url: string | null;
      created_at: string;
      updated_at: string;
    };
  };
};

// Type-safe Supabase client
export const customSupabaseClient = createClient<{ 
  public: { 
    Tables: Tables;
  } 
}>(
  "https://yhlnoxglrujikjztwdrc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlobG5veGdscnVqaWtqenR3ZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMTMzNTIsImV4cCI6MjA2MTg4OTM1Mn0.zZPaZzTSMpzam1cMn5nT1Oj8xqXAeMg4qWI6P08st44"
);
