/* Small shared primitives, styled to the Google Cloud tokens in styles/tokens.css. */
import { useState } from 'react'

/* ── Icon ───────────────────────────────────────────────────────────────── */

export function Icon({ name, className = '', size = 18, fill = 0, weight = 400 }) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}

/* ── Card ───────────────────────────────────────────────────────────────── */

export function Card({ children, className = '', pad = true }) {
  return (
    <section className={`gc-card ${pad ? 'p-5' : ''} ${className}`}>{children}</section>
  )
}

export function CardHead({ icon, title, subtitle, right, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-blue-tint text-blue">
            <Icon name={icon} size={18} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-display text-[15px] font-medium leading-tight text-ink-1">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[13px] leading-snug text-ink-3">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}

/* ── Page heading ───────────────────────────────────────────────────────── */

export function PageHeading({ eyebrow, title, description, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div className="max-w-2xl">
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="font-display text-[28px] font-medium leading-tight text-ink-1">{title}</h1>
        {description && <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{description}</p>}
      </div>
      {right && <div className="shrink-0 pb-1">{right}</div>}
    </div>
  )
}

/* ── Pills & badges ─────────────────────────────────────────────────────── */

// Border colors are literal Material tints — Tailwind 3 can't apply an
// opacity modifier to a `var()`-backed color, so no `/25` shorthand here.
const TONES = {
  neutral: 'bg-surface-alt text-ink-2 border-line',
  blue: 'bg-blue-tint text-blue border-[#d2e3fc]',
  green: 'bg-green-tint text-green border-[#ceead6]',
  yellow: 'bg-yellow-tint text-[#b06000] border-[#feefc3]',
  red: 'bg-red-tint text-red border-[#fad2cf]',
  purple: 'bg-purple-tint text-purple border-[#e9d2fd]',
}

export function Pill({ children, tone = 'neutral', icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-[3px] font-display text-[11px] font-medium leading-[18px] ${TONES[tone]} ${className}`}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** Confidence dot + percentage. Green ≥ 90, yellow ≥ 80, red below. */
export function ConfidenceBadge({ value, showLabel = true }) {
  const pct = Math.round(value * 100)
  const tone = pct >= 90 ? 'green' : pct >= 80 ? 'yellow' : 'red'
  const dot = { green: 'bg-green', yellow: 'bg-yellow', red: 'bg-red' }[tone]
  const text = { green: 'text-green', yellow: 'text-[#b06000]', red: 'text-red' }[tone]
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${text}`}
      title={`Model confidence: ${pct}%`}
    >
      <span className={`h-[7px] w-[7px] rounded-full ${dot}`} />
      <span className="mono text-[11px] font-medium tnum">{pct}%</span>
      {showLabel && <span className="sr-only">confidence</span>}
    </span>
  )
}

export function MomentumBadge({ momentum }) {
  const map = {
    rising: { tone: 'green', icon: 'trending_up', label: 'Rising' },
    stable: { tone: 'blue', icon: 'trending_flat', label: 'Stable' },
    declining: { tone: 'red', icon: 'trending_down', label: 'Declining' },
  }
  const m = map[momentum] || map.stable
  return (
    <Pill tone={m.tone} icon={m.icon}>
      {m.label}
    </Pill>
  )
}

export function ImpactBadge({ impact }) {
  const map = {
    high: { tone: 'red', label: 'High impact' },
    medium: { tone: 'yellow', label: 'Medium impact' },
    low: { tone: 'neutral', label: 'Low impact' },
  }
  const m = map[impact] || map.low
  return <Pill tone={m.tone}>{m.label}</Pill>
}

/* ── Bars ───────────────────────────────────────────────────────────────── */

