/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       colors:{
        color_turquesa1:'#21d3bd',
        color_turquesa2:'#42dece',
        color_turquesa3:'#63e9de',
        color_turquesa4:'#84f4ef',
        color_turquesa5:'#a5ffff',
        color_turquesa6:'#0a6067',
        color_turquesa7:'#3f8c8c',
       
       }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

