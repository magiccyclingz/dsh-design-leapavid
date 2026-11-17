/**
 * Fail when the committed catalog no longer matches what build-data.mjs produces.
 * `generatedAt` is a build timestamp, so only the styles are compared.
 */
import { readFile } from 'node:fs/promises'

const [beforePath, afterPath] = process.argv.slice(2)
if (!beforePath || !afterPath) {
  console.error('usage: node build/check-drift.mjs <committed.json> <rebuilt.json>')
  process.exit(2)
}

const before = JSON.parse(await readFile(beforePath, 'utf8')).styles
const after = JSON.parse(await readFile(afterPath, 'utf8')).styles

if (before.length !== after.length) {
  console.error(`style count changed: ${before.length} → ${after.length}`)
  process.exit(1)
}

let bad = 0
for (let i = 0; i < before.length; i += 1) {
  const a = JSON.stringify(before[i])
  const b = JSON.stringify(after[i])
  if (a !== b) {
    bad += 1
    if (bad <= 3) console.error(`drift: ${after[i].slug || after[i].displayName}`)
  }
}

if (bad) {
  console.error(`${bad} style(s) differ — rerun build/build-data.mjs and commit data/catalog.json`)
  process.exit(1)
}
console.log(`catalog up to date (${after.length} styles)`)
