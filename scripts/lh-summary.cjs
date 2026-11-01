// Summarise a Lighthouse JSON report: score, core metrics, LCP element/phases, heaviest scripts and long tasks.
const r = require(require('path').resolve(process.argv[2]));
const a = r.audits;
const lcp = a['largest-contentful-paint-element']?.details?.items ?? [];
console.log(
  JSON.stringify({
    run: process.argv[3],
    score: Math.round((r.categories.performance.score ?? 0) * 100),
    FCP: a['first-contentful-paint'].displayValue,
    LCP: a['largest-contentful-paint'].displayValue,
    TBT: a['total-blocking-time'].displayValue,
    CLS: a['cumulative-layout-shift'].displayValue,
    SI: a['speed-index'].displayValue,
    lcpEl: lcp[0]?.items?.[0]?.node?.snippet?.slice(0, 90),
    lcpPhases: lcp[1]?.items?.map((p) => `${p.phase} ${Math.round(p.timing)}ms`),
    bootup: a['bootup-time']?.details?.items?.slice(0, 4).map((i) => `${i.url.split('/').pop()} ${Math.round(i.scripting)}ms`),
    longTasks: a['long-tasks']?.details?.items?.slice(0, 6).map((i) => `${i.url.split('/').pop()}@${Math.round(i.startTime)} ${Math.round(i.duration)}ms`),
    longTasks: a['long-tasks']?.details?.items?.slice(0, 6).map((i) => `${i.url.split('/').pop()}@${Math.round(i.startTime)} ${Math.round(i.duration)}ms`),
    mainWork: a['mainthread-work-breakdown']?.details?.items?.map((i) => `${i.group}:${Math.round(i.duration)}ms`),
    lcpAudit: a['largest-contentful-paint']?.numericValue,
    fcpAudit: a['first-contentful-paint']?.numericValue,
    metricsItem: a.metrics?.details?.items?.[0],
    err: r.runtimeError?.message,
  }),
);
