import { quoteSchema } from '@/lib/quote-schema';
import { getDatabase, submissionsEnabled } from '@/lib/supabase';
export async function POST(request: Request){
 const origin=request.headers.get('origin');
 if(!origin || origin!==new URL(request.url).origin)return Response.json({error:'Origine de la demande non autorisée.'},{status:403});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'Format de demande invalide.'},{status:415});
 const reader=request.body?.getReader();if(!reader)return Response.json({error:'Demande vide.'},{status:400});
 let text='';let size=0;const decoder=new TextDecoder();
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16000){await reader.cancel();return Response.json({error:'Demande trop volumineuse.'},{status:413});}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}catch{return Response.json({error:'Demande illisible.'},{status:400});}
 let body:unknown;try{body=JSON.parse(text);}catch{return Response.json({error:'Demande invalide.'},{status:400});}
 const parsed=quoteSchema.safeParse(body);if(!parsed.success)return Response.json({error:'Vérifiez les champs de votre demande.'},{status:400});
 if(!submissionsEnabled())return Response.json({error:'L’envoi n’est pas encore disponible. Vous pouvez télécharger votre brief.'},{status:503});
 const {website,turnstile_token,consent,...data}=parsed.data;
 if(!turnstile_token)return Response.json({error:'Veuillez valider la vérification anti-robot.'},{status:400});
 try{
  const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:turnstile_token}),signal:AbortSignal.timeout(10000)});
  const verification=await verify.json();
  if(!verify.ok||!verification.success||verification.hostname!==new URL(request.url).hostname)return Response.json({error:'Vérification expirée. Veuillez réessayer.'},{status:400});
  const {error}=await getDatabase().from('website_quote_requests').insert({...data,consent_at:new Date().toISOString()});
  if(error && error.code!=='23505')return Response.json({error:'Votre demande n’a pas pu être enregistrée. Réessayez dans un instant.'},{status:503});
  return Response.json({ok:true,reference:data.request_id});
 }catch{return Response.json({error:'Le service est temporairement indisponible. Votre demande n’a pas été confirmée.'},{status:503});}
}
