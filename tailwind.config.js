/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '0.75rem',
    },
    screens: {
      md: '768px',
      lg: '1024px',
      xl: '1920px',
    },
    colors: {
      primary: {
        DEFAULT: '#FCB738',
        light: '#FFF4E0',
        dark: '#F49E00',
      },
      gray: {
        4: '#F5F5F5',
        DEFAULT: '#EAE8DC',
        3: '#CBCAC8',
        2: '#888888',
        1: '#1E1E1E',
      },
    },
    fontFamily: {
      sans: ['Noto Sans TC', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('flowbite/plugin'),
  ],
};
