/* ─────────────────────────────────────────────────────────────────────────
   Demo data for the Catalog Enrichment demo.

   Everything here is fictional and vendor-neutral. Company names follow the
   usual placeholder set (Cymbal, Northwind, Contoso, Fabrikam) and the
   private-label brands are invented. There is deliberately no "merchant vs.
   seller" split: one catalog team works the whole flow.
   ───────────────────────────────────────────────────────────────────────── */

export const ORG = {
  name: 'Cymbal Retail',
  catalogSize: '1.4M SKUs',
}

// ── The raw vendor input the pipeline starts from (deliberately thin) ──

export const RAW_INPUT = [
  ['Title', 'Womens Dress - Black/Wht'],
  ['SKU', '847392-BLK'],
  ['Category', 'Apparel'],
  ['Description', 'Black and white printed dress for women. Has sleeves.'],
  ['Color', 'Black/White'],
  ['Material', '100% Polyester'],
  ['Care', 'Hand wash cold'],
  ['Origin', 'Imported'],
]

// ── The enriched record the pipeline produces ──

export const PRODUCT = {
  product_id: 'DR-847392',
  title: "Women's Black Floral Smocked Mini Dress",
  brand: 'Aria Studio',
  taxonomy: {
    google_product_category: 'Apparel & Accessories > Clothing > Dresses',
    site_category: 'Women > Dresses > Casual & Day Dresses',
  },
  attributes: {
    primary_color: 'Black',
    secondary_colors: ['White'],
    pattern: 'Floral',
    neckline: 'V-Neck',
    sleeve_length: '3/4 Sleeve',
    sleeve_style: 'Sheer',
    length: 'Mini / Above Knee',
    fit: 'A-Line',
    fabric_type: 'Chiffon / Georgette',
    special_features: ['Smocked bodice', 'Ruffle hem', 'Pockets', 'Sheer sleeves'],
  },
  enrichment: {
    descriptions: {
      short:
        'A versatile black and white floral mini dress featuring a smocked bodice, sheer sleeves, and pockets.',
      seo_optimized:
        "Shop the Women's Black Floral Smocked Mini Dress. Featuring a flattering V-neck, sheer 3/4 sleeves, and a playful ruffle hem. Perfect for casual outings or transitioning into fall fashion. Pair with knee-high boots for a complete look.",
    },
    tags: [
      'floral dress',
      'smocked waist',
      'mini dress',
      'fall fashion',
      'casual dress',
      'boho chic',
    ],
    multimodal_embeddings: 'mm-emb-v1 · 1408-dim · 984375983475…',
    visually_similar_ids: ['DR-847393', 'DR-102938'],
  },
}

// Per-field model confidence. Drives the green / yellow / red dots.
export const CONFIDENCE = {
  title: 0.96,
  brand: 0.88,
  google_product_category: 0.93,
  site_category: 0.9,
  primary_color: 0.98,
  pattern: 0.95,
  neckline: 0.91,
  sleeve_length: 0.89,
  sleeve_style: 0.87,
  length: 0.92,
  fit: 0.84,
  fabric_type: 0.86,
  short_description: 0.94,
  seo_optimized: 0.82,
  tags: 0.88,
}

// ── Category detection: model returns ranked candidates, human picks ──

export const CATEGORY_CANDIDATES = [
  {
    path: 'Apparel & Accessories > Clothing > Dresses',
    score: 0.93,
    rationale: 'Silhouette, hemline and bodice construction detected in the product image.',
  },
  {
    path: 'Apparel & Accessories > Clothing > Dresses > Casual Dresses',
    score: 0.71,
    rationale: 'Fabric weight and print suggest a day-dress subcategory.',
  },
]

// ── Attribute coverage: what the vendor sent vs. what the pipeline derived ──

