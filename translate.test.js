// Does the encoder TRANSLATE — put related bytes near each other — or merely label them?
const fs=require('fs'), τ=require('./τ.js'), M=require('./Ω.js');
const src=τ.decode(fs.readFileSync('Δ/V·001','latin1'));
const {DIM,FILL}=M;
function hashLens(seed){ const EN=new Float32Array(256*DIM);
  for(let b=0;b<256;b++){ let h=((b+1)*2654435761 ^ seed)>>>0;
    for(let j=0;j<FILL;j++){ h=(Math.imul(h,1664525)+1013904223)>>>0;
      EN[b*DIM+j]=(h>>>8)/8388608-1; } }
  return EN; }
// nearness in the address space = depth of shared prefix, summed over the three faces
function near(ω,x,y){ const A=ω.addr.get(x),B=ω.addr.get(y); if(!A||!B) return null;
  let n=0; for(let f=0;f<3;f++){ const a=A[f]||[],b=B[f]||[],m=Math.min(a.length,b.length);
    for(let i=0;i<m;i++){ if(a[i]===b[i]) n++; else break; } }
  return n; }
function report(label, lens){
  const ω=new M.Organism().feed(src, lens);
  const live=[...ω.live];
  const cls=b=>{ const c=String.fromCharCode(b);
    if(/[aeiouAEIOU]/.test(c)) return 'vowel';
    if(/[a-zA-Z]/.test(c)) return 'consonant';
    if(/[0-9]/.test(c)) return 'digit';
    if(/\s/.test(c)) return 'space';
    return 'punct'; };
  let within=[],between=[];
  for(let i=0;i<live.length;i++) for(let j=i+1;j<live.length;j++){
    const n=near(ω,live[i],live[j]); if(n===null) continue;
    (cls(live[i])===cls(live[j]) ? within : between).push(n); }
  const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
  // case pairs: is 'A' near 'a'?
  const cp=[]; for(let c=65;c<=90;c++){ const n=near(ω,c,c+32); if(n!==null) cp.push(n); }
  // and a control: 'A' to a random other letter
  const ctl=[]; for(let c=65;c<=90;c++){ const o=97+((c*7)%26); const n=near(ω,c,o); if(n!==null) ctl.push(n); }
  console.log('  %s  same-class %s  cross-class %s  lift %+.3f   |   Aa %s  A? %s  lift %+.3f',
    label.padEnd(22), mean(within).toFixed(3), mean(between).toFixed(3),
    mean(within)-mean(between), mean(cp).toFixed(3), mean(ctl).toFixed(3), mean(cp)-mean(ctl));
}
console.log('  encoder                 do related bytes land near each other?');
report('derived (from corpus)', null);
report('hash lens, seed 1', hashLens(1));
report('hash lens, seed 2', hashLens(2));
