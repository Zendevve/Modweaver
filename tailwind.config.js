/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // System semantic colors (Apple HIG compliant)
        'label': {
          primary: 'var(--color-label-primary)',
          secondary: 'var(--color-label-secondary)',
          tertiary: 'var(--color-label-tertiary)',
        },
        'bg': {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        'separator': 'var(--color-separator)',
        'accent': 'var(--color-accent)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // Apple HIG typography scale
        'caption2': ['11px', { lineHeight: '13px', letterSpacing: '0.07px' }],
        'caption1': ['12px', { lineHeight: '16px' }],
        'footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px' }],
        'subheadline': ['15px', { lineHeight: '20px', letterSpacing: '-0.24px' }],
        'callout': ['16px', { lineHeight: '21px', letterSpacing: '-0.32px' }],
        'body': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px' }],
        'headline': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px', fontWeight: '600' }],
        'title3': ['20px', { lineHeight: '24px', letterSpacing: '0.38px' }],
        'title2': ['22px', { lineHeight: '28px', letterSpacing: '0.35px' }],
        'title1': ['28px', { lineHeight: '34px', letterSpacing: '0.36px' }],
        'largeTitle': ['34px', { lineHeight: '41px', letterSpacing: '0.37px' }],
      },
      spacing: {
        // Minimum touch target (Apple HIG: 44pt minimum)
        'touch': '44px',
        'touch-min': '28px',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