export const COVERAGE = {
  before: 4,
  after: 15,
  multiple: '3.8×',
  derived: [
    { name: 'Pattern', value: 'Floral', source: 'Product image' },
    { name: 'Neckline', value: 'V-Neck', source: 'Product image' },
    { name: 'Sleeve length', value: '3/4 Sleeve', source: 'Product image' },
    { name: 'Sleeve style', value: 'Sheer', source: 'Product image' },
    { name: 'Length', value: 'Mini / Above Knee', source: 'Product image' },
    { name: 'Fit', value: 'A-Line', source: 'Product image' },
    { name: 'Fabric type', value: 'Chiffon / Georgette', source: 'Spec sheet + image' },
    { name: 'Special features', value: '4 detected', source: 'Product image' },
    { name: 'Google category', value: 'Dresses', source: 'Taxonomy mapping' },
    { name: 'Site category', value: 'Casual & Day Dresses', source: 'Taxonomy mapping' },
    { name: 'SEO tags', value: '6 generated', source: 'Generated from attributes' },
  ],
}

// ── Generated Q&A (deck: "Q&A Generation") ──

export const GENERATED_QA = [
  {
    q: 'What fabric is this dress made from?',
    a: "It's a lightweight chiffon/georgette blend — airy enough for warm days, with a smocked bodice that gives a comfortable stretch fit through the waist.",
  },
  {
    q: 'How long is the dress?',
    a: 'It sits above the knee — a mini length with an A-line skirt and a ruffle hem for a bit of movement.',
  },
  {
    q: 'Does it have pockets?',
    a: 'It does. Side seam pockets are built into the skirt.',
  },
  {
    q: 'Are the sleeves see-through?',
    a: 'The 3/4 sleeves are sheer, while the bodice and skirt are fully lined.',
  },
]

// ── Localization (deck: "Translation of product data", locale-aware units) ──

export const LOCALES = [
  {
    code: 'es-MX',
    label: 'Spanish (Mexico)',
    title: 'Vestido corto floral negro con canesú fruncido para mujer',
    note: 'Measurements converted to cm · currency MXN',
  },
  {
    code: 'fr-CA',
    label: 'French (Canada)',
    title: 'Robe courte à fleurs noire à corsage smocké pour femme',
    note: 'Measurements converted to cm · currency CAD',
  },
  {
    code: 'de-DE',
    label: 'German (Germany)',
    title: 'Kurzes schwarzes Blumenkleid mit Smok-Oberteil für Damen',
    note: 'Measurements converted to cm · currency EUR',
  },
]

// ── Pipeline steps shown during processing ──

export const PIPELINE_STEPS = [
  'Parsing document structure & extracting text',
  'Multimodal attribute extraction (color, pattern, fit)',
  'Detecting & mapping category taxonomy',
  'Generating descriptions, SEO tags & Q&A',
  'Computing multimodal embeddings',
  'Similarity search across the catalog',
]

// ── Batch queue (deck: "Batch generation of product data") ──

export const BATCH_QUEUE = [
  { id: 'DR-847392', name: "Women's Black Floral Smocked Mini Dress", status: 'review', confidence: 0.91, newAttrs: 11 },
  { id: 'JK-221058', name: 'Relaxed Linen Blazer', status: 'auto', confidence: 0.96, newAttrs: 9 },
  { id: 'PT-559013', name: 'Stretch Woven Jogger Pant', status: 'auto', confidence: 0.94, newAttrs: 8 },
  { id: 'HD-330187', name: "Kids' Tie-Dye Fleece Hoodie", status: 'review', confidence: 0.79, newAttrs: 12 },
  { id: 'KT-901744', name: 'Ceramic Pour-Over Coffee Set', status: 'auto', confidence: 0.93, newAttrs: 14 },
  { id: 'EL-664200', name: 'Wireless Noise-Canceling Earbuds', status: 'review', confidence: 0.72, newAttrs: 17 },
]

// ── Similar items surfaced for the item under review ──

export const SIMILAR_ITEMS = [
  { name: 'Floral Wrap Midi Dress', brand: 'Aria Studio', match: 91, engagement_score: 88, views: 5615, saves: 1490, trend: '+14%' },
  { name: 'Smocked Bodice Tiered Mini Dress', brand: 'Northloop', match: 87, engagement_score: 82, views: 4725, saves: 1255, trend: '+22%' },
  { name: 'Ruffle Hem Floral Shift Dress', brand: 'Everyday Basics', match: 84, engagement_score: 76, views: 3905, saves: 970, trend: '+8%' },
  { name: 'Black Chiffon A-Line Dress', brand: 'Aria Curve', match: 79, engagement_score: 71, views: 3110, saves: 790, trend: '+5%' },
]

