import { z } from 'zod';
export const quoteSchema = z.object({
 request_id: z.uuid(),
 collection: z.enum(['boutiques-createurs','beaute-parfumerie','cadeaux-entreprise','papeterie-de-marque','plusieurs-univers']),
 product: z.string().trim().max(150),
 quantity: z.coerce.number().int().min(1).max(1_000_000),
 budget: z.enum(['a-definir','moins-5000','5000-15000','15000-50000','plus-50000']),
 timeline: z.string().trim().max(100),
 notes: z.string().trim().max(3000),
 name: z.string().trim().min(2).max(120),
 company: z.string().trim().min(2).max(160),
 email: z.email().max(254),
 phone: z.string().trim().max(30).refine(v=>!v||/^[+\d\s().-]{6,30}$/.test(v), 'Numéro invalide'),
 consent: z.literal(true),
 website: z.literal(''),
 turnstile_token: z.string().max(4096).optional(),
});
export type Quote = z.infer<typeof quoteSchema>;
export function briefText(q: Quote) {return [
 'IBHAR — Brief de projet',
 'Document à transmettre à IBHAR. Aucune demande n’est envoyée par ce téléchargement.',
 '',`Entreprise : ${q.company}`,`Contact : ${q.name}`,`E-mail : ${q.email}`,`Téléphone : ${q.phone || 'Non renseigné'}`,
 '',`Univers : ${q.collection}`,`Produit : ${q.product || 'À définir'}`,`Quantité souhaitée : ${q.quantity}`,`Budget : ${q.budget}`,`Échéance : ${q.timeline || 'À définir'}`,
 '', 'Votre projet :', q.notes || 'À préciser', '', 'Les prix, quantités minimales, disponibilités et délais restent à confirmer sur devis.',
 ].join('\n');}
