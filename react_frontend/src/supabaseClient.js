import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ueyfoyrcjlrlmmzbonok.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleWZveXJjamxybG1temJvbm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzY2MTEsImV4cCI6MjA3MTY1MjYxMX0.Qxhc7ptryIsT4gB83Mxo5tzRb0vZLs-RDOziON3lPcg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
