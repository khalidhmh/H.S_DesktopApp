/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/renderer/index.html",
        "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#002147", // اللون الكحلي
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#F2C94C", // اللون الذهبي
                    foreground: "#002147",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            fontFamily: {
                sans: ['Cairo', 'sans-serif'], // الخط العربي
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}