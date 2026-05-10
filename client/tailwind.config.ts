import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        navy: {
          950: "#050817",
          900: "#081126",
          800: "#0e1b3d"
        },
        coral: {
          500: "#ff6b57",
          600: "#ee4f3b"
        }
      },
      boxShadow: {
        glow: "0 22px 80px rgba(56, 189, 248, 0.18)",
        premium: "0 24px 80px rgba(6, 13, 35, 0.18)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"]
      },
      opacity: {
        8: "0.08",
        12: "0.12",
        14: "0.14",
        15: "0.15",
        18: "0.18",
        58: "0.58",
        62: "0.62",
        66: "0.66",
        68: "0.68",
        72: "0.72",
        74: "0.74",
        76: "0.76",
        78: "0.78",
        82: "0.82",
        90: "0.9",
        92: "0.92"
      },
      backgroundImage: {
        "app-gradient": "radial-gradient(circle at top left, rgba(34,211,238,0.22), transparent 34%), radial-gradient(circle at 80% 10%, rgba(168,85,247,0.2), transparent 26%), linear-gradient(135deg, #050817 0%, #081126 46%, #1c1346 100%)",
        "mesh-light": "radial-gradient(circle at top left, rgba(59,130,246,0.14), transparent 28%), radial-gradient(circle at 85% 12%, rgba(249,115,22,0.12), transparent 28%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)"
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
