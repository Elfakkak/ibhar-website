import postgres from 'postgres';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const url = process.env.WEBSITE_DATABASE_URL || readFileSync(process.argv[2], 'utf8').trim();
const sql = postgres(url, { ssl: { rejectUnauthorized: true, ca: JSON.parse(readFileSync(new URL('../src/lib/supabase-ca.json', import.meta.url), 'utf8')).certificate }, max: 1, prepare: false, connect_timeout: 10 });
try {
  const [role] = await sql`select current_user as role`;
  if (role.role !== 'ibhar_website_writer') throw new Error('Unexpected database role');
  const [access] = await sql`select count(*)::int as accessible from pg_class c
    join pg_namespace n on n.oid=c.relnamespace where n.nspname='public'
    and c.relkind in ('r','v','m','p') and
    (has_table_privilege(current_user,c.oid,'SELECT') or has_table_privilege(current_user,c.oid,'INSERT')
    or has_table_privilege(current_user,c.oid,'UPDATE') or has_table_privilege(current_user,c.oid,'DELETE')
    or has_table_privilege(current_user,c.oid,'TRUNCATE'))`;
  if (access.accessible !== 0) throw new Error('Manager object access found');
  try {
    await sql.begin(async tx => {
      await tx`insert into ibhar_website.quote_requests
        (request_id,consent_at,collection,quantity,budget,name,company,email)
        values (${randomUUID()},now(),'plusieurs-univers',1,'a-definir',
        'Isolation test','Rollback test','test@example.invalid')`;
      throw new Error('ROLLBACK_TEST');
    });
  } catch(e) { if (e.message !== 'ROLLBACK_TEST') throw e; }
  for (const query of ['select * from ibhar_website.quote_requests limit 0',
    'delete from ibhar_website.quote_requests where false', 'select * from public.company limit 0']) {
    try { await sql.unsafe(query); throw new Error('Forbidden operation was allowed'); }
    catch(e) { if (e.code !== '42501') throw e; }
  }
  console.log('PASS: TLS connection, restricted role, insert with rollback, denied reads/deletes, no manager table privileges.');
} catch(e) {
  console.error('Database verification failed:', e.code || e.message);
  process.exitCode = 1;
} finally { await sql.end({timeout: 5}); }
