import test from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../index.js'

/** Minimal host stand-in: capture the HTTP route and the agent tool. */
function boot() {
  const state = { route: null, tool: null }
  const ctx = {
    effect: (fn) => { const dispose = fn(); return dispose },
    webServer: { register: (route) => { state.route = route; return () => { state.route = null } } },
    tools: { register: (definition) => { state.tool = definition; return () => { state.tool = null } } },
    logger: { warn: () => {} },
  }
  apply(ctx)
  return state
}

function fakeRes() {
  const res = { status: 0, headers: null, body: '', headersSent: false }
  res.writeHead = (status, headers) => { res.status = status; res.headers = headers; res.headersSent = true }
  res.end = (chunk) => { if (chunk) res.body += String(chunk) }
  return res
}

function fakeReq(method, url, body) {
  const req = { method, url }
  req[Symbol.asyncIterator] = async function* () {
    if (body !== undefined) yield Buffer.from(body)
  }
  return req
}

async function call(route, method, url, body) {
  const res = fakeRes()
  await route.handler(fakeReq(method, url, body), res)
  return res
}

const { route, tool } = boot()

test('registers a prefix route and the design_md tool', () => {
  assert.ok(route && route.kind === 'prefix' && route.path === '/api/design-md')
  assert.ok(tool && tool.name === 'design_md')
  assert.equal(typeof tool.execute, 'function')
})

test('GET /health reports the style count', async () => {
  const res = await call(route, 'GET', '/api/design-md/health')
  assert.equal(res.status, 200)
  const body = JSON.parse(res.body)
  assert.equal(body.ok, true)
  assert.equal(body.count, 84)
})

test('GET /catalog returns every style without build paths', async () => {
  const res = await call(route, 'GET', '/api/design-md/catalog')
  assert.equal(res.status, 200)
  const body = JSON.parse(res.body)
  assert.equal(body.styles.length, 84)
  assert.equal(res.body.includes('/Users/'), false)
  assert.equal('designPath' in body.styles[0], false)
})

test('GET /style/:slug returns tokens and brief', async () => {
  const res = await call(route, 'GET', '/api/design-md/style/apple')
  assert.equal(res.status, 200)
  const body = JSON.parse(res.body)
  assert.equal(body.style.slug, 'apple')
  assert.ok(body.style.visual.accent)
  assert.ok(body.brief.length > 100)
})

test('unknown slug is a 404, traversal is a 400', async () => {
  const missing = await call(route, 'GET', '/api/design-md/style/not-a-real-style')
  assert.equal(missing.status, 404)
  const traversal = await call(route, 'GET', '/api/design-md/style/..%2F..%2Fpackage.json')
  assert.ok(traversal.status === 400 || traversal.status === 404, `traversal ${traversal.status}`)
  assert.equal(traversal.body.includes('/Users/'), false)
})

test('POST /prompt composes a prompt for each surface', async () => {
  for (const surface of ['web', 'webDark', 'slides', 'poster']) {
    const res = await call(route, 'POST', '/api/design-md/prompt',
      JSON.stringify({ slug: 'stripe', surface, requirement: '做一个定价页' }))
    assert.equal(res.status, 200, `${surface} status`)
    const body = JSON.parse(res.body)
    assert.ok(body.prompt.includes('Stripe'), `${surface} brand`)
    assert.ok(body.prompt.includes('#'), `${surface} tokens`)
    assert.equal(body.prompt.includes('undefined'), false, `${surface} undefined`)
    assert.equal(body.style.slug, 'stripe')
    assert.equal(body.chars, [...body.prompt].length)
  }
})

test('structure presets follow the surface family', async () => {
  const prompt = async (surface, structure) => {
    const res = await call(route, 'POST', '/api/design-md/prompt', JSON.stringify({ slug: 'stripe', surface, structure }))
    assert.equal(res.status, 200)
    return JSON.parse(res.body).prompt
  }
  assert.ok((await prompt('slides', 'pitch')).includes('## 页面结构'), 'slides + deck preset keeps its outline')
  assert.ok((await prompt('slides', 'product')).includes('行动号召'), 'product deck carries its own outline')
  assert.ok((await prompt('slides', 'venture')).includes('里程碑'), 'fundraising deck carries its own outline')
  assert.ok((await prompt('slides', 'venture')).includes('1600×900'), 'deck prompt carries layout constraints')
  const dense = await call(route, 'POST', '/api/design-md/prompt', JSON.stringify({ slug: 'stripe', surface: 'slides', structure: 'deck', density: 'dense' }))
  assert.equal(dense.status, 200)
  const denseBody = JSON.parse(dense.body)
  assert.equal(denseBody.density, 'dense')
  assert.ok(denseBody.prompt.includes('版式密度（信息密集）'), 'density block is emitted')
  assert.ok(denseBody.prompt.includes('每页信息块上限：4 个'), 'dense budget')
  assert.ok(denseBody.prompt.includes('data-theme'), 'deck asks for a theme switch')
  assert.ok(denseBody.prompt.includes('打印 / 导出 PDF'), 'deck asks for a print / export PDF button')
  assert.ok(denseBody.prompt.includes('@page{size:1600px 900px'), 'deck asks for 16:9 print pages')
  const badDensity = await call(route, 'POST', '/api/design-md/prompt', JSON.stringify({ slug: 'stripe', surface: 'slides', density: 'huge' }))
  assert.equal(JSON.parse(badDensity.body).density, 'standard', 'unknown density falls back to standard')
  assert.ok((await prompt('slides', 'training')).includes('延伸资料'), 'training deck carries its own outline')
  assert.ok((await prompt('web', 'pricing')).includes('## 页面结构'), 'web + page preset keeps its outline')
  assert.ok((await prompt('web', 'landing')).includes('打印 / 导出 PDF'), 'web page asks for a print / export PDF button')
  assert.ok((await prompt('web', 'landing')).includes('@page{size:A4 portrait'), 'web page asks for A4 print pages')
  assert.ok((await prompt('webDark', 'auto')).includes('break-inside: avoid'), 'dark page also asks for clean page breaks')
  assert.equal((await prompt('slides', 'pricing')).includes('## 页面结构'), false, 'web preset is dropped on slides')
  assert.equal((await prompt('web', 'deck')).includes('## 页面结构'), false, 'deck preset is dropped on web')
  assert.equal((await prompt('slides', 'auto')).includes('## 页面结构'), false, 'auto has no outline')
})

test('POST /prompt rejects bad input without leaking internals', async () => {
  const badJson = await call(route, 'POST', '/api/design-md/prompt', '{"oops}')
  assert.equal(badJson.status, 400)
  assert.equal(badJson.body.includes('/Users/'), false)

  const noSlug = await call(route, 'POST', '/api/design-md/prompt', JSON.stringify({ surface: 'web' }))
  assert.equal(noSlug.status, 400)

  const protoSurface = await call(route, 'POST', '/api/design-md/prompt',
    JSON.stringify({ slug: 'stripe', surface: 'constructor' }))
  assert.equal(protoSurface.status, 200)
  assert.equal(JSON.parse(protoSurface.body).prompt.includes('undefined'), false)
})

test('unknown routes answer 404', async () => {
  const res = await call(route, 'GET', '/api/design-md/nope')
  assert.equal(res.status, 404)
})

test('design_md tool lists and gets styles', async () => {
  const list = await tool.execute({ action: 'list', query: '金融' }, {})
  assert.ok(list.items.length >= 5)
  assert.equal(list.truncated, false)
  const one = await tool.execute({ action: 'get', slug: 'stripe' }, {})
  assert.equal(one.style.slug, 'stripe')
})
