const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rywkpbxuukhxwryfkvab.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5d2twYnh1dWtoeHdyeWZrdmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjU3NjQsImV4cCI6MjA5MDQ0MTc2NH0.zFOPUMfq2R6e88vq-4YzxG1Zo2PC1V0XvrxOSDN5OJc';

// Using anon key as this is a demonstration of backend validation connecting to the same Supabase.
// In a highly secure production system, a SERVICE_ROLE_KEY would be preferable.
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
