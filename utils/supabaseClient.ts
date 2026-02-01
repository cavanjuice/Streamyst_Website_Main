
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// Safely access environment variables. 
// In some environments, import.meta.env might be undefined during initialization.
const env = (import.meta as any).env || {};

// We use the provided credentials as a fallback if environment variables are not set.
// Ideally, these should be in a .env file (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
const supabaseUrl = env.VITE_SUPABASE_URL || "https://ssdjhkdkoqgmysgncfqa.supabase.co";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZGpoa2Rrb3FnbXlzZ25jZnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTUwMzEsImV4cCI6MjA4NDUzMTAzMX0.zmuTUQ92kGOTBtXTu0GrqzctdRYgVZ4jn0D_ruzBmcM";

// Initialize Client
// We export 'null' if keys are missing so the app doesn't crash in development without keys.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- TYPES ---
export interface SurveyResponse {
  userType?: string | null;
  email?: string;
  [key: string]: any; // Allow flexible survey data
}

// --- FUNCTIONS ---

/**
 * Saves an email to the 'waitlist' table.
 */
export const saveEmailToWaitlist = async (email: string) => {
  if (!supabase) {
    console.warn('[MOCK DB] Keys missing. Mocking save for:', email);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { error: null, data: { id: 'mock-id' } };
  }

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select();

    if (error) {
      // Handle unique constraint (duplicate email) gracefully
      if (error.code === '23505') {
        console.log('Email already registered');
        return { error: null, data }; // Treat as success for UX
      }
      throw error;
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('Supabase Waitlist Error:', err.message);
    return { error: err };
  }
};

/**
 * Saves full survey JSON to the 'surveys' table.
 */
export const saveSurveyResponse = async (surveyData: SurveyResponse) => {
  if (!supabase) {
    console.warn('[MOCK DB] Keys missing. Mocking survey save:', surveyData);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { error: null };
  }

  try {
    // We map the camelCase frontend data to snake_case DB columns if needed,
    // or store the whole object in a 'response_data' JSONB column.
    const payload = {
      user_type: surveyData.userType,
      email: surveyData.email, // Can be null/empty
      response_data: surveyData // Store full object for flexibility
    };

    const { data, error } = await supabase
      .from('surveys')
      .insert([payload])
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    console.error('Supabase Survey Error:', err.message);
    return { error: err };
  }
};

/**
 * Helper to construct public URL for images stored in Supabase Storage.
 * Usage: <img src={getStorageUrl('assets', 'hero-image.png')} />
 * Ensure you have a public bucket named 'assets' created in your Supabase project.
 */
export const getStorageUrl = (bucket: string, path: string) => {
  if (!supabaseUrl) return ''; 
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};
