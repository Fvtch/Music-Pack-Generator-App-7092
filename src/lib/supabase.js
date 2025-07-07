import { createClient } from '@supabase/supabase-js'

// Project ID will be auto-injected during deployment
const SUPABASE_URL = 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = 'placeholder-key'

// Create a mock client if credentials are not available
let supabase;

try {
  if (SUPABASE_URL === 'https://placeholder.supabase.co' || SUPABASE_ANON_KEY === 'placeholder-key') {
    // Mock Supabase client for demo purposes
    supabase = {
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: 'mock-path' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '/audio/placeholder.mp3' } })
        })
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    };
  } else {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
} catch (error) {
  console.warn('Supabase not configured, using mock client');
  // Fallback mock client
  supabase = {
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '/audio/placeholder.mp3' } })
      })
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  };
}

export default supabase;