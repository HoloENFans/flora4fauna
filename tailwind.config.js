/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#EDE5DC',
        primary: '#5FA051',
        seconday: '#B3D99E',
        border: '#5FBB64',
        text: '#2F2F2F',
        heading: '#3273DB',
        header: '#ADD198',
        'primary-foreground': '#FFFFFF',
        'secondary-haeding': '#102602',
        'secondary-foreground': '#000000',
        'header-text': '#000000',
      },
    },
  },
  plugins: [],
};
