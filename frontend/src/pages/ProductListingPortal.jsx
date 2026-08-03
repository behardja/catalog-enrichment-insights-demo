import { useEffect, useRef, useState } from 'react'
import {
  AiTag,
  Card,
  CardHead,
  CollapsibleSection,
  ConfidenceBadge,
  DeltaBar,
  Divider,
  EmptyHint,
  FieldRow,
  GeminiSpark,
  Icon,
  PageHeading,
  Pill,
  ScoreBar,
} from '../components/ui.jsx'
import {
  BATCH_QUEUE,
  CATEGORY_CANDIDATES,
  CONFIDENCE,
  COVERAGE,
  GENERATED_QA,
  LOCALES,
  PIPELINE_STEPS,
  PRODUCT,
  RAW_INPUT,
  SIMILAR_ITEMS,
  TRENDING_IN_CATEGORY,
} from '../data/mock.js'

const IMG = (name) => `/api/product/sample-image/${name}`

/* ══════════════════════════════ Page ══════════════════════════════════ */

export default function ProductListingPortal({ onNavigate }) {
  const [phase, setPhase] = useState('upload') // upload | processing | review
  const [inputs, setInputs] = useState({ doc: false, image: false, video: false })
  const [batchMode, setBatchMode] = useState(false)

  const ready = inputs.doc || inputs.image || inputs.video

  return (
    <div className="page py-8">
      {phase === 'upload' && (
        <UploadPhase
          inputs={inputs}
          setInputs={setInputs}
          batchMode={batchMode}
          setBatchMode={setBatchMode}
          ready={ready}
          onStart={() => setPhase('processing')}
        />
      )}
      {phase === 'processing' && (
        <ProcessingPhase inputs={inputs} onDone={() => setPhase('review')} />
      )}
      {phase === 'review' && (
        <ReviewPhase
          batchMode={batchMode}
          onNavigate={onNavigate}
          onRestart={() => {
            setInputs({ doc: false, image: false, video: false })
            setBatchMode(false)
            setPhase('upload')
          }}
        />
      )}
    </div>
  )
}

/* ═════════════════════════════ 1. Upload ══════════════════════════════ */

