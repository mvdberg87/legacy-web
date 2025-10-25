// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Compat helpt om "extends: next/*" te gebruiken in Flat Config
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Basis Next.js + TypeScript regels
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Welke paden ESLint mag overslaan
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },

  // 🔧 Projectbrede regels toevoegen/aanpassen
  {
    rules: {
      // ⬇️ Zet de regel uit die je build blokkeert
      "@typescript-eslint/no-explicit-any": "off",

      // (optioneel) img-warning uit, omdat je al next/image gebruikt
      // "@next/next/no-img-element": "off",
    },
  },

  // (optioneel) Alleen voor specifieke bestanden versoepelen
  // Handig als je de rest streng wilt houden
  // {
  //   files: ["src/app/club/**/page.tsx", "src/app/legacy-demo/page.tsx"],
  //   rules: { "@typescript-eslint/no-explicit-any": "off" },
  // },
];
