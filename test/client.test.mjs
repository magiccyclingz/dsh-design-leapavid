import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const src = await readFile(path.join(HERE, 'client.js'), 'utf8')

test('client module keeps the loader contract', () => {
  assert.ok(src.includes("window.__ModuleLoader__.load("))
  assert.ok(src.includes("id: 'dsh-design-md'"))
  assert.match(src, /inject:\s*\[[^\]]*'slots'/)
  assert.match(src, /inject:\s*\[[^\]]*'locale'/)
  assert.match(src, /inject:\s*\[[^\]]*'layout'/)
})

test('panel registers both the sidebar entry and the main panel', () => {
  assert.ok(src.includes("'sidebar.panellist'"))
  assert.match(src, /key:\s*PANEL_ID/)
  assert.ok(src.includes("const PANEL_ID = 'design-md'"))
  assert.ok(src.includes('data-dm-entry'))
})

test('previews never load a remote asset', () => {
  const remote = src.match(/https?:\/\/[^\s'"`)]+/g) || []
  assert.deepEqual(remote.filter((url) => !url.startsWith('https://getdesign.md')), [])
})

test('preview markup avoids the two font pitfalls we hit', () => {
  // 1. `font:` shorthand silently drops the whole declaration when it carries cqw units.
  assert.equal(/font:\s*\d/.test(src), false)
  // 2. Double quotes inside a font stack close the inline style attribute early.
  assert.ok(src.includes('function fam('))
  assert.match(src, /replace\(\/"\/g, "'"\)/)
  for (const stack of src.match(/font-family:\$\{[^}]+\}/g) || []) {
    assert.equal(stack.includes('"'), false, `raw font stack: ${stack.slice(0, 60)}`)
  }
})

test('containers drive the preview scale', () => {
  assert.ok(src.includes('container-type:inline-size'))
  assert.ok(src.includes('cqw'))
})

test('theme control covers every surface', () => {
  assert.equal(src.includes("surface === 'page'\n              ? h('div', { className: 'dm-seg dm-seg-themed' }"), false)
})
