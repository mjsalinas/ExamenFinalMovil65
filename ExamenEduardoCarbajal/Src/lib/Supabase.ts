import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://wqqxtlqyvfvfbzwcbfcr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcXh0bHF5dmZ2ZmJ6d2NiZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMzc2ODIsImV4cCI6MjEwNTYxMzY4Mn0.qXmXg_ccU5h_GTjPhErZ5ojOeMb9fMNJroxBLlgMp2k';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);