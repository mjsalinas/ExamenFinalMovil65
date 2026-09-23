import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjtdyxuclhphrxuwmve.supabase.co';
const supabaseAnonKey = 'sb_publishable_q-1AF3BiOFIpirSmSkVz2A_e-_WZpjh'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

