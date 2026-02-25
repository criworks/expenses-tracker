module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter_400Regular', 'sans-serif'],
        light: ['Inter_300Light', 'sans-serif'],
        medium: ['Inter_500Medium', 'sans-serif'],
        bold: ['Inter_700Bold', 'sans-serif'],
      },
      colors: {
        background: '#111217',
        'text-secondary': '#60677D',
        'interactive': '#262A35',
        'text-primary': '#ffffff',
      },
    },
  },
  plugins: [],
}
