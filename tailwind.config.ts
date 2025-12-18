export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                background: "#001684",
                primary: "hsl(var(--primary))",
                secondary: "hsl(var(--secondary))",
                text: "hsl(var(--text))",
                border: "hsl(var(--border))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    }
}