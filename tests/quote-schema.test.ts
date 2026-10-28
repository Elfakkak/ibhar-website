import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteSchema, briefText } from '../src/lib/quote-schema.ts';
const valid={request_id:'c3e6ebc3-e42e-41d3-890d-af82d9a45f63',collection:'papeterie-de-marque',product:'Cartes et enveloppes',quantity:'200',budget:'5000-15000',timeline:'Flexible',notes:'Papier texturé',name:'Contact test',company:'Marque de test',email:'qa@example.com',phone:'+212 600 000 000',consent:true,website:''};
test('accepts a complete brief and normalizes quantity',()=>{const parsed=quoteSchema.parse(valid);assert.equal(parsed.quantity,200);assert.match(briefText(parsed),/Aucune demande n’est envoyée/);});
test('rejects invalid or unbounded quantities',()=>{for(const quantity of ['',0,-5,1.5,1000001,'Infinity'])assert.equal(quoteSchema.safeParse({...valid,quantity}).success,false);});
test('rejects missing consent, invalid email and bot honeypot',()=>{for(const bad of [{consent:false},{email:'invalid'},{website:'spam'},{notes:'x'.repeat(3001)}])assert.equal(quoteSchema.safeParse({...valid,...bad}).success,false);});
test('accepts an omitted phone value',()=>assert.equal(quoteSchema.safeParse({...valid,phone:''}).success,true));
