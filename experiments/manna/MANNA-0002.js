'use strict'
// MANNA-0002 — forces + awareness + discipline + planning.
// Question: can navigation reduce the capital required for durable sufficiency?

const N=100, MONTHS=120, SEEDS=1000, POOL0=100000
function rng(seed){let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)}
function normal(r){let u=Math.max(r(),1e-12),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function pop(seed){const r=rng(seed);return Array.from({length:N},(_,id)=>{const need=1800+1800*r(), q=.35+1.15*r();return {id,need,income:need*q,reserve:need*(.05+.55*r()),debt:need*(.2+1.8*r()),awareness:.15+.7*r(),discipline:.15+.7*r(),planning:.15+.7*r(),last:q,suff:0,relapse:0,aid:0}})}
function q(h){return (h.income+h.reserve/6)/h.need}
function shock(h,r){h.income*=Math.max(.55,1+.018*normal(r));h.need*=Math.max(.8,1+.006*normal(r));if(r()<.025)h.reserve=Math.max(0,h.reserve-h.need*(.15+.6*r()))}
function settle(h){const gap=h.need-h.income;if(gap>0)h.reserve=Math.max(0,h.reserve-gap);else h.reserve+=(-gap)*.35;const z=q(h);if(z>=1)h.suff++;if(h.last>=1&&z<1)h.relapse++;h.last=z}
function needAllocate(hs,amount){const w=hs.map(h=>Math.max(0,1-q(h))),s=w.reduce((a,b)=>a+b,0)||1;hs.forEach((h,i)=>{const x=amount*w[i]/s;h.reserve+=x;h.aid+=x})}
function navigation(h,r){
  // Awareness improves observation; planning converts observation to a forward choice;
  // discipline determines how much of that choice survives monthly pressure.
  const observed=q(h)+(1-h.awareness)*.15*normal(r)
  const gap=Math.max(0,1-observed)
  const plan=h.planning*h.awareness
  const follow=plan*h.discipline
  // Navigation can lower avoidable need and raise earned income, but effects are bounded.
  h.need*=1-Math.min(.006, .0035*follow*(.25+gap))
  h.income*=1+Math.min(.007, .0030*follow*(.25+gap))
  // Learning is slow and saturating; shocks can erode execution, not knowledge.
  h.awareness=Math.min(1,h.awareness+.0015*(1-h.awareness))
  h.planning=Math.min(1,h.planning+.0012*h.awareness*(1-h.planning))
  h.discipline=Math.max(.05,Math.min(1,h.discipline+.0008*plan*(1-h.discipline)-.002*Math.max(0,gap-.5)))
}
function step(kind,hs,state,r){hs.forEach(h=>shock(h,r));if(kind==='manna-nav')hs.forEach(h=>navigation(h,r));
  if(kind==='cash'||kind==='manna-nav'){const budget=Math.min(state.pool,POOL0/MONTHS);needAllocate(hs,budget);state.pool-=budget}
  if(kind==='manna-nav'){
    // Surplus only. Never finance investment by crossing back below the null.
    let productive=0
    for(const h of hs){const z=q(h);if(z>1){const surplus=Math.max(0,h.reserve-h.need);const commit=surplus*Math.min(.15,(z-1)*.08)*h.awareness*h.planning*h.discipline;h.reserve-=commit;productive+=commit}}
    const gross=productive*(.05/12+.025/Math.sqrt(12)*normal(r));state.pool+=productive+gross*.35
    if(gross>0)needAllocate(hs,gross*.25);if(gross<0)state.pool=Math.max(0,state.pool+gross)
  }
  hs.forEach(settle)
}
function metrics(hs,state){const z=hs.map(q),net=hs.map(h=>h.reserve-h.debt).sort((a,b)=>a-b);return {sufficient:z.filter(x=>x>=1).length,durable:hs.filter(h=>h.suff>=90).length,relapses:hs.reduce((a,h)=>a+h.relapse,0),medianNet:net[50],meanRatio:z.reduce((a,b)=>a+b,0)/N,pool:state.pool,aid:hs.reduce((a,h)=>a+h.aid,0),awareness:hs.reduce((a,h)=>a+h.awareness,0)/N,discipline:hs.reduce((a,h)=>a+h.discipline,0)/N,planning:hs.reduce((a,h)=>a+h.planning,0)/N}}
function run(seed,kind){const hs=pop(seed),state={pool:kind==='control'?0:POOL0},r=rng(seed^0x9e3779b9);for(let t=0;t<MONTHS;t++)step(kind,hs,state,r);return metrics(hs,state)}
const kinds=['control','cash','manna-nav'], keys=['sufficient','durable','relapses','medianNet','meanRatio','pool','aid','awareness','discipline','planning'];const sums=Object.fromEntries(kinds.map(k=>[k,Object.fromEntries(keys.map(x=>[x,0]))]));
for(let seed=1;seed<=SEEDS;seed++)for(const k of kinds){const m=run(seed,k);for(const x of keys)sums[k][x]+=m[x]}
console.log(`MANNA-0002 | ${N} households | ${MONTHS/12} years | ${SEEDS} matched seeds`);for(const k of kinds)console.log(k,Object.fromEntries(keys.map(x=>[x,+(sums[k][x]/SEEDS).toFixed(x.includes('Ratio')||['awareness','discipline','planning'].includes(x)?4:2)])))
