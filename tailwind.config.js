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
    extend: {
      dropShadow: {
        '2xlg': '0 5px 10px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        fadeIn: 'fadeIn .5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('flowbite/plugin'),
  ],
};
