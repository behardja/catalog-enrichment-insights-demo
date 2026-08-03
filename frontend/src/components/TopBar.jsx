import { Icon } from './ui.jsx'
import { ORG } from '../data/mock.js'

const TABS = [
  { key: 'portal', label: 'Product Listing Portal', icon: 'inventory_2' },
  { key: 'insights', label: 'Insights & Analytics', icon: 'monitoring' },
]

export default function TopBar({ page, onNavigate, onReset }) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-surface"
      style={{ height: 'var(--topbar-h)' }}
    >
      <div className="page flex h-full items-center gap-6">
        {/* Brand */}
        <button
          type="button"
          onClick={onReset}
          className="flex shrink-0 items-center gap-3 rounded-sm py-1 pr-2 text-left transition-colors hover:bg-surface-alt"
          title="Reset the demo"
        >
          <img
            src="/google-cloud-logo.png"
            alt="Google Cloud"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-medium text-ink-1">
              Catalog Enrichment
            </span>
            <span className="block text-[11.5px] text-ink-3">
              Vertex AI &middot; {ORG.name}
            </span>
          </span>
        </button>

        {/* Segmented nav */}
        <nav className="flex items-center gap-1 rounded-pill border border-line bg-surface-alt p-1">
          {TABS.map((t) => {
            const active = page === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onNavigate(t.key)}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 font-display text-[13px] font-medium transition-colors ${
                  active
                    ? 'bg-surface text-blue shadow-1'
                    : 'text-ink-2 hover:text-ink-1'
                }`}
              >
                <Icon name={t.icon} size={17} fill={active ? 1 : 0} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onReset}
          className="btn btn-text hidden md:inline-flex"
          title="Start the demo over"
        >
          <Icon name="restart_alt" size={18} />
          Reset demo
        </button>

        <a
          href="https://cloud.google.com/vertex-ai/generative-ai/docs/overview"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1.5 font-display text-[13px] font-medium text-ink-2 transition-colors hover:text-blue lg:inline-flex"
        >
          Docs
          <Icon name="open_in_new" size={15} />
        </a>
      </div>
    </header>
  )
}