export function ScoreBar({ value, max = 100, tone = 'blue', height = 6 }) {
  const fill = {
    blue: 'bg-blue',
    green: 'bg-green',
    yellow: 'bg-yellow',
    red: 'bg-red',
    purple: 'bg-purple',
  }[tone]
  return (
    <div
      className="w-full overflow-hidden rounded-pill bg-surface-alt"
      style={{ height }}
      role="presentation"
    >
      <div
        className={`h-full rounded-pill ${fill} transition-[width] duration-700 ease-out`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  )
}

/** Two-value bar used for before/after attribute coverage. */
export function DeltaBar({ before, after }) {
  return (
    <div className="relative h-[18px] w-full overflow-hidden rounded-xs bg-surface-alt">
      <div
        className="absolute inset-y-0 left-0 rounded-xs bg-blue-soft"
        style={{ width: `${after}%` }}
      />
      <div
        className="absolute inset-y-0 left-0 rounded-xs bg-blue"
        style={{ width: `${before}%` }}
      />
    </div>
  )
}

/* ── Collapsible ────────────────────────────────────────────────────────── */

export function CollapsibleSection({
  icon,
  title,
  subtitle,
  count,
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="gc-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-alt"
      >
        {icon && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-blue-tint text-blue">
            <Icon name={icon} size={18} />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-medium text-ink-1">
            {title}
            {count != null && (
              <span className="ml-2 mono text-[12px] font-normal text-ink-3 tnum">{count}</span>
            )}
          </span>
          {subtitle && <span className="block text-[13px] text-ink-3">{subtitle}</span>}
        </span>
        <Icon
          name="expand_more"
          size={20}
          className={`shrink-0 text-ink-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-line px-5 py-4">{children}</div>}
    </div>
  )
}

/* ── Field row (label / value / confidence) ─────────────────────────────── */

export function FieldRow({ label, value, confidence, editable = true, mono = false }) {
  return (
    <div className="grid grid-cols-[minmax(120px,180px)_1fr_auto] items-start gap-3 border-b border-line-soft py-2.5 last:border-b-0">
      <div className="pt-[3px] font-display text-[12px] font-medium uppercase tracking-[0.04em] text-ink-3">
        {label}
      </div>
      <div
        className={`text-[14px] leading-relaxed text-ink-1 ${mono ? 'mono text-[13px]' : ''} ${
          editable
            ? 'cursor-text rounded-xs px-1.5 py-[1px] -mx-1.5 transition-colors hover:bg-blue-tint'
            : ''
        }`}
        contentEditable={editable}
        suppressContentEditableWarning
      >
        {value}
      </div>
      <div className="pt-[5px]">{confidence != null && <ConfidenceBadge value={confidence} />}</div>
    </div>
  )
}

/* ── Misc ───────────────────────────────────────────────────────────────── */

export function Divider({ className = '' }) {
  return <hr className={`border-0 border-t border-line ${className}`} />
}

export function EmptyHint({ icon = 'info', children }) {
  return (
    <div className="flex items-start gap-2 rounded-sm bg-surface-alt px-3 py-2.5 text-[13px] leading-snug text-ink-2">
      <Icon name={icon} size={16} className="mt-[1px] shrink-0 text-ink-3" />
      <span>{children}</span>
    </div>
  )
}

/** Gemini "spark" mark, used on anything model-generated. */
export function GeminiSpark({ size = 16, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gemini-spark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4285f4" />
          <stop offset="45%" stopColor="#9b72cb" />
          <stop offset="100%" stopColor="#d96570" />
        </linearGradient>
      </defs>
      <path
        fill="url(#gemini-spark)"
        d="M12 0c.36 4.02 1.94 6.9 4.2 8.44C18.02 9.68 20.42 10.3 24 12c-4.02.36-6.9 1.94-8.44 4.2C14.32 18.02 13.7 20.42 12 24c-.36-4.02-1.94-6.9-4.2-8.44C5.98 14.32 3.58 13.7 0 12c4.02-.36 6.9-1.94 8.44-4.2C9.68 5.98 10.3 3.58 12 0z"
      />
    </svg>
  )
}

/** Small "generated by Gemini" caption. */
export function AiTag({ children = 'Generated by Gemini' }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-display text-[11px] font-medium text-ink-3">
      <GeminiSpark size={13} />
      {children}
    </span>
  )
}
