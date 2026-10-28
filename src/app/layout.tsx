import type { Metadata } from 'next';
import { Header, Footer } from '@/components/site';
import './globals.css';
const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3018';
export const metadata: Metadata = {
 metadataBase: new URL(origin),
 title: { default: 'IBHAR — Packaging & papeterie premium au Maroc', template: '%s | IBHAR' },
 description: 'Coffrets, sacs de boutique, cadeaux d’entreprise et papeterie de marque au Maroc. Explorez les collections IBHAR et préparez votre projet personnalisé.',
 robots: {index: process.env.SITE_INDEXABLE === 'true', follow: process.env.SITE_INDEXABLE === 'true'},
 openGraph: {type:'website',locale:'fr_MA',siteName:'IBHAR',images:[{url:'/images/hero.jpg',width:1536,height:1024,alt:'Inspiration packaging IBHAR : coffret ivoire et sac indigo'}]},
};
export default function Layout({children}: {children: React.ReactNode}) {return <html lang="fr"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet" /></head><body><a href="#contenu" className="skip-link">Aller au contenu</a><Header /><main id="contenu">{children}</main><Footer /></body></html>;}
