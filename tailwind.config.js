/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rise-red': '#D12027',
        'rise-blue': '#87CEEB',
      },
      backgroundImage: {
        'gradient-sky': 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%)',
      },
    },
  },
  plugins: [],
}