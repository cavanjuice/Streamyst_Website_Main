import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const supabaseUrl = "https://ssdjhkdkoqgmysgncfqa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZGpoa2Rrb3FnbXlzZ25jZnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTUwMzEsImV4cCI6MjA4NDUzMTAzMX0.zmuTUQ92kGOTBtXTu0GrqzctdRYgVZ4jn0D_ruzBmcM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- TYPES ---
export interface SurveyResponse {
  userType?: string | null;
  email?: string;
  [key: string]: any; 
}

// --- HELPER: GENERATE ID ---
const generateId = () => {
    try {
        return crypto.randomUUID();
    } catch (e) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

// --- SAFE STORAGE HELPERS ---
const safeGetItem = (storage: Storage, key: string): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    return storage.getItem(key);
  } catch (e) {
    return null;
  }
};

const safeSetItem = (storage: Storage, key: string, value: string) => {
  try {
    if (typeof window === 'undefined') return;
    storage.setItem(key, value);
  } catch (e) {}
};

// --- FUNCTIONS ---

export const saveEmailToWaitlist = async (email: string) => {
  trackEvent('waitlist_submission_attempt', { email_domain: email.split('@')[1] });

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select();

    if (error) {
      if (error.code === '23505') {
        trackEvent('waitlist_submission_duplicate');
        return { error: null, data }; 
      }
      trackEvent('waitlist_submission_error', { error: error.message });
      return { error };
    }
    trackEvent('waitlist_submission_success');
    return { data, error: null };
  } catch (err: any) {
    return { error: err };
  }
};

export const saveSurveyResponse = async (surveyData: SurveyResponse) => {
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
      trackEvent('survey_submission_error', { error: error.message });
      return { error };
    }
    trackEvent('survey_submission_success', { userType: surveyData.userType });
    return { data, error: null };
  } catch (err: any) {
    return { error: err };
  }
};

export const getAssetUrl = (filename: string) => {
  const { data } = supabase.storage.from('assetscompressed').getPublicUrl(filename);
  return data.publicUrl;
};

// --- ANALYTICS ENGINE ---

const getSessionId = () => {
    if (typeof window === 'undefined') return 'server-side';
    let sessionId = safeGetItem(sessionStorage, 'streamyst_analytics_session');
    if (!sessionId) {
        sessionId = generateId();
        safeSetItem(sessionStorage, 'streamyst_analytics_session', sessionId);
    }
    return sessionId;
};

const getVisitorId = () => {
    if (typeof window === 'undefined') return 'server-side';
    let visitorId = safeGetItem(localStorage, 'streamyst_visitor_id');
    if (!visitorId) {
        visitorId = generateId();
        safeSetItem(localStorage, 'streamyst_visitor_id', visitorId);
    }
    return visitorId;
};

export const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
    if (typeof window !== 'undefined') {
        const consent = safeGetItem(localStorage, 'streamyst_cookie_consent');
        if (consent !== 'all') return; 

        // Forward event to Google Analytics if available
        if ((window as any).gtag) {
            (window as any).gtag('event', eventName, {
                ...properties,
                session_id: getSessionId(),
                visitor_id: getVisitorId()
            });
        }
    }
    
    const sessionId = getSessionId();
    const visitorId = getVisitorId();
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
        visitor_id: visitorId,
        page_path: pagePath,
        created_at: timestamp
    };

    try {
        supabase.from('analytics_events').insert([payload]).then(({ error }) => {
            if (error && process.env.NODE_ENV === 'development') console.warn('Analytics error:', error.message);
        });
    } catch (e) {}
};