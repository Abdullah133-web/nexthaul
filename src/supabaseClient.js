import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lairuysrnpsuzylttgdm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaXJ1eXNybnBzdXp5bHR0Z2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTIyNDYsImV4cCI6MjA2ODYyODI0Nn0.wOl72w9qduXxLdQkn4si0w_QPbpuIL6-DSVmR2xvg5k';

export const supabase = createClient(supabaseUrl, supabaseKey);
