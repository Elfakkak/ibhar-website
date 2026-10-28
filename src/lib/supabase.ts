import 'server-only';
import postgres from 'postgres';
import supabaseCA from './supabase-ca.json';
import type { Quote } from './quote-schema';

let database: ReturnType<typeof postgres> | undefined;
export function submissionsEnabled() {
  return process.env.QUOTE_SUBMISSIONS_ENABLED === 'true' && Boolean(
    process.env.WEBSITE_DATABASE_URL && process.env.TURNSTILE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
}
export function getDatabase() {
  if (database) return database;
  const connection = process.env.WEBSITE_DATABASE_URL;
  if (!connection) throw new Error('Quote database not configured');
  const url = new URL(connection);
  if (decodeURIComponent(url.username) !== 'ibhar_website_writer.quuaxpnaugcmburokhko') {
    throw new Error('Website requires its restricted database role');
  }
  database = postgres(connection, {
    ssl: { rejectUnauthorized: true, ca: supabaseCA.certificate }, max: 1, prepare: false,
    idle_timeout: 10, connect_timeout: 10, max_lifetime: 60,
  });
  return database;
}
type QuoteRecord = Omit<Quote, 'website' | 'turnstile_token' | 'consent'>;
export async function saveQuote(data: QuoteRecord) {
  const sql = getDatabase();
  try {
    await sql`insert into ibhar_website.quote_requests
      (request_id, consent_at, collection, product, quantity, budget,
       timeline, notes, name, company, email, phone)
      values (${data.request_id}, ${new Date().toISOString()}, ${data.collection},
       ${data.product}, ${data.quantity}, ${data.budget}, ${data.timeline},
       ${data.notes}, ${data.name}, ${data.company}, ${data.email}, ${data.phone})`;
  } catch (error) {
    if (!(error instanceof postgres.PostgresError) || error.code !== '23505') throw error;
  }
}
