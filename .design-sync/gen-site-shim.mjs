// Regenerates shims/site-raw.ts from src/data/site.md.
//
// src/data/site.ts imports './site.md?raw' (a Vite raw-text import) to feed
// the Hero/Outro prose. esbuild has no ?raw loader, so the design-sync build
// aliases that specifier (tsconfig.esbuild.json paths) to shims/site-raw.ts —
// a generated module holding the file's text. Run this before every
// design-sync build so the shim never rots:
//
//   node .design-sync/gen-site-shim.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const md = readFileSync(join(here, '../src/data/site.md'), 'utf8')
const out =
  "// GENERATED from src/data/site.md — regenerate before each design-sync build\n" +
  "// (node .design-sync/gen-site-shim.mjs). Wired via tsconfig paths: './site.md?raw'.\n" +
  '// esbuild has no ?raw loader, so the real file rides in as a string constant.\n' +
  'export default ' + JSON.stringify(md) + '\n'
writeFileSync(join(here, 'shims/site-raw.ts'), out)
console.log('site-raw.ts regenerated from site.md')
