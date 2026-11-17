import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const catalog = JSON.parse(await readFile(path.join(HERE, 'data/catalog.json'), 'utf8'))
const styles = catalog.styles
const bySlug = new Map(styles.map((s) => [s.slug, s]))

test('catalog exposes all 84 styles with unique slugs', () => {
  assert.equal(styles.length, 84)
  assert.equal(bySlug.size, 84)
  assert.ok(catalog.generatedAt)
})

test('every style carries the fields the panel and the tool rely on', () => {
  const required = ['slug', 'displayName', 'nameZh', 'category', 'summaryZh', 'positioningZh',
    'styleKeywords', 'tagsZh', 'useCases', 'bestFor', 'avoidFor', 'aiChecklist',
    'recommendedPromptZh', 'sourceUrl', 'designFile', 'colors', 'typography', 'radius', 'spacing', 'visual']
  for (const style of styles) {
    for (const field of required) {
      assert.ok(style[field] !== undefined && style[field] !== null, `${style.slug} missing ${field}`)
    }
    assert.ok(style.summaryZh.length > 10, `${style.slug} summary too short`)
    assert.ok(Array.isArray(style.styleKeywords) && style.styleKeywords.length > 0, `${style.slug} keywords`)
    assert.match(style.sourceUrl, /^https:\/\/getdesign\.md\/[^/]+\/design-md$/)
  }
})

test('tokens stay inside the ranges the previews are designed for', () => {
  for (const { slug, visual, colors } of styles) {
    assert.match(visual.canvas, /^#[0-9a-f]{6}$/i, `${slug} canvas`)
    assert.match(visual.accent, /^#[0-9a-f]{6}$/i, `${slug} accent`)
    assert.ok(visual.displaySize >= 30 && visual.displaySize <= 112, `${slug} displaySize ${visual.displaySize}`)
    assert.ok(visual.displayLineHeight >= 0.92 && visual.displayLineHeight <= 1.9, `${slug} lineHeight ${visual.displayLineHeight}`)
    assert.ok(visual.spaceBase >= 2 && visual.spaceBase <= 24, `${slug} spaceBase ${visual.spaceBase}`)
    assert.ok(typeof visual.darkFirst === 'boolean', `${slug} darkFirst`)
    assert.ok(['sans', 'serif', 'mono'].includes(visual.fontClass), `${slug} fontClass`)
    assert.ok(colors.length >= 4, `${slug} colors`)
    // rgba() tokens carry no hex; the panel filters those out before rendering.
    for (const color of colors) {
      if (color.hex === '') continue
      assert.match(color.hex, /^#[0-9a-f]{3,8}$/i, `${slug} color ${color.hex}`)
    }
  }
})

test('no absolute build paths leak into the shipped catalog', () => {
  const raw = JSON.stringify(catalog)
  assert.equal(raw.includes('/Users/'), false)
  assert.equal(raw.includes('designPath'), false)
})

test('Chinese copy is unique per style', () => {
  for (const field of ['summaryZh', 'positioningZh', 'recommendedPromptZh']) {
    const seen = new Map()
    for (const style of styles) {
      const value = style[field]
      assert.equal(seen.has(value), false, `${field} duplicated: ${style.slug} ~ ${seen.get(value)}`)
      seen.set(value, style.slug)
    }
  }
})

test('design and brief files exist for every style', async () => {
  for (const style of styles) {
    await access(path.join(HERE, style.designFile))
    await access(path.join(HERE, 'data/brief', `${style.slug}.md`))
  }
})

test('the 20 hand-written copy entries are present', async () => {
  const copy = JSON.parse(await readFile(path.join(HERE, 'build/copy-overrides.json'), 'utf8'))
  for (const [slug, entry] of Object.entries(copy)) {
    const style = bySlug.get(slug)
    assert.ok(style, `copy override for unknown slug ${slug}`)
    assert.equal(style.summaryZh, entry.summaryZh, `${slug} summary override not applied`)
    assert.equal(style.positioningZh, entry.positioningZh, `${slug} positioning override not applied`)
  }
})
