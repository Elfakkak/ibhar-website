// File-based visual review of the production-rendered pages, with no server.
// This does not replace or simulate the Next.js quote form.
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const review=path.join(root,'review');
fs.mkdirSync(path.join(review,'assets'),{recursive:true});
for(const name of ['hero','collections'])fs.copyFileSync(`public/images/${name}.jpg`,path.join(review,`assets/${name}.jpg`));
fs.copyFileSync('public/fonts/figtree-latin.woff2',path.join(review,'assets/figtree.woff2'));
let css=fs.readdirSync('.next/static/css').filter(f=>f.endsWith('.css')).map(f=>fs.readFileSync(`.next/static/css/${f}`,'utf8')).join('\n');
css=css.replaceAll('/fonts/figtree-latin.woff2','./figtree.woff2').replaceAll('/images/collections.jpg','./collections.jpg');
fs.writeFileSync(path.join(review,'assets/site.css'),css);
const base='.next/server/app';
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);}
const files=walk(base).filter(f=>!f.includes('_not-found')&&!f.includes('_global-error'));
const banner='<aside style="padding:8px 20px;background:#291e6e;color:#fff;font:11px Arial;text-align:center">Aperçu visuel IBHAR · Le formulaire interactif est disponible dans le projet Next.js.</aside>';
for(const file of files){
 const relative=path.relative(base,file);const destination=path.join(review,relative);fs.mkdirSync(path.dirname(destination),{recursive:true});
 const prefix=path.relative(path.dirname(destination),review).replaceAll(path.sep,'/')||'.';
 let html=fs.readFileSync(file,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 html=html.replace(/<link\b[^>]*href="\/_next\/[^>]*>/g,'').replace(/<link\b[^>]*as="image"[^>]*>/g,'');
 html=html.replace(/srcSet="[^"]*"/gi,'').replace(/src="\/_next\/image[^"]*"/g,`src="${prefix}/assets/hero.jpg"`);
 html=html.replace(/href="\/(.*?)"/g,(_,url)=>{
  if(url.startsWith('icon.svg'))return 'href="data:,"';
  const [route,hash]=url.split('#');const clean=route.split('?')[0];
  return `href="${prefix}/${clean?`${clean}.html`:'index.html'}${hash?`#${hash}`:''}"`;
 });
 html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}/assets/site.css"/></head>`).replace('<body>','<body>'+banner);
 fs.writeFileSync(destination,html);
}
const shell=fs.readFileSync(path.join(review,'index.html'),'utf8');
const notice='<main id="contenu" class="project-cta wrap"><span class="eyebrow">Aperçu visuel</span><h1>Votre projet,<br/><em>prochaine étape.</em></h1><p>Le site Next.js contient le formulaire en trois étapes et le téléchargement du brief.<br/>Cet aperçu sans serveur permet de parcourir le design et les collections.</p><a class="button" href="index.html">Retour aux collections →</a></main>';
fs.writeFileSync(path.join(review,'devis.html'),shell.replace(/<main id="contenu">[\s\S]*?<\/main>/,notice));
console.log(`Visual review generated: ${files.length} pages and a clearly labelled form placeholder.`);
