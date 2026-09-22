import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rmuavgxoyayanmbimmwc.supabase.co';

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_oDSjGioVK3JisOekB3-Dxw_ySb9SmaP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);