export const TRENDING_IN_CATEGORY = [
  { name: 'Satin Slip Midi Dress', brand: 'Aria Studio', engagement_score: 96, views: 7700, saves: 2050, trend: '+32%' },
  { name: 'Ribbed Knit Bodycon Dress', brand: 'Northloop', engagement_score: 91, views: 6600, saves: 1790, trend: '+28%' },
  { name: 'Linen Blend Shirt Dress', brand: 'Everyday Basics', engagement_score: 85, views: 5050, saves: 1370, trend: '+15%' },
]

/* ═════════════════════════ Insights & Analytics ═════════════════════════ */

export const CATALOG_KPIS = [
  {
    key: 'coverage',
    label: 'Attribute coverage',
    value: '87%',
    delta: '+23 pts',
    deltaTone: 'up',
    caption: 'Share of catalog attributes populated, up from 64% pre-enrichment',
    icon: 'checklist',
  },
  {
    key: 'throughput',
    label: 'Items enriched (30d)',
    value: '42,180',
    delta: '+18%',
    deltaTone: 'up',
    caption: 'Batch + interactive runs across all categories',
    icon: 'bolt',
  },
  {
    key: 'confidence',
    label: 'Auto-approved',
    value: '76%',
    delta: '+9 pts',
    deltaTone: 'up',
    caption: 'Enriched above the confidence threshold; 24% routed to review',
    icon: 'verified',
  },
  {
    key: 'overlap',
    label: 'Overlaps flagged',
    value: '312',
    delta: '−41 open',
    deltaTone: 'down',
    caption: 'Near-duplicate listings caught before they reached the assortment',
    icon: 'content_copy',
  },
]

// Attribute coverage by category — drives the bar chart.
export const COVERAGE_BY_CATEGORY = [
  { category: 'Apparel', before: 61, after: 92 },
  { category: 'Home & Kitchen', before: 58, after: 89 },
  { category: 'Electronics', before: 72, after: 95 },
  { category: 'Beauty', before: 49, after: 84 },
  { category: 'Toys & Kids', before: 55, after: 81 },
  { category: 'Grocery', before: 44, after: 72 },
]

// Confidence distribution across the last enrichment run.
export const CONFIDENCE_MIX = [
  { band: 'High (≥90%)', pct: 62, tone: 'green' },
  { band: 'Moderate (80–89%)', pct: 25, tone: 'yellow' },
  { band: 'Review (<80%)', pct: 13, tone: 'red' },
]

export const TOP_ITEMS = [
  {
    rank: 1,
    name: 'Relaxed Linen Blazer',
    brand: 'Aria Studio',
    category: "Women's Outerwear",
    engagement_score: 94,
    views: 12840,
    saves: 3210,
    trend: '+18%',
    coverage: 96,
    similar: [
      { name: 'Linen-Blend Open Blazer', brand: 'Everyday Basics', match: '92%' },
      { name: 'Oversized Soft Blazer', brand: 'Northloop', match: '87%' },
      { name: 'Structured Linen Jacket', brand: 'Aria Curve', match: '84%' },
    ],
  },
  {
    rank: 2,
    name: 'Athletic Jogger Pant',
    brand: 'Motion Co.',
    category: "Men's Activewear",
    engagement_score: 89,
    views: 10530,
    saves: 2870,
    trend: '+12%',
    coverage: 91,
    similar: [
      { name: 'Performance Track Pant', brand: 'Fieldgood', match: '90%' },
      { name: 'Stretch Woven Jogger', brand: 'Motion Co.', match: '86%' },
      { name: 'Tapered Active Pant', brand: 'Northloop', match: '81%' },
    ],
  },
  {
    rank: 3,
    name: 'Rainbow Tie-Dye Hoodie',
    brand: 'Kindred Kids',
    category: "Kids' Tops",
    engagement_score: 87,
    views: 9870,
    saves: 2640,
    trend: '+25%',
    coverage: 78,
    similar: [
      { name: 'Pastel Ombre Pullover', brand: 'Artroom', match: '88%' },
      { name: 'Graphic Fleece Hoodie', brand: 'Kindred Kids', match: '85%' },
      { name: 'Color Block Zip Hoodie', brand: 'Motion Co.', match: '79%' },
    ],
  },
  {
    rank: 4,
    name: 'Ceramic Pour-Over Coffee Set',
    brand: 'Terra Home',
    category: 'Kitchen & Dining',
    engagement_score: 82,
    views: 8340,
    saves: 2150,
    trend: '+9%',
    coverage: 94,
    similar: [
      { name: 'Stoneware Coffee Dripper', brand: 'Hearthline', match: '91%' },
      { name: 'Glass Pour-Over Brewer', brand: 'Terra Home', match: '83%' },
      { name: 'Travel Pour-Over Kit', brand: 'Everyday Basics', match: '76%' },
    ],
  },
  {
    rank: 5,
    name: 'Wireless Noise-Canceling Earbuds',
    brand: 'Volt Audio',
    category: 'Electronics',
    engagement_score: 79,
    views: 7650,
    saves: 1980,
    trend: '+6%',
    coverage: 88,
    similar: [
      { name: 'ANC True Wireless Earbuds', brand: 'Beacon', match: '89%' },
      { name: 'Sport Wireless Earbuds', brand: 'Volt Audio', match: '82%' },
      { name: 'Bluetooth Earbuds Pro', brand: 'Kestrel', match: '78%' },
    ],
  },
]

