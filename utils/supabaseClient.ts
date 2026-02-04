
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
  trackEvent('waitlist_submission_attempt', { email_domain: email.split('@')[1] });

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select();

    if (error) {
      if (error.code === '23505') {
        console.log('Email already registered, treating as success.');
        trackEvent('waitlist_submission_duplicate');
        return { error: null, data }; 
      }
      console.error('Supabase Waitlist INSERT Error:', error);
      trackEvent('waitlist_submission_error', { error: error.message });
      alert(`Database Error: ${error.message}`);
      return { error };
    }
    console.log('Successfully saved to waitlist:', data);
    trackEvent('waitlist_submission_success');
    return { data, error: null };
  } catch (err: any) {
    console.error('Supabase Client Exception:', err);
    trackEvent('waitlist_client_exception', { error: err.message });
    alert(`Client Error: ${err.message}`);
    return { error: err };
  }
};

/**
 * Saves full survey JSON to the 'surveys' table.
 */
export const saveSurveyResponse = async (surveyData: SurveyResponse) => {
  console.log("Attempting to save survey data...", surveyData);
  trackEvent('survey_submission_start', { userType: surveyData.userType });

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
      trackEvent('survey_submission_error', { error: error.message });
      return { error };
    }
    console.log('Successfully saved survey:', data);
    trackEvent('survey_submission_success', { userType: surveyData.userType });
    return { data, error: null };
  } catch (err: any) {
    console.error('Supabase Client Exception:', err);
    trackEvent('survey_client_exception', { error: err.message });
    return { error: err };
  }
};

/**
 * Helper to get the public URL for a file in the 'assetscompressed' bucket.
 * Handles URL encoding automatically.
 */
export const getAssetUrl = (filename: string) => {
  const { data } = supabase.storage.from('assetscompressed').getPublicUrl(filename);
  return data.publicUrl;
};

/**
 * Deprecated: Use getAssetUrl for 'assetscompressed' bucket items.
 */
export const getStorageUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// --- ANALYTICS ENGINE ---

/**
 * Generates or retrieves a persistent session ID for analytics
 */
const getSessionId = () => {
    if (typeof window === 'undefined') return 'server-side';
    let sessionId = sessionStorage.getItem('streamyst_analytics_session');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('streamyst_analytics_session', sessionId);
    }
    return sessionId;
};

/**
 * Tracks a custom event to Supabase if consent is given.
 * Requires an 'analytics_events' table in Supabase.
 */
export const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
    // 1. STRICT GDPR CHECK
    // Only track if consent is explicitly set to 'all'
    if (typeof window !== 'undefined') {
        const consent = localStorage.getItem('streamyst_cookie_consent');
        if (consent !== 'all') {
            if (process.env.NODE_ENV === 'development') {
                console.debug(`[Analytics Blocked] ${eventName} - No Consent`);
            }
            return; 
        }
    }
    
    const sessionId = getSessionId();
    const timestamp = new Date().toISOString();
    const pagePath = typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '';

    const payload = {
        event_name: eventName,
        properties: {
            ...properties,
            screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        },
        session_id: sessionId,
        page_path: pagePath,
        created_at: timestamp
    };

    // Dev Environment Logging
    if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(`[Analytics] ${eventName}`);
        console.log(payload);
        console.groupEnd();
    }

    try {
        // Fire and forget - don't await to avoid blocking UI
        supabase.from('analytics_events').insert([payload]).then(({ error }) => {
            if (error) console.warn('Analytics sync failed:', error.message);
        });
    } catch (e) {
        // Silently fail to not disrupt user experience
    }
};
