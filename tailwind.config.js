/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*',
    './Features/**/*.cshtml',
    './Features/CMS/ContentAreaRenderer/ContentAreaItemRenderer.cs',
    'index.html',
    './index.html',
    './static/css/*',
    './templates/*',
    'static/css/',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

