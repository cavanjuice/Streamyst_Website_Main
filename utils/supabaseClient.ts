
import { createClient } from '@supabase/supabase-js';

// NOTE: You need to set these environment variables in your Vercel project settings
// VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
// VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY

// Helper to find env vars across different build tools (Vite/Next/CRA)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('REACT_APP_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_ANON_KEY');

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Streamyst: Supabase keys missing. Data will be logged to console only.");
}

export const saveEmailToWaitlist = async (email: string) => {
  if (!supabase) {
    console.log('[MOCK DB] Saving email to waitlist:', email);
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }]);
    return { error };
  } catch (err) {
    console.error('Supabase error:', err);
    return { error: err };
  }
};

export const saveSurveyResponse = async (data: any) => {
  if (!supabase) {
    console.log('[MOCK DB] Saving survey response:', data);
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('surveys')
      .insert([{ 
        user_type: data.userType,
        email: data.email,
        response_data: data 
      }]);
    return { error };
  } catch (err) {
    console.error('Supabase error:', err);
    return { error: err };
  }
};
