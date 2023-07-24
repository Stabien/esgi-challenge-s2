// eslint-disable-next-line no-undef
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-mode="dark"]'],

  theme: {
    extend: {
      colors: {
        cobalt: { 400: '#6562E4', 500: '#3B37DD' },
        'soft-black': '#191B1C',
        'soft-white': '#F2F2F2',
        orange: '#FD5530',
        palette: {
          'green-light': '#E5FFE5',
          green: '#07e037',
          primary: {
            50: '#ffebe5',
            100: '#ffd7cc',
            200: '#ffaf99',
            300: '#ff8666',
            400: '#ff5e33',
            500: '#ff3600',
            600: '#cc2b00',
            700: '#992000',
            800: '#661600',
            900: '#330b00'
          },
          gray: {
            50: '#fafafa',
            100: '#e6e6e6',
            200: '#cccccc',
            300: '#b3b3b3',
            400: '#999999',
            500: '#808080',
            600: '#666666',
            700: '#4d4d4d',
            800: '#333333',
            900: '#191919'
          },
          input: {
            100: '#f5f5f5',
            200: '#252525'
          }
        }
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-20%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 }
        },
        slideUpAndFade: {
          '0%': { opacity: 0, transform: 'translateY(2px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideRightAndFade: {
          '0%': { opacity: 0, transform: 'translateX(-2px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        slideDownAndFade: {
          '0%': { opacity: 0, transform: 'translateY(-2px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideLeftAndFade: {
          '0%': { opacity: 0, transform: 'translateX(2px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        }
      },
      animation: {
        'slide-in': 'slide-in .2s ease-out forwards',
        slideUpAndFade: 'slideUpAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)',
        slideDownAndFade: 'slideDownAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)',
        slideRightAndFade: 'slideRightAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)',
        slideLeftAndFade: 'slideLeftAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)'
      },
      fontFamily: {
        gridular: ['Gridular']
      },
      gridTemplateColumns: {
        '1/3': '1fr 2fr'
      },
      zIndex: {
        100: '100'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
