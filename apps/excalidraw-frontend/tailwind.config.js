// apps/web/tailwind.config.ts
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}", // 👈 important
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
