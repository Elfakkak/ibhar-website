import 'server-only';
import { createClient } from '@supabase/supabase-js';
export function submissionsEnabled(){return process.env.QUOTE_SUBMISSIONS_ENABLED==='true' && Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY && process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);}
export function getDatabase(){
 const url=process.env.SUPABASE_URL; const key=process.env.SUPABASE_SECRET_KEY;
 if(!url||!key)throw new Error('Quote database not configured');
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
