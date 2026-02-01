
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// We are hardcoding these to ensure the connection works immediately without environment variable issues.
const supabaseUrl = "https://ssdjhkdkoqgmysgncfqa.supabase.co";
// This is your Anon Key (JWT)
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
      // Handle unique constraint (duplicate email) gracefully
      if (error.code === '23505') {
        console.log('Email already registered, treating as success.');
        return { error: null, data }; 
      }
      
      console.error('Supabase Waitlist INSERT Error:', error);
      alert(`Database Error: ${error.message}`); // Visible alert for debugging
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
    // We map the camelCase frontend data to snake_case DB columns
    const payload = {
      user_type: surveyData.userType,
      email: surveyData.email, // Can be null/empty
      response_data: surveyData // Store full object for flexibility
    };

    const { data, error } = await supabase
      .from('surveys')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase Survey INSERT Error:', error);
      // alert(`Survey Save Error: ${error.message}`); // Optional alert
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
 * Helper to construct public URL for images stored in Supabase Storage.
 */
export const getStorageUrl = (bucket: string, path: string) => {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};
