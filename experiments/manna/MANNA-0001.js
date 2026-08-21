'use strict'

// MANNA-0001 — Can provision create durable sufficiency?
// Closed simulation. No token, blockchain, or external dependencies.

const YEARS = 10
const MONTHS = YEARS * 12
const HOUSEHOLDS = 100
const SEEDS = 1000
const INITIAL_POOL = 100000

function rng(seed) {
  let x = seed >>> 0
  return () => {
    x = (1664525 * x + 1013904223) >>> 0
    return x / 4294967296
  }
}

function normal(r) {
  const u = Math.max(r(), 1e-12), v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function population(seed) {
  const r = rng(seed)
  return Array.from({ length: HOUSEHOLDS }, (_, id) => {
    const need = 1800 + 1800 * r()
    const ratio = 0.35 + 1.15 * r()
    return {
      id, need,
      income: need * ratio,
      reserve: need * (0.05 + 0.55 * r()),
      debt: need * (0.2 + 1.8 * r()),
      lastRatio: ratio,
      sufficientMonths: 0,
      relapse: 0,
      everSufficient: ratio >= 1,
    }
  })
}

function clone(xs) { return xs.map(x => ({ ...x })) }
function ratio(h) { return (h.income + h.reserve / 6) / h.need }

function shock(h, r) {
  // shared economic reality: noisy income, expenses and occasional adverse shocks
  h.income *= Math.max(0.55, 1 + 0.018 * normal(r))
  h.need *= Math.max(0.8, 1 + 0.006 * normal(r))
  if (r() < 0.025) h.reserve = Math.max(0, h.reserve - h.need * (0.15 + 0.6 * r()))
}

function settle(h) {
  const gap = h.need - h.income
  if (gap > 0) h.reserve = Math.max(0, h.reserve - gap)
  else h.reserve += (-gap) * 0.35
  const q = ratio(h)
  if (q >= 1) h.sufficientMonths++
  if (q >= 1 && !h.everSufficient) h.everSufficient = true
  if (h.lastRatio >= 1 && q < 1) h.relapse++
  h.lastRatio = q
}

function allocateNeed(hs, amount) {
  const gaps = hs.map(h => Math.max(0, h.need - h.income))
  const total = gaps.reduce((a,b)=>a+b,0) || 1
  hs.forEach((h,i) => h.reserve += amount * gaps[i] / total)
}

function stepSystem(kind, hs, state, r) {
  hs.forEach(h => shock(h, r))

  if (kind === 'cash') {
    const spend = Math.min(state.pool, INITIAL_POOL / MONTHS)
    allocateNeed(hs, spend); state.pool -= spend
  }

  if (kind === 'microloan') {
    const candidates = hs.filter(h => ratio(h) < 1).sort((a,b)=>ratio(a)-ratio(b))
    const budget = Math.min(state.pool, INITIAL_POOL / MONTHS)
    const each = candidates.length ? budget / candidates.length : 0
    for (const h of candidates) {
      h.reserve += each; h.debt += each; state.pool -= each
      const payment = Math.min(h.reserve * 0.02, h.debt * 0.01)
      h.reserve -= payment; h.debt -= payment; state.pool += payment
    }
  }

  if (kind === 'equal') {
    const monthlyReturn = state.pool * (0.045 / 12 + 0.025 / Math.sqrt(12) * normal(r))
    state.pool = Math.max(0, state.pool + monthlyReturn)
    const payout = Math.max(0, monthlyReturn) * 0.5
    const each = payout / hs.length
    hs.forEach(h => h.reserve += each)
    state.pool = Math.max(0, state.pool - payout)
  }

  if (kind === 'manna') {
    // Three-way field decision around sufficiency null q=1.
    // refuse: q < .50, provision only; null/hold: .50 <= q <= 1;
    // commit: q > 1, surplus may compound and return yield to commons.
    const qs = hs.map(ratio)
    const needWeights = qs.map(q => q < 1 ? (1 - q) : 0)
    const wsum = needWeights.reduce((a,b)=>a+b,0) || 1
    const provision = Math.min(state.pool * 0.006, INITIAL_POOL / MONTHS)
    hs.forEach((h,i) => h.reserve += provision * needWeights[i] / wsum)
    state.pool -= provision

    let productive = 0
    for (let i=0;i<hs.length;i++) {
      const h = hs[i], q = qs[i]
      if (q > 1) {
        const surplus = Math.max(0, h.reserve - h.need)
        const commit = surplus * Math.min(0.20, (q - 1) * 0.10)
        h.reserve -= commit
        productive += commit
      }
    }
    const gross = productive * Math.max(-0.5, 0.055 / 12 + 0.03 / Math.sqrt(12) * normal(r))
    const returned = productive + gross
    // principal returns to household field; positive yield: 50% reserve field,
    // 30% reinvested commons, 20% direct sufficiency provision.
    state.pool += productive + Math.max(0, gross) * 0.30
    if (gross > 0) allocateNeed(hs, gross * 0.20)
    if (gross < 0) state.pool = Math.max(0, state.pool + gross)
  }

  hs.forEach(settle)
}

function metrics(hs, state) {
  const q = hs.map(ratio)
  const durable = hs.filter(h => h.sufficientMonths >= MONTHS * 0.75).length
  const sufficient = q.filter(x => x >= 1).length
  const wealth = hs.map(h => h.reserve - h.debt).sort((a,b)=>a-b)
  return {
    sufficient,
    durable,
    relapses: hs.reduce((s,h)=>s+h.relapse,0),
    medianNet: wealth[Math.floor(wealth.length/2)],
    meanRatio: q.reduce((a,b)=>a+b,0)/q.length,
    pool: state.pool,
  }
}

function run(seed, kind) {
  const hs = population(seed)
  const state = { pool: kind === 'control' ? 0 : INITIAL_POOL }
  const r = rng(seed ^ 0x9e3779b9)
  for (let t=0;t<MONTHS;t++) stepSystem(kind, hs, state, r)
  return metrics(hs, state)
}

const kinds = ['control','cash','microloan','equal','manna']
const sums = Object.fromEntries(kinds.map(k=>[k,{n:0,sufficient:0,durable:0,relapses:0,medianNet:0,meanRatio:0,pool:0}]))
for (let seed=1; seed<=SEEDS; seed++) {
  for (const k of kinds) {
    const m = run(seed,k), s=sums[k]; s.n++
    for (const x of ['sufficient','durable','relapses','medianNet','meanRatio','pool']) s[x]+=m[x]
  }
}
console.log(`MANNA-0001 | ${HOUSEHOLDS} households | ${YEARS} years | ${SEEDS} matched seeds`)
for (const k of kinds) {
  const s=sums[k], n=s.n
  console.log(k.padEnd(10), {
    sufficient: +(s.sufficient/n).toFixed(2),
    durable: +(s.durable/n).toFixed(2),
    relapses: +(s.relapses/n).toFixed(2),
    medianNet: +(s.medianNet/n).toFixed(2),
    meanRatio: +(s.meanRatio/n).toFixed(4),
    pool: +(s.pool/n).toFixed(2),
  })
}
