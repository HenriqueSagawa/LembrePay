/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C5CE7",
          light: "#A29BFE",
          dark: "#5A4BD1",
        },
        secondary: {
          DEFAULT: "#00D2D3",
          light: "#55EFC4",
          dark: "#00B4B5",
        },
        background: {
          DEFAULT: "#0F0F1A",
          card: "#1A1A2E",
          elevated: "#252540",
        },
        danger: {
          DEFAULT: "#FF6B6B",
          light: "#FF8A8A",
        },
        success: {
          DEFAULT: "#00D2D3",
          light: "#55EFC4",
        },
        warning: {
          DEFAULT: "#FECA57",
          light: "#FFF3BF",
        },
        text: {
          DEFAULT: "#FFFFFF",
          secondary: "#A0A0B8",
          muted: "#6C6C80",
        },
      },
      fontFamily: {
        "space-light": ["SpaceGrotesk-Light"],
        "space-regular": ["SpaceGrotesk-Regular"],
        "space-medium": ["SpaceGrotesk-Medium"],
        "space-semibold": ["SpaceGrotesk-SemiBold"],
        "space-bold": ["SpaceGrotesk-Bold"],
      },
    },
  },
  plugins: [],
};