function UploadPhase({ inputs, setInputs, batchMode, setBatchMode, ready, onStart }) {
  return (
    <div className="relative">
      {/* Catalog wall backdrop, washed out behind the panel */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-cover bg-center opacity-100"
        style={{ backgroundImage: 'url(/background_catalog.png)' }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-white/85" />

      <div className="px-2 py-10 sm:px-8">
        <PageHeading
          eyebrow="Stage 1 · Catalog enrichment"
          title="Product Listing Portal"
          description="Drop in whatever a supplier actually sends — a spec sheet, a few photos, a product video — and Gemini derives the structured attributes, taxonomy, copy and imagery a listing needs. Every generated field is scored and stays editable before anything is published."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <Dropzone
            icon="description"
            title="Spec sheet or line list"
            hint="PDF, DOCX, XLSX or CSV"
            active={inputs.doc}
            filename="basic_product_sample.pdf"
            onDrop={() => setInputs((s) => ({ ...s, doc: !s.doc }))}
          />
          <Dropzone
            icon="image"
            title="Product images"
            hint="JPG or PNG · up to 12 views"
            active={inputs.image}
            filename="product_original.png"
            preview={IMG('product_original.png')}
            onDrop={() => setInputs((s) => ({ ...s, image: !s.image }))}
          />
          <Dropzone
            icon="movie"
            title="Product video"
            hint="MP4 · attributes pulled from motion & narration"
            active={inputs.video}
            filename="dress_360.mp4"
            onDrop={() => setInputs((s) => ({ ...s, video: !s.video }))}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-md border border-line bg-surface px-5 py-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={batchMode}
              onChange={(e) => setBatchMode(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[color:var(--gc-blue)]"
            />
            <span>
              <span className="block font-display text-[14px] font-medium text-ink-1">
                Run as a batch
              </span>
              <span className="block text-[13px] text-ink-3">
                Enrich {BATCH_QUEUE.length} queued items at once. High-confidence records publish
                automatically; anything below threshold is routed here for review.
              </span>
            </span>
          </label>
          <button className="btn btn-primary" disabled={!ready} onClick={onStart}>
            <GeminiSpark size={16} />
            {batchMode ? 'Enrich batch' : 'Enrich product'}
          </button>
        </div>

        {!ready && (
          <p className="mt-3 text-[13px] text-ink-3">
            Select at least one input to start. Any single source works — the pipeline fills the
            gaps from whatever it is given.
          </p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: 'auto_awesome',
              title: 'Derived attributes',
              body: 'Pattern, neckline, fit, fabric and features read straight off the imagery — not just the fields the supplier filled in.',
            },
            {
              icon: 'account_tree',
              title: 'Taxonomy mapping',
              body: 'Ranked category candidates against both the public product taxonomy and your own site hierarchy.',
            },
            {
              icon: 'fact_check',
              title: 'Human in the loop',
              body: 'Per-field confidence decides what publishes automatically and what a merchandiser sees first.',
            },
          ].map((f) => (
            <div key={f.title} className="rounded-md border border-line bg-surface p-4">
              <span className="grid h-8 w-8 place-items-center rounded-sm bg-blue-tint text-blue">
                <Icon name={f.icon} size={18} />
              </span>
              <h3 className="mt-3 font-display text-[14px] font-medium text-ink-1">{f.title}</h3>
              <p className="mt-1 text-[13px] leading-snug text-ink-2">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Dropzone({ icon, title, hint, active, filename, preview, onDrop }) {
  return (
    <button
      type="button"
      onClick={onDrop}
      className={`group relative flex min-h-[168px] w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-5 py-6 text-center transition-colors ${
        active
          ? 'border-blue bg-blue-tint'
          : 'border-line-strong bg-surface hover:border-blue hover:bg-blue-tint'
      }`}
    >
      {active && preview ? (
        <img
          src={preview}
          alt=""
          className="h-16 w-16 rounded-sm border border-line object-cover"
        />
      ) : (
        <span
          className={`grid h-11 w-11 place-items-center rounded-full ${
            active ? 'bg-blue text-white' : 'bg-surface-alt text-ink-3 group-hover:text-blue'
          }`}
        >
          <Icon name={active ? 'check' : icon} size={22} />
        </span>
      )}
      <span className="font-display text-[14px] font-medium text-ink-1">{title}</span>
      <span className="text-[12.5px] text-ink-3">{active ? filename : hint}</span>
      {active && (
        <span className="absolute right-3 top-3">
          <Pill tone="blue">Attached</Pill>
        </span>
      )}
    </button>
  )
}

/* ═══════════════════════════ 2. Processing ════════════════════════════ */

function ProcessingPhase({ inputs, onDone }) {
  const [step, setStep] = useState(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= PIPELINE_STEPS.length) {
          clearInterval(t)
          setTimeout(() => doneRef.current(), 450)
          return s
        }
        return s + 1
      })
    }, 850)
    return () => clearInterval(t)
  }, [])

  const pct = Math.round((Math.min(step, PIPELINE_STEPS.length) / PIPELINE_STEPS.length) * 100)

  return (
    <div className="py-8">
      <PageHeading
        eyebrow="Processing"
        title="Enriching the record"
        description="Gemini reads every input together — document text, imagery and video — rather than one modality at a time."
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <Card>
          <CardHead
            icon="conveyor_belt"
            title="Enrichment pipeline"
            subtitle="Vertex AI · Gemini multimodal"
            right={<span className="mono text-[13px] font-medium text-blue tnum">{pct}%</span>}
          />
          <div className="mt-4">
            <ScoreBar value={pct} />
          </div>
          <ol className="mt-5 space-y-1">
            {PIPELINE_STEPS.map((label, i) => {
              const state = i < step ? 'done' : i === step ? 'active' : 'idle'
              return (
                <li
                  key={label}
                  className={`flex items-center gap-3 rounded-sm px-2 py-2 transition-colors ${
                    state === 'active' ? 'bg-blue-tint' : ''
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] ${
                      state === 'done'
                        ? 'bg-green text-white'
                        : state === 'active'
                          ? 'bg-blue text-white'
                          : 'bg-surface-alt text-ink-4'
                    }`}
                  >
                    {state === 'done' ? (
                      <Icon name="check" size={15} />
                    ) : state === 'active' ? (
                      <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                    ) : (
                      <span className="mono tnum">{i + 1}</span>
                    )}
                  </span>
                  <span
                    className={`text-[14px] ${
                      state === 'idle' ? 'text-ink-4' : 'text-ink-1'
                    } ${state === 'active' ? 'font-medium' : ''}`}
                  >
                    {label}
                  </span>
                </li>
              )
            })}
          </ol>
        </Card>

        <Card>
          <CardHead
            icon="input"
            title="Supplier input (raw)"
            subtitle="What actually arrived — 4 usable attributes"
          />
          <dl className="mt-4 divide-y divide-[color:var(--border-2)]">
            {RAW_INPUT.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2">
                <dt className="font-display text-[12px] font-medium uppercase tracking-[0.04em] text-ink-3">
                  {k}
                </dt>
                <dd className="mono text-[13px] text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {inputs.doc && <Pill tone="neutral" icon="description">basic_product_sample.pdf</Pill>}
            {inputs.image && <Pill tone="neutral" icon="image">product_original.png</Pill>}
            {inputs.video && <Pill tone="neutral" icon="movie">dress_360.mp4</Pill>}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ═════════════════════════════ 3. Review ══════════════════════════════ */

function ReviewPhase({ batchMode, onNavigate, onRestart }) {
  const [submitted, setSubmitted] = useState(false)
  const a = PRODUCT.attributes

  return (
    <div className="py-2">
      {batchMode && <BatchStrip />}

      <PageHeading
        eyebrow="Stage 2 · Human-in-the-loop review"
        title={PRODUCT.title}
        description="Every field below was generated from the supplier's inputs and is editable in place. Confidence scores marked"
        right={
          <div className="flex items-center gap-2">
            <Pill tone="green" icon="task_alt">
              {COVERAGE.after} attributes · {COVERAGE.multiple} coverage
            </Pill>
            <button className="btn btn-text" onClick={onRestart}>
              <Icon name="restart_alt" size={17} />
              New item
            </button>
          </div>
        }
      />

      {/* min-w-0 on both columns: grid items default to min-width:auto, so wide
          content (the payload JSON) would otherwise stretch the track and blow
          out the page instead of scrolling inside its own card. */}
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* ── Left: the record ── */}
        <div className="min-w-0 space-y-5">
          <IdentityCard />
          <CategoryCard />
          <AttributesCard a={a} />
          <DescriptionsCard />
          <TagsCard />
          <QnACard />
          <LocalizationCard />
        </div>

        {/* ── Right: media, coverage, payload ── */}
        <div className="min-w-0 space-y-5">
          <MediaCard />
          <CoverageCard />
          <PayloadCard />
        </div>
      </div>

      {/* ── Market context ── */}
      <div className="mt-8 space-y-5">
        <SimilarItemsCard onNavigate={onNavigate} />
        <TrendingCard />
      </div>

      {/* ── Actions ── */}
      <div className="sticky bottom-0 z-40 mt-8 border-t border-line bg-surface/95 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] text-ink-2">
            <Icon name="verified" size={18} className="text-green" />
            {submitted ? (
              <span className="font-medium text-green">
                Listing published to the catalog and indexed for search.
              </span>
            ) : (
              <span>
                12 of 15 fields cleared the auto-approve threshold · 3 flagged for review
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={onRestart}>
              Discard
            </button>
            <button className="btn btn-outline">
              <Icon name="bookmark" size={17} />
              Save draft
            </button>
            <button className="btn btn-primary" onClick={() => setSubmitted(true)}>
              <Icon name={submitted ? 'check' : 'publish'} size={17} />
              {submitted ? 'Published' : 'Publish listing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Batch strip ─────────────────────────────────────────────────────── */

function BatchStrip() {
  const auto = BATCH_QUEUE.filter((i) => i.status === 'auto').length
  const review = BATCH_QUEUE.length - auto
  return (
    <div className="mb-6 rounded-md border border-line bg-surface-alt p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="stacks" size={18} className="text-blue" />
          <span className="font-display text-[14px] font-medium text-ink-1">
            Batch run · {BATCH_QUEUE.length} items
          </span>
          <Pill tone="green">{auto} auto-published</Pill>
          <Pill tone="yellow">{review} need review</Pill>
        </div>
        <span className="text-[12.5px] text-ink-3">Reviewing item 1 of {review}</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {BATCH_QUEUE.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 rounded-sm border bg-surface px-3 py-2 ${
              i === 0 ? 'border-blue' : 'border-line'
            }`}
          >
            <Icon
              name={item.status === 'auto' ? 'check_circle' : 'pending'}
              size={17}
              className={item.status === 'auto' ? 'text-green' : 'text-yellow'}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] text-ink-1">{item.name}</span>
              <span className="mono block text-[11px] text-ink-3">
                {item.id} · +{item.newAttrs} attributes
              </span>
            </span>
            <ConfidenceBadge value={item.confidence} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Record cards ────────────────────────────────────────────────────── */

function IdentityCard() {
  return (
    <Card>
      <CardHead icon="label" title="Product identity" right={<AiTag />} />
      <div className="mt-3">
        <FieldRow label="Product ID" value={PRODUCT.product_id} editable={false} mono />
        <FieldRow label="Title" value={PRODUCT.title} confidence={CONFIDENCE.title} />
        <FieldRow label="Brand" value={PRODUCT.brand} confidence={CONFIDENCE.brand} />
      </div>
    </Card>
  )
}

function CategoryCard() {
  const [picked, setPicked] = useState(0)
  return (
    <Card>
      <CardHead
        icon="account_tree"
        title="Category detection"
        subtitle="Ranked candidates from the image and spec sheet — confirm or override"
        right={<AiTag />}
      />
      <div className="mt-4 space-y-2">
        {CATEGORY_CANDIDATES.map((c, i) => (
          <button
            key={c.path}
            type="button"
            onClick={() => setPicked(i)}
            className={`flex w-full items-start gap-3 rounded-sm border px-3 py-3 text-left transition-colors ${
              picked === i ? 'border-blue bg-blue-tint' : 'border-line hover:bg-surface-alt'
            }`}
          >
            <Icon
              name={picked === i ? 'radio_button_checked' : 'radio_button_unchecked'}
              size={18}
              className={picked === i ? 'mt-[2px] text-blue' : 'mt-[2px] text-ink-4'}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-medium text-ink-1">{c.path}</span>
              <span className="block text-[12.5px] text-ink-3">{c.rationale}</span>
            </span>
            <ConfidenceBadge value={c.score} />
          </button>
        ))}
      </div>
      <Divider className="my-4" />
      <FieldRow
        label="Site category"
        value={PRODUCT.taxonomy.site_category}
        confidence={CONFIDENCE.site_category}
      />
    </Card>
  )
}

const ATTR_LABELS = {
  primary_color: 'Primary color',
  pattern: 'Pattern',
  neckline: 'Neckline',
  sleeve_length: 'Sleeve length',
  sleeve_style: 'Sleeve style',
  length: 'Length',
  fit: 'Fit',
  fabric_type: 'Fabric type',
}

function AttributesCard({ a }) {
  return (
    <Card>
      <CardHead
        icon="auto_awesome"
        title="Attributes"
        subtitle="Derived from imagery where the supplier left the field blank"
        right={<AiTag />}
      />
      <div className="mt-3">
        {Object.entries(ATTR_LABELS).map(([key, label]) => (
          <FieldRow key={key} label={label} value={a[key]} confidence={CONFIDENCE[key]} />
        ))}
      </div>
      <div className="mt-4">
        <div className="eyebrow mb-2">Special features</div>
        <div className="flex flex-wrap gap-2">
          {a.special_features.map((f) => (
            <Pill key={f} tone="purple" icon="auto_awesome">
              {f}
            </Pill>
          ))}
        </div>
      </div>
    </Card>
  )
}

function DescriptionsCard() {
  return (
    <Card>
      <CardHead
        icon="edit_note"
        title="Descriptions"
        subtitle="Short copy for listings, long copy tuned for search"
        right={<AiTag />}
      />
      <div className="mt-4 space-y-4">
        <CopyBlock
          label="Short description"
          confidence={CONFIDENCE.short_description}
          text={PRODUCT.enrichment.descriptions.short}
        />
        <CopyBlock
          label="SEO-optimized description"
          confidence={CONFIDENCE.seo_optimized}
          text={PRODUCT.enrichment.descriptions.seo_optimized}
        />
      </div>
    </Card>
  )
}

function CopyBlock({ label, text, confidence }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        {confidence != null && <ConfidenceBadge value={confidence} />}
      </div>
      <p
        className="cursor-text rounded-sm border border-line bg-surface-alt px-3 py-2.5 text-[14px] leading-relaxed text-ink-1 transition-colors hover:border-blue"
        contentEditable
        suppressContentEditableWarning
      >
        {text}
      </p>
    </div>
  )
}

function TagsCard() {
  return (
    <Card>
      <CardHead
        icon="sell"
        title="Search tags & keywords"
        subtitle="Feeds on-site search, retrieval and merchandising rules"
        right={<ConfidenceBadge value={CONFIDENCE.tags} />}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {PRODUCT.enrichment.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 rounded-pill border border-[#d2e3fc] bg-blue-tint px-3 py-1 text-[12.5px] text-blue"
          >
            {t}
            <Icon name="close" size={13} className="cursor-pointer opacity-50 hover:opacity-100" />
          </span>
        ))}
        <button className="inline-flex items-center gap-1 rounded-pill border border-dashed border-line-strong px-3 py-1 text-[12.5px] text-ink-3 hover:border-blue hover:text-blue">
          <Icon name="add" size={14} />
          Add tag
        </button>
      </div>
    </Card>
  )
}

function QnACard() {
  return (
    <CollapsibleSection
      icon="quiz"
      title="Generated Q&A"
      subtitle="Pre-answers the questions shoppers ask on the product page"
      count={`${GENERATED_QA.length} pairs`}
    >
      <div className="space-y-3">
        {GENERATED_QA.map((qa) => (
          <div key={qa.q} className="rounded-sm border border-line bg-surface-alt px-3 py-2.5">
            <p className="font-display text-[13.5px] font-medium text-ink-1">{qa.q}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{qa.a}</p>
          </div>
        ))}
        <EmptyHint icon="lightbulb">
          Answers are grounded in the enriched attributes, so they stay consistent with the listing
          — and regenerate automatically when an attribute is corrected.
        </EmptyHint>
      </div>
    </CollapsibleSection>
  )
}

function LocalizationCard() {
  const [active, setActive] = useState(LOCALES[0].code)
  const current = LOCALES.find((l) => l.code === active)
  return (
    <CollapsibleSection
      icon="translate"
      title="Localization"
      subtitle="Translated copy with locale-aware units and currency"
      count={`${LOCALES.length} locales`}
    >
      <div className="flex flex-wrap gap-2">
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActive(l.code)}
            className={`rounded-pill border px-3 py-1 font-display text-[12.5px] font-medium transition-colors ${
              active === l.code
                ? 'border-blue bg-blue-tint text-blue'
                : 'border-line text-ink-2 hover:bg-surface-alt'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-sm border border-line bg-surface-alt px-3 py-2.5">
        <p className="text-[14px] text-ink-1">{current.title}</p>
        <p className="mt-1 text-[12px] text-ink-3">{current.note}</p>
      </div>
    </CollapsibleSection>
  )
}

/* ── Right column ────────────────────────────────────────────────────── */

function MediaCard() {
  const [gen, setGen] = useState('idle') // idle | loading | done

  useEffect(() => {
    if (gen !== 'loading') return
    const t = setTimeout(() => setGen('done'), 1800)
    return () => clearTimeout(t)
  }, [gen])

  return (
    <Card>
      <CardHead
        icon="photo_library"
        title="Imagery"
        subtitle="Supplier photo plus generated variants"
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <figure>
          <img
            src={IMG('product_original.png')}
            alt="Supplier product photo"
            className="aspect-[3/4] w-full rounded-sm border border-line object-cover"
          />
          <figcaption className="mt-1.5 text-[12px] text-ink-3">Supplier photo</figcaption>
        </figure>
        <figure>
          {gen === 'done' ? (
            <img
              src={IMG('generated_photo.png')}
              alt="Generated product variant"
              className="aspect-[3/4] w-full rounded-sm border border-line object-cover"
            />
          ) : (
            <div
              className={`grid aspect-[3/4] w-full place-items-center rounded-sm border border-dashed border-line-strong bg-surface-alt text-center ${
                gen === 'loading' ? 'animate-pulse' : ''
              }`}
            >
              <span className="px-3 text-[12px] text-ink-3">
                {gen === 'loading' ? 'Generating…' : 'Variant'}
              </span>
            </div>
          )}
          <figcaption className="mt-1.5 flex items-center gap-1.5 text-[12px] text-ink-3">
            {gen === 'done' && <GeminiSpark size={12} />}
            {gen === 'done' ? 'Imagen · on-model' : 'Not generated yet'}
          </figcaption>
        </figure>
      </div>
      <button
        className="btn btn-outline mt-4 w-full"
        onClick={() => setGen('loading')}
        disabled={gen !== 'idle'}
      >
        <GeminiSpark size={15} />
        {gen === 'done' ? 'Regenerate imagery' : 'Generate product imagery'}
      </button>
      <p className="mt-2 text-[12px] leading-snug text-ink-3">
        Recontextualizes a flat product shot into on-model and in-scene variants, so sparse supplier
        media doesn't cap conversion.
      </p>
    </Card>
  )
}

function CoverageCard() {
  return (
    <Card>
      <CardHead
        icon="checklist"
        title="Attribute coverage"
        subtitle="What the supplier sent vs. what the catalog now holds"
      />
      <div className="mt-4 flex items-end gap-6">
        <div>
          <div className="mono text-[28px] font-medium leading-none text-ink-3 tnum">
            {COVERAGE.before}
          </div>
          <div className="mt-1 text-[12px] text-ink-3">supplied</div>
        </div>
        <Icon name="arrow_forward" size={20} className="mb-2 text-ink-4" />
        <div>
          <div className="mono text-[28px] font-medium leading-none text-blue tnum">
            {COVERAGE.after}
          </div>
          <div className="mt-1 text-[12px] text-ink-3">after enrichment</div>
        </div>
        <div className="ml-auto pb-1">
          <Pill tone="green" icon="trending_up">
            {COVERAGE.multiple}
          </Pill>
        </div>
      </div>
      <div className="mt-4">
        <DeltaBar before={(COVERAGE.before / COVERAGE.after) * 100} after={100} />
      </div>
      <div className="mt-4 max-h-56 overflow-y-auto pr-1">
        <table className="w-full text-[12.5px]">
          <tbody>
            {COVERAGE.derived.map((d) => (
              <tr key={d.name} className="border-b border-line-soft last:border-b-0">
                <td className="py-1.5 pr-2 text-ink-1">{d.name}</td>
                <td className="py-1.5 pr-2 text-ink-2">{d.value}</td>
                <td className="py-1.5 text-right text-[11.5px] text-ink-3">{d.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function PayloadCard() {
  return (
    <Card pad={false}>
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 hover:bg-surface-alt">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-blue-tint text-blue">
            <Icon name="data_object" size={18} />
          </span>
          <span className="flex-1">
            <span className="block font-display text-[15px] font-medium text-ink-1">
              Enriched payload
            </span>
            <span className="block text-[13px] text-ink-3">
              What the catalog API receives on publish
            </span>
          </span>
          <Icon
            name="expand_more"
            size={20}
            className="text-ink-3 transition-transform group-open:rotate-180"
          />
        </summary>
        {/* Scrolls in both axes within its own box — overscroll-contain stops
            the wheel from chaining to the page once it bottoms out. */}
        <div className="max-h-80 overflow-auto overscroll-contain border-t border-line bg-[#f8f9fa]">
          <pre className="mono w-max px-4 py-3 text-[11.5px] leading-relaxed text-ink-1">
            {JSON.stringify(PRODUCT, null, 2)}
          </pre>
        </div>
      </details>
    </Card>
  )
}

/* ── Market context ──────────────────────────────────────────────────── */

function SimilarItemsCard({ onNavigate }) {
  return (
    <Card>
      <CardHead
        icon="join_inner"
        title="Visually similar items already in the catalog"
        subtitle="Nearest neighbours over the multimodal embedding — the same index that powers dedup and discovery"
        right={<Pill tone="neutral" icon="database">Vector Search</Pill>}
      />

      <div className="mt-4 overflow-hidden rounded-sm border border-line">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-alt">
            <tr className="text-left font-display text-[11px] uppercase tracking-[0.06em] text-ink-3">
              <th className="px-3 py-2 font-medium">Item</th>
              <th className="px-3 py-2 font-medium">Match</th>
              <th className="px-3 py-2 font-medium">Engagement</th>
              <th className="px-3 py-2 text-right font-medium">Views</th>
              <th className="px-3 py-2 text-right font-medium">Saves</th>
              <th className="px-3 py-2 text-right font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {SIMILAR_ITEMS.map((s) => (
              <tr key={s.name} className="border-t border-line-soft">
                <td className="px-3 py-2.5">
                  <span className="block text-ink-1">{s.name}</span>
                  <span className="block text-[12px] text-ink-3">{s.brand}</span>
                </td>
                <td className="px-3 py-2.5">
                  <Pill tone={s.match >= 90 ? 'red' : s.match >= 85 ? 'yellow' : 'neutral'}>
                    {s.match}%
                  </Pill>
                </td>
                <td className="w-[160px] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <ScoreBar value={s.engagement_score} height={5} />
                    <span className="mono text-[11.5px] text-ink-2 tnum">
                      {s.engagement_score}
                    </span>
                  </div>
                </td>
                <td className="mono px-3 py-2.5 text-right text-ink-2 tnum">
                  {s.views.toLocaleString()}
                </td>
                <td className="mono px-3 py-2.5 text-right text-ink-2 tnum">
                  {s.saves.toLocaleString()}
                </td>
                <td className="mono px-3 py-2.5 text-right text-green tnum">{s.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-sm border border-[#feefc3] bg-yellow-tint px-4 py-3">
        <Icon name="warning" size={18} className="mt-[1px] shrink-0 text-[#b06000]" />
        <div className="text-[13px] leading-relaxed text-ink-1">
          <span className="font-medium">Assortment overlap.</span> Two items in the catalog sit
          above 85% similarity to this listing, both in the same price band. Consider
          differentiating the colorway or consolidating before publishing.
          <button
            className="ml-2 font-display text-[13px] font-medium text-blue hover:underline"
            onClick={() => onNavigate('insights')}
          >
            Review overlap clusters →
          </button>
        </div>
      </div>
    </Card>
  )
}

function TrendingCard() {
  return (
    <Card>
      <CardHead
        icon="local_fire_department"
        title="Trending in this category"
        subtitle="Highest-engagement items in Women's Dresses over the last 30 days"
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {TRENDING_IN_CATEGORY.map((t) => (
          <div key={t.name} className="rounded-sm border border-line p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[13.5px] font-medium leading-snug text-ink-1">{t.name}</span>
              <span className="mono shrink-0 text-[12px] text-green tnum">{t.trend}</span>
            </div>
            <div className="mt-1 text-[12px] text-ink-3">{t.brand}</div>
            <div className="mt-3 flex items-center gap-2">
              <ScoreBar value={t.engagement_score} height={5} tone="purple" />
              <span className="mono text-[11.5px] text-ink-2 tnum">{t.engagement_score}</span>
            </div>
            <div className="mono mt-2 text-[11.5px] text-ink-3 tnum">
              {t.views.toLocaleString()} views · {t.saves.toLocaleString()} saves
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-sm border border-[#ceead6] bg-green-tint px-4 py-3">
        <Icon name="insights" size={18} className="mt-[1px] shrink-0 text-green" />
        <p className="text-[13px] leading-relaxed text-ink-1">
          <span className="font-medium">Market fit signal.</span> Floral prints and smocked bodices
          are both trending up in this category. The enriched attributes on this listing match 4 of
          the 6 highest-velocity attribute values — a strong signal for prioritized placement.
        </p>
      </div>
    </Card>
  )
}
