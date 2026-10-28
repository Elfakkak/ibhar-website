import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{const url=process.env.NEXT_PUBLIC_SITE_URL;return process.env.SITE_INDEXABLE==='true'&&url?{rules:{userAgent:'*',allow:'/',disallow:['/api/','/devis','/confidentialite']},sitemap:`${url}/sitemap.xml`}:{rules:{userAgent:'*',disallow:'/'}};}
