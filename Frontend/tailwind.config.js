/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust according to your file extensions
    './public/index.html', // Include HTML files if necessary
  ],
  theme: {
    extend: {
      colors: {
        'custom-teal': '#293745',
        'custom-white':'#feffff'
      },
    },
  },
  plugins: [],
}

