/* JEE NEXUS V2 frontend configuration.
 * Safe to commit: public URL/anon keys are not service-role secrets.
 * Keep server secrets in Netlify environment variables, never in this file.
 * Leave these blank for the local UI preview.
 */
window.JEE_NEXUS_CONFIG = Object.freeze({
  supabaseUrl: '',
  supabaseAnonKey: ''
});
