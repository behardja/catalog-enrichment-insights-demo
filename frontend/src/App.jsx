import { useState } from 'react'
import TopBar from './components/TopBar.jsx'
import ProductListingPortal from './pages/ProductListingPortal.jsx'
import InsightsAnalytics from './pages/InsightsAnalytics.jsx'

export default function App() {
  // The Product Listing Portal is the centre of gravity for the demo, so it
  // is what loads first. `resetKey` remounts the active page to start over.
  const [page, setPage] = useState('portal')
  const [resetKey, setResetKey] = useState(0)

  const reset = () => setResetKey((k) => k + 1)

  return (
    <div className="min-h-screen bg-surface">
      <TopBar page={page} onNavigate={setPage} onReset={reset} />
      <main>
        {page === 'portal' ? (
          <ProductListingPortal key={`portal-${resetKey}`} onNavigate={setPage} />
        ) : (
          <InsightsAnalytics key={`insights-${resetKey}`} onNavigate={setPage} />
        )}
      </main>
      <footer className="mt-16 border-t border-line py-6">
        <div className="page flex flex-wrap items-center justify-between gap-3 text-[12px] text-ink-3">
          <span>
            Demo application &middot; illustrative data only, not a production catalog system.
          </span>
          <span>Built on Vertex AI &middot; Gemini &middot; Vector Search &middot; Imagen</span>
        </div>
      </footer>
    </div>
  )
}
