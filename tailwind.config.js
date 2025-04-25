/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,jsx,ts,tsx}",
    "./src/renderer/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'editor-bg': '#1e1e1e',
        'sidebar-bg': '#252526',
        'sidebar-active': '#37373d',
        'accent': '#007fd4',
        'text-primary': '#cccccc',
        'text-secondary': '#8a8a8a',
        'border': '#3e3e42',
      }
    },
  },
  plugins: [],
}