// openclose.js — the inverse-scale ternary hierarchy (the ASCENT). scale.js is the
// descent and stays untouched. CLOSE: three objects at scale n -> one addressable
// object at scale n+1, reversibly; OPEN inverts it exactly.
//
//   CLOSE(a,b,c) = (S=a+b+c, d1=a-b, d2=b-c)          S is the higher object
//   OPEN(S,d1,d2): b=(S-d1+d2)/3, a=b+d1, c=b-d2       (a,d1,d2) the lower walk
//
// FINDING (see OPENCLOSE.md): OPEN(CLOSE)=id exactly (~5e-16); it nests to any depth;
// it is reversible but NOT compressive (tree grouping); and it MECHANICALLY supports
// "same higher object, different lower walks" — but that does NOT emerge from meaning.
// The hierarchy inherits input similarity flatly across scale (null). The missing,
// mathematically necessary operator is a NON-INJECTIVE quotient onto meaning-classes,
// which cannot coexist with exact OPEN on the same axis.

export function closeLevel(v){ const n=(v.length/3)|0, S=new Float64Array(n), det=new Float64Array(2*n);
  for(let i=0;i<n;i++){ const a=v[3*i],b=v[3*i+1],c=v[3*i+2]; S[i]=a+b+c; det[2*i]=a-b; det[2*i+1]=b-c; }
  return { S, det }; }
export function openLevel(S,det){ const n=S.length, v=new Float64Array(3*n);
  for(let i=0;i<n;i++){ const b=(S[i]-det[2*i]+det[2*i+1])/3, a=b+det[2*i], c=b-det[2*i+1]; v[3*i]=a; v[3*i+1]=b; v[3*i+2]=c; }
  return v; }
export function CLOSE(v){ const levels=[]; let cur=v; while(cur.length>1){ const {S,det}=closeLevel(cur); levels.push(det); cur=S; } return { top: cur, levels }; }
export function OPEN(T){ let cur=T.top; for(let k=T.levels.length-1;k>=0;k--) cur=openLevel(cur,T.levels[k]); return cur; }

// --- convenience: CLOSE/OPEN an arbitrary-length vector (pad to a power of three) ---
function nextPow3(n){ let p=1; while(p<n) p*=3; return p; }
export function closeVec(vec){
  const pad=nextPow3(vec.length), v=new Float64Array(pad); v.set(vec);
  return { n: vec.length, T: CLOSE(v) };
}
export function openVec(enc){ return OPEN(enc.T).subarray(0, enc.n); }
// the single addressable object at the top of the ascent (the field's handle)
export function top(enc){ return enc.T.top[0]; }
