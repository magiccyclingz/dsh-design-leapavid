import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Guards our dsh-m market entry against the upstream copy guide:
//   docs/registry-copy-guide.md §2 (<=60 width units), §3 (tone), §4 (compat clause),
//   §10 (icon must be an https URL with a floating major), and the registry schema
//   (only the documented keys; npm/github fields must match `source`).
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const readJson = (rel) => JSON.parse(readFileSync(path.join(root, rel), 'utf8'))
const entry = readJson('docs/market-entry.json')
const githubVariant = readJson('docs/market-entry.github.json')
const registry = readJson('docs/hub-registry.json')

/** §2: full-width counts 1, ASCII counts 0.5. */
function widthUnits(text) {
  let units = 0
  for (const ch of text) {
    const wide = /[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(ch)
    units += wide ? 1 : 0.5
  }
  return units
}

const ALLOWED_KEYS = new Set([
  'id', 'name', 'description', 'category', 'alsoCategories', 'tags', 'verified',
  'source', 'npm', 'github', 'screenshots', 'icon', 'homepage', 'audience', 'decoupled',
])

test('market entry: description stays inside the 60 width-unit budget', () => {
  const units = widthUnits(entry.description)
  assert.ok(units <= 60, `description is ${units} width units, budget is 60`)
  assert.ok(units >= 24, `description is only ${units} width units`)
})

test('market entry: no precision numbers without a freshness mechanism', () => {
  // §2 forbids counts like "7 个工具" / "84 套" unless something keeps them up to date.
  assert.equal(/\d+\s*(套|个|种|款)/.test(entry.description), false, entry.description)
})

test('market entry: tags are functional keywords, at most four, no relation wording', () => {
  assert.ok(Array.isArray(entry.tags) && entry.tags.length > 0 && entry.tags.length <= 4, JSON.stringify(entry.tags))
  for (const tag of entry.tags) {
    assert.equal(/^(需|推荐)/.test(tag), false, tag)
    assert.equal(tag.includes(' '), false, tag)
  }
})

test('market entry: only documented schema keys, npm source is self-consistent', () => {
  for (const key of Object.keys(entry)) assert.ok(ALLOWED_KEYS.has(key), `unexpected key ${key}`)
  assert.equal(entry.source, 'npm')
  assert.equal(entry.npm, 'dsh-design-leapavid')
  assert.equal(entry.github, 'magiccyclingz/dsh-design-leapavid')
  assert.equal('version' in entry, false, 'registry has no version field; use verified[]')
})

test('market entry: coupled entry carries a compat clause and verified list', () => {
  assert.deepEqual(entry.verified, ['0.2.2-rc.3'])
  assert.match(entry.description, /已适配 0\.2\.2-rc\.3，详见仓库$/)
})

test('market entry: icon is https with a floating major, not a pinned version', () => {
  const url = new URL(entry.icon)
  assert.equal(url.protocol, 'https:')
  assert.match(entry.icon, /@\d+\/icon\.svg$/, entry.icon)
})

test('market entry: github variant mirrors the npm one apart from the source fields', () => {
  assert.equal(githubVariant.source, 'github')
  assert.equal('npm' in githubVariant, false)
  assert.equal(githubVariant.description, entry.description)
  assert.deepEqual(githubVariant.tags, entry.tags)
  assert.deepEqual(githubVariant.verified, entry.verified)
})

test('hub registry preview embeds exactly the npm-source entry', () => {
  assert.equal(registry.version, 1)
  assert.equal(registry.plugins.length, 1)
  assert.deepEqual(registry.plugins[0], entry)
})
