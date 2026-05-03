// Rewrites legacy Tailwind v3 class syntax in our .tsx files into the
// modern Tailwind v4 forms suggested by `suggestCanonicalClasses`:
//
//   bg-[var(--foo)]    → bg-(--foo)
//   text-[var(--foo)]  → text-(--foo)
//   border-[var(--foo)]→ border-(--foo)
//   hover:bg-[var(...)]→ hover:bg-(--...)
//   bg-gradient-to-X   → bg-linear-to-X
//   bg-color/[0.0X]    → bg-color/X        (clean 1- or 2-digit %)
//   text-[#0a0a0b]     → text-canvas       (registered tokens)
//   border-[rgba(239,68,68,0.4)] → border-red-500/40
//   text-[#fecaca]     → text-red-200      (standard Tailwind hex)
//
// Idempotent. Safe to re-run.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.(t|j)sx?$/.test(p)) out.push(p);
  }
  return out;
}

const files = walk("src");

let totalEdits = 0;

// Hex (lowercased) → registered theme token.
const HEX_TO_TOKEN = {
  "#0a0a0b": "canvas",
  "#121214": "surface",
  "#1a1a1d": "surface-2",
  "#7b2cbf": "brand",
  "#6a21ad": "brand-600",
  "#581a94": "brand-700",
  "#f1f1f1": "text-primary",
  "#b0b0b0": "text-muted",
};

// Hex (lowercased) → built-in Tailwind v4 color name.
const HEX_TO_BUILTIN = {
  "#fecaca": "red-200",
  "#fca5a5": "red-300",
  "#5eead4": "teal-300",
  "#2dd4bf": "teal-400",
  "#a259f7": "purple-400",
  "#fbbf24": "amber-400",
  "#60a5fa": "blue-400",
};

// `r,g,b` (case-insensitive) → built-in name.
const RGB_TO_BUILTIN = {
  "239,68,68": "red-500",
  "45,212,191": "teal-400",
  "239,68,68,": "red-500",
};

function transform(src) {
  let out = src;
  let edits = 0;

  // 1. bg-[var(--x)] → bg-(--x)
  out = out.replace(
    /([a-zA-Z]+(?::[a-zA-Z]+)*-)\[var\((--[\w-]+(?:,[^)\]]+)?)\)\]/g,
    (_, prefix, inner) => {
      edits += 1;
      return `${prefix}(${inner})`;
    },
  );

  // 2. bg-gradient-to-X → bg-linear-to-X
  out = out.replace(/\bbg-gradient-to-([trblxy]+)\b/g, (_m, dir) => {
    edits += 1;
    return `bg-linear-to-${dir}`;
  });

  // 3. color/[0.0N] → color/N
  out = out.replace(
    /(\b[a-zA-Z]+(?::[a-zA-Z]+)*-(?:white|black|[a-z]+-\d{2,3}))\/\[0\.(\d{1,2})\]/g,
    (full, base, digits) => {
      let pct;
      if (digits.length === 1) pct = Number(digits) * 10;
      else if (digits.length === 2) pct = Number(digits);
      else return full;
      if (pct < 1 || pct > 100) return full;
      edits += 1;
      return `${base}/${pct}`;
    },
  );

  // 4. text-[#hex] → text-token (registered) or text-builtin (Tailwind palette)
  out = out.replace(
    /([a-zA-Z]+(?::[a-zA-Z]+)*-)\[(#[0-9a-fA-F]{3,8})\]/g,
    (full, prefix, hex) => {
      const k = hex.toLowerCase();
      if (HEX_TO_TOKEN[k]) {
        edits += 1;
        return `${prefix}${HEX_TO_TOKEN[k]}`;
      }
      if (HEX_TO_BUILTIN[k]) {
        edits += 1;
        return `${prefix}${HEX_TO_BUILTIN[k]}`;
      }
      return full;
    },
  );

  // 5. bg-[rgba(R,G,B,A)] → bg-builtin/PCT  (and same for border-, text-, ...).
  //    Only when (R,G,B) maps to a known Tailwind palette color. PCT is
  //    rounded to the nearest 1%.
  out = out.replace(
    /([a-zA-Z]+(?::[a-zA-Z]+)*-)\[rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)\]/g,
    (full, prefix, r, g, b, a) => {
      const key = `${r},${g},${b}`;
      const builtin = RGB_TO_BUILTIN[key];
      if (!builtin) return full;
      const pct = Math.max(1, Math.min(100, Math.round(Number(a) * 100)));
      edits += 1;
      return `${prefix}${builtin}/${pct}`;
    },
  );

  return { out, edits };
}

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const { out, edits } = transform(src);
  if (edits > 0) {
    writeFileSync(file, out);
    totalEdits += edits;
    console.log(`  ${file.padEnd(60)}  ${edits} change(s)`);
  }
}

console.log(`\n${totalEdits} total edit(s) across ${files.length} files.`);