// Near-duplicate clusters found by similarity search over the embeddings.
export const OVERLAP_CLUSTERS = [
  {
    cluster: 'Linen blazers, spring drop',
    items: 4,
    similarity: 93,
    teams: 3,
    note: 'Four near-identical linen blazers entered the catalog independently across three category teams.',
    severity: 'high',
  },
  {
    cluster: 'Smocked mini dresses',
    items: 3,
    similarity: 88,
    teams: 2,
    note: 'Two teams are evaluating overlapping floral smocked silhouettes at the same price point.',
    severity: 'medium',
  },
  {
    cluster: 'Pour-over coffee sets',
    items: 2,
    similarity: 84,
    teams: 2,
    note: 'Ceramic and stoneware drippers differ only in material; consolidate or differentiate.',
    severity: 'low',
  },
]

export const FASHION_TRENDS = [
  { trend: 'Quiet Luxury', momentum: 'rising', score: 92, description: 'Understated elegance with premium fabrics and neutral tones continues to dominate.' },
  { trend: 'Dopamine Dressing', momentum: 'stable', score: 78, description: 'Bold colors and playful patterns for mood-boosting outfits.' },
  { trend: 'Coastal Classic', momentum: 'declining', score: 61, description: 'Relaxed, classic coastal style showing signs of cooling off.' },
]

export const SEASONAL_TRENDS = [
  { trend: 'Transitional Layers', momentum: 'rising', score: 88, description: 'Lightweight jackets and cardigans for unpredictable shoulder-season weather.' },
  { trend: 'Garden Party Ready', momentum: 'rising', score: 85, description: 'Floral prints, midi dresses, and pastel accessories surging for spring events.' },
  { trend: 'Resort Wear Carryover', momentum: 'stable', score: 72, description: 'Vacation-inspired pieces extending into everyday wardrobes.' },
]

export const SOCIAL_TRENDS = [
  { platform: 'Short video', trend: '#CleanGirlAesthetic', mentions: '2.4M', velocity: '+340%', description: 'Minimalist beauty and fashion with slicked-back hair and gold jewelry.' },
  { platform: 'Short video', trend: '#SpringHauls', mentions: '1.8M', velocity: '+120%', description: 'Shoppers sharing new arrivals and hidden gems from value retailers.' },
  { platform: 'Photo social', trend: '#SpringStyle', mentions: '980K', velocity: '+85%', description: 'Spring outfit inspiration driving discovery and engagement.' },
]

