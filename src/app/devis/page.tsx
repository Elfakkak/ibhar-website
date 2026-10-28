import type { Metadata } from 'next';
import { Photo } from '@/components/site';
import { QuoteForm } from '@/components/quote-form';
import { submissionsEnabled } from '@/lib/supabase';
export const metadata:Metadata={title:'Votre projet de packaging et papeterie',description:'Préparez votre brief : supports, quantités, finitions et échéance pour votre projet IBHAR.',robots:{index:false,follow:false}};
export default async function QuotePage({searchParams}:{searchParams:Promise<{produit?:string}>}){const {produit}=await searchParams;return <div className="wrap quote-layout"><div className="quote-aside"><span className="eyebrow">Créons quelque chose ensemble <i/></span><h1>Votre marque.<br /><em>Votre projet.</em></h1><p>Quelques détails pour imaginer un ensemble qui vous ressemble. Coffrets, sacs, cadeaux ou papeterie : tout commence ici.</p><Photo kind="stationery" label="Inspiration papeterie de marque IBHAR"/></div><QuoteForm initialProduct={produit} enabled={submissionsEnabled()} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY||''}/></div>;}
