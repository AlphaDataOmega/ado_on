// Needle in a haystack, with the case standard NIAH does not test: a needle that is
// not there. PG-19 style corpus, ten pre-1919 Gutenberg books, one held out.
const fs=require('fs'), M=require('./Ω.js');
const {DIM,FILL}=M;
const clean=t=>{let s=t.replace(/\r/g,'');
  const a=s.search(/\*\*\*\s*START OF/i); if(a>=0) s=s.slice(s.indexOf('\n',a)+1);
  const b=s.search(/\*\*\*\s*END OF/i); if(b>=0) s=s.slice(0,b);
  return s.replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n');};
// PG-19 sample. Fetch it first:
//   mkdir -p /tmp/pg19 && cd /tmp/pg19
//   for id in 1342 84 2701 1661 98 345 174 1080 2542 4300; do
//     curl -s -o pg$id.txt "https://www.gutenberg.org/cache/epub/$id/pg$id.txt"; done
// Ten pre-1919 Gutenberg books, ~7MB. Not vendored -- they are not this project's to
// redistribute alongside a licence, and the point is that any corpus works.
const D=process.env.PG19 || '/tmp/pg19';
const files=fs.readdirSync(D).filter(f=>f.endsWith('.txt')).sort();
const HOLD=files[files.length-1];
const corpus=files.filter(f=>f!==HOLD).map(f=>clean(fs.readFileSync(D+'/'+f,'latin1'))).join('\n\n');
const unseen=clean(fs.readFileSync(D+'/'+HOLD,'latin1'));
function hashLens(seed){ const EN=new Float32Array(256*DIM);
  for(let b=0;b<256;b++){ let h=((b+1)*2654435761 ^ seed)>>>0;
    for(let j=0;j<FILL;j++){ h=(Math.imul(h,1664525)+1013904223)>>>0;
      EN[b*DIM+j]=(h>>>8)/8388608-1; } }
  return EN; }
function bench(label, lens){
  const t0=Date.now();
  const ω=new M.Organism().feed(corpus, lens);
  ω.measureOrderPole(180);
  const fed=((Date.now()-t0)/1000).toFixed(1);
  let s=11; const rnd=()=>((s=(s*1103515245+12345)&0x7fffffff)/0x7fffffff);
  const pass=(buf,q,L)=>{let o='';for(let k=q-L;k<q;k++)o+=String.fromCharCode(buf[k]);return o;};
  const up=[]; for(let i=1;i<unseen.length;i++) if(/\s/.test(unseen[i-1])) up.push(i);
  // NIAH by depth: needles drawn from ten equal slices of the haystack
  const depth=[];
  for(let d=0;d<10;d++){
    const lo=Math.floor(ω.pos.length*d/10), hi=Math.floor(ω.pos.length*(d+1)/10);
    let ok=0,n=0;
    for(let t=0;t<40;t++){ const q=ω.pos[lo+Math.floor(rnd()*(hi-lo))]; if(q<340) continue;
      const h=ω.hear(pass(ω.buf,q,300)); if(h.verdict==='nowhere to land') continue;
      n++; if(h.speaks) ok++; }
    depth.push(n?ok/n:0); }
  let ab=0,an=0;      // needle that is NOT there — real prose, never fed
  for(let t=0;t<300;t++){ const q=up[Math.floor(rnd()*up.length)]; if(q<340) continue;
    an++; if(!ω.hear(unseen.slice(q-300,q)).speaks) ab++; }
  let jb=0,jn=0;
  for(let t=0;t<150;t++){ let j=''; for(let i=0;i<300;i++) j+=String.fromCharCode(33+Math.floor(rnd()*90));
    jn++; if(!ω.hear(j+' ').speaks) jb++; }
  const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
  console.log('  %s', label);
  console.log('    fed %s MB in %ss · %s states · window %d',
    (corpus.length/1e6).toFixed(2), fed, ω.pos.length.toLocaleString(), ω.window);
  console.log('    needle recall by depth  %s', depth.map(x=>x.toFixed(2)).join(' '));
  console.log('    mean %s · absent needle refused %s · junk refused %s\n',
    mean(depth).toFixed(3), (ab/an).toFixed(3), (jb/jn).toFixed(3));
  return {r:mean(depth), a:ab/an, j:jb/jn};
}
console.log('PG-19 · %d books fed, %s held out (%s MB unseen)\n',
  files.length-1, HOLD, (unseen.length/1e6).toFixed(2));
const A=bench('derived encoder (from corpus)', null);
const B=bench('hash lens (model-free)', hashLens(1));
console.log('  derived − hash:  recall %+.3f   absent-needle %+.3f   junk %+.3f',
  A.r-B.r, A.a-B.a, A.j-B.j);