export const VIDEO_TRENDS = [
  { type: 'Fashion Hauls', trend: 'Spring Try-On', views: '4.2M', velocity: '+200%', description: 'Creator haul videos featuring spring collections driving significant traffic.' },
  { type: 'Home & Living', trend: 'Kitchen Organization', views: '2.8M', velocity: '+65%', description: 'Home organization content featuring affordable kitchen products.' },
  { type: 'Tech Reviews', trend: 'Budget Audio Gear', views: '1.5M', velocity: '+45%', description: 'Reviews of affordable wireless earbuds gaining traction.' },
]

export const COMPETITIVE_NEWS = [
  {
    retailer: 'Northwind Traders',
    headline: 'Northwind Traders expands private-label activewear with 40 new SKUs',
    date: 'Jul 28, 2026',
    category: 'Activewear',
    impact: 'high',
    summary:
      "Northwind is expanding its private-label activewear line into the $25–$45 range, directly overlapping our Motion Co. assortment. Early reviews highlight moisture-wicking fabrics and inclusive sizing.",
  },
  {
    retailer: 'Contoso Retail',
    headline: 'Contoso Retail launches an AI personal stylist in its mobile app',
    date: 'Jul 24, 2026',
    category: 'Technology',
    impact: 'high',
    summary:
      'Contoso rolled out an AI stylist that recommends outfits from purchase history and local weather. Early adoption shows a 23% lift in average order value.',
  },
  {
    retailer: 'Northwind Traders',
    headline: 'Northwind partners with 15 creators for a spring campaign',
    date: 'Jul 21, 2026',
    category: 'Marketing',
    impact: 'medium',
    summary:
      'A creator cohort with 28M combined followers launches "Spring Into Northwind" next month, focused on Gen Z apparel and dorm essentials.',
  },
  {
    retailer: 'Fabrikam Home',
    headline: 'Fabrikam cuts prices on 500+ home goods items',
    date: 'Jul 18, 2026',
    category: 'Pricing',
    impact: 'high',
    summary:
      'Permanent reductions averaging 15% across home and kitchen put pressure on our Terra Home and Everyday Basics price points.',
  },
]

export const TIME_RANGES = [
  { key: '1d', label: 'Last 24 hours', range: 'Aug 2 – Aug 3, 2026' },
  { key: '7d', label: 'Last 7 days', range: 'Jul 27 – Aug 3, 2026' },
  { key: '30d', label: 'Last 30 days', range: 'Jul 4 – Aug 3, 2026' },
  { key: '90d', label: 'Last 90 days', range: 'May 5 – Aug 3, 2026' },
]

// Canned assistant answers. Keyed by keyword match on the question.
export const ASSISTANT_REPLIES = {
  default:
    'Across the catalog, **attribute coverage now sits at 87%** — up 23 points since enrichment went live. The weakest categories are **Grocery (72%)** and **Toys & Kids (81%)**, which is also where review queues are longest. The single highest-value next step is backfilling fabric and dimension attributes in Toys & Kids: those two fields account for **61% of the low-confidence flags** in that category.',
  coverage:
    'Coverage by category: **Electronics 95%**, **Apparel 92%**, **Home & Kitchen 89%**, **Beauty 84%**, **Toys & Kids 81%**, **Grocery 72%**. Grocery lags because most items arrive with images only and no spec sheet — a video-to-attributes pass would close roughly half that gap.',
  overlap:
    'I found **3 active overlap clusters**. The largest is **linen blazers** — four near-identical items at 93% similarity entered from three different category teams within six weeks. Consolidating to two SKUs would free roughly **$180K in open-to-buy** and remove a direct self-cannibalization risk in the spring drop.',
  trends:
    "Trend snapshot: **Quiet Luxury** leads at a score of 92 and still rising — linen, neutral tones, understated construction. On social, **#CleanGirlAesthetic** is at 2.4M mentions (+340%). Seasonally, **Garden Party Ready** is surging (85) — floral prints and midi dresses are the sweet spot for the next assortment window.",
  competitive:
    "**Northwind Traders** just added 40 private-label activewear SKUs in the $25–$45 band, which overlaps our Motion Co. line directly. Our jogger pant is the #2 most-engaged item in the catalog (+12%), so demand is there. I'd (1) pull spring colorways forward, (2) lead with size-inclusive coverage as the differentiator, and (3) make sure the activewear attribute set is fully enriched so those items rank in on-site search.",
}
