/** Tailwind theme mapped onto the Google Cloud tokens in src/styles/tokens.css. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        'surface-tint': 'var(--surface-tint)',
        'surface-dark': 'var(--surface-dark)',

        blue: {
          DEFAULT: 'var(--gc-blue)',
          hover: 'var(--gc-blue-hover)',
          pressed: 'var(--gc-blue-pressed)',
          soft: 'var(--gc-blue-soft)',
          tint: 'var(--gc-blue-tint)',
        },
        red: { DEFAULT: 'var(--gc-red)', tint: 'var(--gc-red-tint)' },
        yellow: { DEFAULT: 'var(--gc-yellow)', tint: 'var(--gc-yellow-tint)' },
        green: { DEFAULT: 'var(--gc-green)', tint: 'var(--gc-green-tint)' },
        purple: { DEFAULT: 'var(--gc-purple)', tint: 'var(--gc-purple-tint)' },
        teal: { DEFAULT: 'var(--gc-teal)' },

        ink: {
          1: 'var(--text-1)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
          4: 'var(--text-4)',
        },
        line: {
          DEFAULT: 'var(--border-1)',
          soft: 'var(--border-2)',
          strong: 'var(--border-strong)',
        },
      },
      fontFamily: {
        display: ['DM Sans', 'Google Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Roboto Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
      },
      maxWidth: {
        content: 'var(--content-max)',
      },
    },
  },
  plugins: [],
}
