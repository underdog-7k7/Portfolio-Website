/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#12100e',
        cream: '#faf3e3',
        amberish: '#ffb454',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        bootbar: {
          '0%': { transform: 'translateX(-48px)' },
          '100%': { transform: 'translateX(160px)' },
        },
        channel: {
          '0%': { opacity: '0', transform: 'translateX(36px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        crtOn: {
          '0%': { opacity: '0', transform: 'scaleY(0.004) scaleX(0.7)' },
          '55%': { opacity: '1', transform: 'scaleY(0.02) scaleX(1)' },
          '100%': { opacity: '1', transform: 'scaleY(1) scaleX(1)' },
        },
      },
      animation: {
        rise: 'rise 0.35s ease-out both',
        blink: 'blink 1s step-end infinite',
        channel: 'channel 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'crt-on': 'crtOn 0.55s ease-out both',
      },
    },
  },
  plugins: [],
}
