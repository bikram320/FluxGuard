/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                bg:      "#0a0a0f",
                surface: "#0f0f17",
                border:  "#1e1e2e",
                muted:   "#1a1a28",
                text:    "#e2e2f0",
                subtle:  "#6b6b85",
                accent:  "#00ff88",
                "accent-dim": "#00cc6a",
                danger:  "#ff4466",
                warning: "#ffaa00",
            },
            fontFamily: {
                display: ["'Space Grotesk'", "sans-serif"],
                mono:    ["'JetBrains Mono'", "monospace"],
            },
            fontWeight: {
                600: "600",
                700: "700",
                800: "800",
            },
            keyframes: {
                "slide-up": {
                    "0%":   { opacity: 0, transform: "translateY(12px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "fade-in": {
                    "0%":   { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                "pulse2": {
                    "0%, 100%": { opacity: 1 },
                    "50%":      { opacity: 0.3 },
                },
            },
            animation: {
                "slide-up": "slide-up 0.25s ease both",
                "fade-in":  "fade-in 0.2s ease both",
                "pulse2":   "pulse2 2s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};