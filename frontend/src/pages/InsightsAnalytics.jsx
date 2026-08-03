import { useEffect, useRef, useState } from 'react'
import {
  Card,
  CardHead,
  CollapsibleSection,
  Divider,
  EmptyHint,
  GeminiSpark,
  Icon,
  ImpactBadge,
  MomentumBadge,
  PageHeading,
  Pill,
  ScoreBar,
} from '../components/ui.jsx'
import {
  ASSISTANT_REPLIES,
  CATALOG_KPIS,
  COMPETITIVE_NEWS,
  CONFIDENCE_MIX,
  COVERAGE_BY_CATEGORY,
  FASHION_TRENDS,
  OVERLAP_CLUSTERS,
  SEASONAL_TRENDS,
  SOCIAL_TRENDS,
  TIME_RANGES,
  TOP_ITEMS,
  VIDEO_TRENDS,
} from '../data/mock.js'

/* ══════════════════════════════ Page ══════════════════════════════════ */

export default function InsightsAnalytics({ onNavigate }) {
  const [range, setRange] = useState('30d')
  const current = TIME_RANGES.find((r) => r.key === range)

  return (
    <div className="page py-8">
      <PageHeading
        eyebrow="Stage 3 · Enterprise portal"
        title="Insights & Analytics"
        description="The same enriched attributes that make a listing complete also make the catalog measurable. Ask questions in plain language, or read the health of the catalog and the market signals moving around it."
        right={
          <label className="flex items-center gap-2">
            <span className="text-[13px] text-ink-3">Period</span>
            <select
              className="gc-input w-auto cursor-pointer pr-8 font-display text-[13px]"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              {TIME_RANGES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        }
      />

      <p className="-mt-3 mb-6 mono text-[12px] text-ink-3">{current.range}</p>

      <Assistant />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATALOG_KPIS.map((k) => (
          <KpiCard key={k.key} kpi={k} />
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <CoverageChart />
        <ConfidenceMix onNavigate={onNavigate} />
      </div>

      <div className="mt-6 space-y-4">
        <TopItems />
        <OverlapClusters />

        <CollapsibleSection
          icon="styler"
          title="Category & style trends"
          subtitle="Directional signals across the assortment"
          count={`${FASHION_TRENDS.length} trends`}
        >
          <TrendList items={FASHION_TRENDS} />
        </CollapsibleSection>

        <CollapsibleSection
          icon="calendar_month"
          title="Seasonal trends"
          subtitle="What the next assortment window should lean into"
          count={`${SEASONAL_TRENDS.length} trends`}
        >
          <TrendList items={SEASONAL_TRENDS} />
        </CollapsibleSection>

        <CollapsibleSection
          icon="tag"
          title="Social signals"
          subtitle="Conversation volume and velocity across social platforms"
          count={`${SOCIAL_TRENDS.length} signals`}
        >
          <div className="space-y-3">
            {SOCIAL_TRENDS.map((s) => (
              <div
                key={s.trend}
                className="flex flex-wrap items-start justify-between gap-3 rounded-sm border border-line px-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[14px] font-medium text-ink-1">
                      {s.trend}
                    </span>
                    <Pill tone="neutral">{s.platform}</Pill>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-2">{s.description}</p>
                </div>
                <div className="text-right">
                  <div className="mono text-[15px] font-medium text-ink-1 tnum">{s.mentions}</div>
                  <div className="mono text-[12px] text-green tnum">{s.velocity}</div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          icon="smart_display"
          title="Video & creator signals"
          subtitle="Long-form and creator content driving category discovery"
          count={`${VIDEO_TRENDS.length} signals`}
        >
          <div className="space-y-3">
            {VIDEO_TRENDS.map((v) => (
              <div
                key={v.trend}
                className="flex flex-wrap items-start justify-between gap-3 rounded-sm border border-line px-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[14px] font-medium text-ink-1">
                      {v.trend}
                    </span>
                    <Pill tone="neutral">{v.type}</Pill>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-2">{v.description}</p>
                </div>
                <div className="text-right">
                  <div className="mono text-[15px] font-medium text-ink-1 tnum">{v.views}</div>
                  <div className="mono text-[12px] text-green tnum">{v.velocity}</div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CompetitiveIntel />
      </div>
    </div>
  )
}

/* ── Assistant ───────────────────────────────────────────────────────── */

const QUICK_PROMPTS = [
  { label: 'Where is coverage weakest?', key: 'coverage' },
  { label: 'Any duplicate listings?', key: 'overlap' },
  { label: "What's trending right now?", key: 'trends' },
  { label: 'What are competitors doing?', key: 'competitive' },
]

function pickReply(text) {
  const q = text.toLowerCase()
  if (/(coverage|attribute|complete|missing|gap)/.test(q)) return ASSISTANT_REPLIES.coverage
  if (/(overlap|duplicate|dedup|cannibal|similar)/.test(q)) return ASSISTANT_REPLIES.overlap
  if (/(trend|social|season|style|demand)/.test(q)) return ASSISTANT_REPLIES.trends
  if (/(competitor|competitive|northwind|contoso|fabrikam|market share|pricing)/.test(q))
    return ASSISTANT_REPLIES.competitive
  return ASSISTANT_REPLIES.default
}

/** Renders the tiny subset of markdown used in the canned replies (**bold**). */
function RichText({ text }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-medium text-ink-1">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "I have the enriched catalog, engagement data and market signals in context. Ask me about coverage gaps, duplicate listings, category trends or what competitors are shipping.",
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const send = (text) => {
    const q = (text ?? input).trim()
    if (!q || thinking) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', text: pickReply(q) }])
      setThinking(false)
    }, 900)
  }

  return (
    <Card pad={false} className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <span
          className="grid h-9 w-9 place-items-center rounded-full"
          style={{ background: 'var(--gemini-gradient)' }}
        >
          <GeminiSpark size={18} className="brightness-0 invert" />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-[15px] font-medium text-ink-1">
            Catalog Insights Assistant
          </h3>
          <p className="text-[12.5px] text-ink-3">
            Grounded in the enriched catalog, engagement data and market signals
          </p>
        </div>
        <Pill tone="blue" icon="bolt">
          Gemini
        </Pill>
      </div>

      <div ref={scrollRef} className="max-h-[340px] space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}
          >
            {m.role === 'assistant' && (
              <span className="mt-1 shrink-0">
                <GeminiSpark size={16} />
              </span>
            )}
            <div
              className={`max-w-[78%] rounded-md px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue text-white'
                  : 'bg-surface-alt text-ink-2'
              }`}
            >
              {m.role === 'user' ? m.text : <RichText text={m.text} />}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-3">
            <GeminiSpark size={16} className="animate-pulse" />
            <div className="flex gap-1 rounded-md bg-surface-alt px-3.5 py-3">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-4"
                  style={{ animationDelay: `${d * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-line px-5 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => send(p.label)}
              className="rounded-pill border border-line px-3 py-1 text-[12.5px] text-ink-2 transition-colors hover:border-blue hover:bg-blue-tint hover:text-blue"
            >
              {p.label}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            className="gc-input"
            placeholder="Ask about coverage, overlap, trends or competitors…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={!input.trim() || thinking}>
            <Icon name="send" size={17} />
            Ask
          </button>
        </form>
      </div>
    </Card>
  )
}

/* ── KPIs ────────────────────────────────────────────────────────────── */

function KpiCard({ kpi }) {
  return (
    <div className="gc-card p-4">
      <div className="flex items-start justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-sm bg-blue-tint text-blue">
          <Icon name={kpi.icon} size={18} />
        </span>
        <span
          className={`mono text-[12px] font-medium tnum ${
            kpi.deltaTone === 'up' ? 'text-green' : 'text-blue'
          }`}
        >
          {kpi.delta}
        </span>
      </div>
      <div className="mono mt-3 text-[26px] font-medium leading-none text-ink-1 tnum">
        {kpi.value}
      </div>
      <div className="mt-1.5 font-display text-[13px] font-medium text-ink-1">{kpi.label}</div>
      <p className="mt-1 text-[12px] leading-snug text-ink-3">{kpi.caption}</p>
    </div>
  )
}

/* ── Coverage chart ──────────────────────────────────────────────────── */

function CoverageChart() {
  return (
    <Card>
      <CardHead
        icon="bar_chart"
        title="Attribute coverage by category"
        subtitle="Before enrichment vs. today"
        right={
          <div className="flex items-center gap-3 text-[11.5px] text-ink-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-blue" /> Before
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-blue-soft" /> Today
            </span>
          </div>
        }
      />
      <div className="mt-5 space-y-3.5">
        {COVERAGE_BY_CATEGORY.map((c) => (
          <div key={c.category}>
            <div className="mb-1 flex items-center justify-between text-[12.5px]">
              <span className="text-ink-1">{c.category}</span>
              <span className="mono text-ink-3 tnum">
                {c.before}% → <span className="font-medium text-ink-1">{c.after}%</span>
              </span>
            </div>
            <div className="relative h-[14px] w-full overflow-hidden rounded-xs bg-surface-alt">
              <div
                className="absolute inset-y-0 left-0 rounded-xs bg-blue-soft transition-[width] duration-700"
                style={{ width: `${c.after}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-xs bg-blue transition-[width] duration-700"
                style={{ width: `${c.before}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <EmptyHint icon="trending_up">
        Categories with sparse supplier data — Grocery and Toys & Kids — gain the most from
        image-derived attributes, and are where the next enrichment pass pays back fastest.
      </EmptyHint>
    </Card>
  )
}

function ConfidenceMix({ onNavigate }) {
  return (
    <Card>
      <CardHead
        icon="donut_small"
        title="Confidence distribution"
        subtitle="Last enrichment run · 42,180 items"
      />
      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-pill">
        {CONFIDENCE_MIX.map((c) => (
          <div
            key={c.band}
            className={`h-full ${
              { green: 'bg-green', yellow: 'bg-yellow', red: 'bg-red' }[c.tone]
            }`}
            style={{ width: `${c.pct}%` }}
            title={`${c.band}: ${c.pct}%`}
          />
        ))}
      </div>
      <div className="mt-4 space-y-2.5">
        {CONFIDENCE_MIX.map((c) => (
          <div key={c.band} className="flex items-center gap-2.5 text-[13px]">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                { green: 'bg-green', yellow: 'bg-yellow', red: 'bg-red' }[c.tone]
              }`}
            />
            <span className="flex-1 text-ink-2">{c.band}</span>
            <span className="mono font-medium text-ink-1 tnum">{c.pct}%</span>
          </div>
        ))}
      </div>
      <Divider className="my-4" />
      <p className="text-[13px] leading-relaxed text-ink-2">
        The threshold is a dial, not a fixed rule. Raising it sends more items to review and lifts
        precision; lowering it increases throughput. Today it clears{' '}
        <span className="font-medium text-ink-1">76%</span> of items without a human touch.
      </p>
      <button className="btn btn-outline mt-4 w-full" onClick={() => onNavigate('portal')}>
        <Icon name="fact_check" size={17} />
        Open the review queue
      </button>
    </Card>
  )
}

/* ── Top items ───────────────────────────────────────────────────────── */

function TopItems() {
  const [open, setOpen] = useState(null)
  return (
    <Card>
      <CardHead
        icon="leaderboard"
        title="Most engaged items"
        subtitle="Ranked by engagement score across views, saves and click-through"
        right={<Pill tone="neutral">Top {TOP_ITEMS.length}</Pill>}
      />
      <div className="mt-4 space-y-2">
        {TOP_ITEMS.map((item) => {
          const expanded = open === item.rank
          return (
            <div key={item.rank} className="rounded-sm border border-line">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : item.rank)}
                className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-alt"
              >
                <span className="mono grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-alt text-[12px] font-medium text-ink-2 tnum">
                  {item.rank}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[14px] font-medium text-ink-1">
                    {item.name}
                  </span>
                  <span className="block text-[12.5px] text-ink-3">
                    {item.brand} · {item.category}
                  </span>
                </span>
                <span className="hidden w-[150px] shrink-0 sm:block">
                  <span className="mb-1 flex items-center justify-between text-[11px] text-ink-3">
                    <span>Engagement</span>
                    <span className="mono tnum">{item.engagement_score}</span>
                  </span>
                  <ScoreBar value={item.engagement_score} height={5} />
                </span>
                <span className="hidden w-[130px] shrink-0 text-right md:block">
                  <span className="mono block text-[13px] text-ink-1 tnum">
                    {item.views.toLocaleString()} views
                  </span>
                  <span className="mono block text-[12px] text-ink-3 tnum">
                    {item.saves.toLocaleString()} saves
                  </span>
                </span>
                <span className="mono w-[52px] shrink-0 text-right text-[13px] font-medium text-green tnum">
                  {item.trend}
                </span>
                <Icon
                  name="expand_more"
                  size={20}
                  className={`shrink-0 text-ink-3 transition-transform ${
                    expanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expanded && (
                <div className="border-t border-line bg-surface-alt px-4 py-3">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Pill tone={item.coverage >= 90 ? 'green' : 'yellow'} icon="checklist">
                      {item.coverage}% attribute coverage
                    </Pill>
                    {item.coverage < 90 && (
                      <span className="text-[12.5px] text-ink-3">
                        Below the 90% target — enriching this record should lift search
                        recall further.
                      </span>
                    )}
                  </div>
                  <div className="eyebrow mb-2">Visually similar in catalog</div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {item.similar.map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center justify-between gap-2 rounded-sm border border-line bg-surface px-3 py-2"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] text-ink-1">{s.name}</span>
                          <span className="block text-[11.5px] text-ink-3">{s.brand}</span>
                        </span>
                        <span className="mono shrink-0 text-[12px] text-ink-2 tnum">
                          {s.match}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ── Overlap ─────────────────────────────────────────────────────────── */

function OverlapClusters() {
  const tone = { high: 'red', medium: 'yellow', low: 'neutral' }
  return (
    <Card>
      <CardHead
        icon="content_copy"
        title="Assortment overlap"
        subtitle="Near-duplicate clusters found by similarity search over the catalog embeddings"
        right={<Pill tone="neutral" icon="database">Vector Search</Pill>}
      />
      <div className="mt-4 space-y-2">
        {OVERLAP_CLUSTERS.map((c) => (
          <div
            key={c.cluster}
            className="flex flex-wrap items-start gap-3 rounded-sm border border-line px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-[14px] font-medium text-ink-1">
                  {c.cluster}
                </span>
                <Pill tone={tone[c.severity]}>{c.similarity}% similar</Pill>
                <Pill tone="neutral">
                  {c.items} items · {c.teams} teams
                </Pill>
              </div>
              <p className="mt-1 text-[13px] leading-snug text-ink-2">{c.note}</p>
            </div>
            <button className="btn btn-text shrink-0">Resolve</button>
          </div>
        ))}
      </div>
      <EmptyHint icon="savings">
        Overlap detection runs on the same multimodal embeddings the listing portal uses — no
        separate matching pipeline to maintain.
      </EmptyHint>
    </Card>
  )
}

/* ── Trends & competitive ────────────────────────────────────────────── */

function TrendList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((t) => (
        <div key={t.trend} className="rounded-sm border border-line px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-display text-[14px] font-medium text-ink-1">{t.trend}</span>
              <MomentumBadge momentum={t.momentum} />
            </div>
            <span className="mono text-[13px] font-medium text-ink-1 tnum">{t.score}</span>
          </div>
          <p className="mt-1 text-[13px] text-ink-2">{t.description}</p>
          <div className="mt-2">
            <ScoreBar
              value={t.score}
              height={5}
              tone={t.momentum === 'declining' ? 'red' : t.momentum === 'stable' ? 'blue' : 'green'}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function CompetitiveIntel() {
  return (
    <CollapsibleSection
      icon="newspaper"
      title="Competitive intelligence"
      subtitle="Grounded summaries of competitor moves relevant to this assortment"
      count={`${COMPETITIVE_NEWS.length} updates`}
    >
      <div className="space-y-3">
        {COMPETITIVE_NEWS.map((n) => (
          <article key={n.headline} className="rounded-sm border border-line px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="blue">{n.retailer}</Pill>
              <Pill tone="neutral">{n.category}</Pill>
              <ImpactBadge impact={n.impact} />
              <span className="mono ml-auto text-[11.5px] text-ink-3">{n.date}</span>
            </div>
            <h4 className="mt-2 font-display text-[14.5px] font-medium leading-snug text-ink-1">
              {n.headline}
            </h4>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{n.summary}</p>
          </article>
        ))}
        <EmptyHint icon="link">
          In production these summaries are produced with grounded generation over licensed news and
          web sources, with citations attached to each claim.
        </EmptyHint>
      </div>
    </CollapsibleSection>
  )
}
