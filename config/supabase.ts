
// Supabase configuration
// This file helps manage Supabase connection settings

export const supabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // Check if Supabase is properly configured
  isConfigured(): boolean {
    return !!(this.url && this.anonKey && 
              this.url !== 'YOUR_SUPABASE_URL' && 
              this.anonKey !== 'YOUR_SUPABASE_ANON_KEY');
  },
  
  // Get the edge function URL
  getEdgeFunctionUrl(functionName: string): string {
    return `${this.url}/functions/v1/${functionName}`;
  },
  
  // Get headers for edge function calls
  getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.anonKey}`,
    };
  },
};

// Log configuration status (for debugging)
if (__DEV__) {
  console.log('Supabase configured:', supabaseConfig.isConfigured());
  if (!supabaseConfig.isConfigured()) {
    console.warn('⚠️ Supabase not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file');
  }
}
