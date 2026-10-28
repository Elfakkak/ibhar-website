import type { MetadataRoute } from 'next';
import {collections,products} from '@/lib/catalogue';
export default function sitemap():MetadataRoute.Sitemap{const url=process.env.NEXT_PUBLIC_SITE_URL;if(!url||process.env.SITE_INDEXABLE!=='true')return [];return [{url,priority:1},...collections.map(c=>({url:`${url}/collections/${c.slug}`,priority:.8})),...products.map(p=>({url:`${url}/produits/${p.slug}`,priority:.7}))];}
