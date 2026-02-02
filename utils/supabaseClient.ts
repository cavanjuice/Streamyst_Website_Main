
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const supabaseUrl = "https://ssdjhkdkoqgmysgncfqa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZGpoa2Rrb3FnbXlzZ25jZnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTUwMzEsImV4cCI6MjA4NDUzMTAzMX0.zmuTUQ92kGOTBtXTu0GrqzctdRYgVZ4jn0D_ruzBmcM";

console.log("Initializing Supabase Client...");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  console.log("Attempting to save email to waitlist:", email);
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select();

    if (error) {
      if (error.code === '23505') {
        console.log('Email already registered, treating as success.');
        return { error: null, data }; 
      }
      console.error('Supabase Waitlist INSERT Error:', error);
      alert(`Database Error: ${error.message}`);
      return { error };
    }
    console.log('Successfully saved to waitlist:', data);
    return { data, error: null };
  } catch (err: any) {
    console.error('Supabase Client Exception:', err);
    alert(`Client Error: ${err.message}`);
    return { error: err };
  }
};

/**
 * Saves full survey JSON to the 'surveys' table.
 */
export const saveSurveyResponse = async (surveyData: SurveyResponse) => {
  console.log("Attempting to save survey data...", surveyData);
  try {
    const payload = {
      user_type: surveyData.userType,
      email: surveyData.email,
      response_data: surveyData
    };

    const { data, error } = await supabase
      .from('surveys')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase Survey INSERT Error:', error);
      return { error };
    }
    console.log('Successfully saved survey:', data);
    return { data, error: null };
  } catch (err: any) {
    console.error('Supabase Client Exception:', err);
    return { error: err };
  }
};

/**
 * Helper to get the public URL for a file in the 'assets' bucket.
 * Handles URL encoding automatically.
 */
export const getAssetUrl = (filename: string) => {
  const { data } = supabase.storage.from('assets').getPublicUrl(filename);
  return data.publicUrl;
};

/**
 * Deprecated: Use getAssetUrl for 'assets' bucket items.
 */
export const getStorageUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
