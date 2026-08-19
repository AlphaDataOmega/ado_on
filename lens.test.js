// Is the derived encoder doing the work, or is the geometry?
const fs=require('fs'), τ=require('./τ.js'), M=require('./Ω.js');
const src=τ.decode(fs.readFileSync('Δ/V·001','latin1'));
const {DIM,FILL}=M;

function hashLens(seed){ const EN=new Float32Array(256*DIM);
  for(let b=0;b<256;b++){ let h=((b+1)*2654435761 ^ seed)>>>0;
    for(let j=0;j<FILL;j++){ h=(Math.imul(h,1664525)+1013904223)>>>0;
      EN[b*DIM+j]=(h>>>8)/8388608-1; } }
  return EN; }

function measure(label, lens){
  const ω=new M.Organism().feed(src, lens); ω.measureOrderPole(210);
  let s=5; const rnd=()=>((s=(s*1103515245+12345)&0x7fffffff)/0x7fffffff);
  const word=at=>{let e=at;while(e<ω.buf.length&&![32,10,13].includes(ω.buf[e]))e++;
    let o='';for(let k=at;k<e;k++)o+=String.fromCharCode(ω.buf[k]);return o;};
  const pass=(q,L)=>{let o='';for(let k=q-L;k<q;k++)o+=String.fromCharCode(ω.buf[k]);return o;};
  let R=[0,0],J=[0,0],B=[0,0],F=[0,0];
  for(const L of [120,200,260,380,500,800]){ s=5;
    for(let t=0;t<200;t++){const q=ω.pos[Math.floor(rnd()*ω.pos.length)];if(q<L+40)continue;
      const h=ω.hear(pass(q,L));if(h.verdict==='nowhere to land')continue;R[1]++;if(h.speaks)R[0]++;}
    for(let t=0;t<100;t++){let j='';for(let i=0;i<L;i++)j+=String.fromCharCode(33+Math.floor(rnd()*90));
      J[1]++;if(!ω.hear(j+' ').speaks)J[0]++;}
    for(let t=0;t<100;t++){const q=ω.pos[Math.floor(rnd()*ω.pos.length)];if(q<L+40)continue;
      const a=[];for(let k=q-L;k<q;k++)a.push(ω.buf[k]);
      for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
      let str='';for(const c of a)str+=String.fromCharCode(c);
      B[1]++;if(!ω.hear(str).speaks)B[0]++;}
    for(let t=0;t<100;t++){const w=[];
      for(let i=0;i<Math.max(8,Math.round(L/6));i++)w.push(word(ω.pos[Math.floor(rnd()*ω.pos.length)]));
      F[1]++;if(!ω.hear(w.join(' ')+' ').inOrder)F[0]++;}
  }
  const d=[...ω.live].map(b=>{const A=ω.addr.get(b);return A&&A[0]?A[0].length:0;});
  console.log('  %s  %s   %s   %s   %s    depth %s  window %d',
    label.padEnd(22),(R[0]/R[1]).toFixed(3),(J[0]/J[1]).toFixed(3),
    (B[0]/B[1]).toFixed(3),(F[0]/F[1]).toFixed(3),
    (d.reduce((a,b)=>a+b,0)/d.length).toFixed(2), ω.window);
  return {r:R[0]/R[1], j:J[0]/J[1], b:B[0]/B[1], f:F[0]/F[1]};
}
console.log('  encoder                RECALL  JUNK    BYTES   ORDER');
const A=measure('derived (from corpus)', null);
const B=measure('hash lens, seed 1', hashLens(1));
const C=measure('hash lens, seed 2', hashLens(2));
console.log('');
console.log('  derived - hash(1):  recall %+.3f  junk %+.3f  bytes %+.3f  order %+.3f',
  A.r-B.r, A.j-B.j, A.b-B.b, A.f-B.f);
