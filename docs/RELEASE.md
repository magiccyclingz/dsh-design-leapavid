# dsh-design-leapavid 发布清单

当前版本 `1.33.3`（2026-11-18）。标 **MANUAL** 的步骤需要维护者账号、凭据或在 GUI 里手工操作；本文件不记录、也不要求写入任何密钥或 Token。

仓库：`/Users/openclaw/Projects/dsh-design-leapavid`，远程 `https://github.com/magiccyclingz/dsh-design-leapavid`（2026-11-18 已推到 `main`，tag 到 `v1.33.3`）。
本机基线：Node `v24.16.0`、npm `12.0.1`、DSH 桌面版 `0.2.2-rc.3`；包声明 `type: module`，Node 要求 ≥ 22.19.0。

## 1. 本地校验（无需凭据）

```bash
cd /Users/openclaw/Projects/dsh-design-leapavid

# 语法
node --check index.js && node --check client.js

# catalog 可解析 + 条数
node -e "const c=JSON.parse(require('fs').readFileSync('data/catalog.json','utf8'));console.log(c.styles.length)"

# catalog 的 slug 集合必须与两个数据目录完全一致（应为 84 / 84 / 84）
node -e "
const fs=require('fs');
const c=JSON.parse(fs.readFileSync('data/catalog.json','utf8')).styles.map(s=>s.slug).sort();
for (const d of ['design','brief']) {
  const f=fs.readdirSync('data/'+d).filter(x=>x.endsWith('.md')).map(x=>x.slice(0,-3)).sort();
  console.log(d, f.length, JSON.stringify(f)===JSON.stringify(c) ? 'OK' : 'MISMATCH');
}"
```

2026-11-18 实测：两条 `node --check` 通过、`npm test` 23 pass / 0 fail；catalog 84 条；`design` / `brief` 各 84 个文件且 slug 集合与 catalog 一致。

## 2. 打包自检（无需凭据）

```bash
npm pack --dry-run --json > /tmp/pack.json
node -e "
const p=Object.values(require('/tmp/pack.json'))[0];   // npm 12 的 JSON 以包名为 key
const f=p.files.map(x=>x.path);
console.log('files', p.entryCount, 'size', p.size);
console.log('data', f.filter(x=>x.startsWith('data/')).length);
console.log('bad', f.filter(x=>/^(build\/|node_modules\/)|\.DS_Store$|\.tgz$|shots\/|demo\//.test(x)));
"
```

预期与判据：

- 文件数 **182**（13 个根文件 + 169 个 `data/` 文件）；tarball **850,996 B ≈ 831 KB**；解包 **3.74 MB**（2026-11-18 实测，1.33.3）。`CHANGELOG.md` 在 `files` 白名单内，`docs/` 不在、默认不打包。
- 必须包含：`index.js`、`client.js`、`package.json`、`cordis.patch.yml`、`icon.svg`、`README.md`、`locale/*.json`、`locale/*.md`、`data/catalog.json`、`data/design/×84`、`data/brief/×84`。
- 必须不包含：`build/`（含 `shots/`、`demo/`、`report.txt`）、`node_modules`、`.DS_Store`、`*.tgz`。npm 默认忽略 `.DS_Store`，实测 tarball 内无该项。
- 内容提示：`data/catalog.json` 已**不含**构建机绝对路径（`grep -c '/Users/' data/catalog.json` = 0）；`designPath` 不再写盘，`source.main/cn` 改为相对标识，`sourceUrl` 为 `https://getdesign.md/<slug>/design-md`。

## 3. `package.json` 定稿（已完成）

- `private` 已删除；已补 `license: MIT` / `author: LeapAvid` / `keywords`（含 `dsh-plugin`）/ `engines.node >= 22.19.0`；`CHANGELOG.md` 已在 `files` 内。
- `repository` / `homepage` 已补为 `https://github.com/magiccyclingz/dsh-design-leapavid`。
- 凭据只走 `npm login` 或环境变量 `NPM_TOKEN`，不要写进仓库任何文件。

## 4. Git 提交与打标（MANUAL：需要远程仓库与推送凭据）

已完成（本地）：

```bash
git init
git add -A && git commit -m "feat: dsh-design-leapavid 1.0.0 — 84 套品牌设计语言的侧栏风格库"
git tag -a v1.0.0 -m "dsh-design-leapavid 1.0.0"
```

待办（MANUAL，需要仓库写权限）：

```bash
git remote add origin <仓库地址>
git push -u origin main --tags
```

- 先确认 `.gitignore` 生效：`build/shots`、`build/demo`、`node_modules`、`*.tgz`、`.DS_Store` 不入库。
- tag 名须与 `package.json` 的 `version` 对齐（`v1.0.0`）。

## 5. npm 发布（MANUAL：只差 `npm login`）

**2026-11-18 已就绪的部分**（1.36.2）：

```bash
node --check index.js && node --check client.js   # 语法
npm test                                          # 27 pass
npm pack --dry-run --json                         # 182 文件 / tarball 856KB / 解包 3.75MB
```

- `package.json` 已加 `publishConfig: { access: "public", registry: "https://registry.npmjs.org/" }`，`npm publish` 不需要再带 `--access public`。
- `scripts.prepublishOnly = "npm test"`：发布前自动跑 27 项测试，失败即中止。
- `npm pack` 清单已核对：`build/`、`docs/`、`test/` 都不入包（0 命中），`LICENSE` / `README.md` / `CHANGELOG.md` / `THIRD-PARTY-NOTICES.md` / `icon.svg` / `cordis.patch.yml` 齐全，`data/` 169 个文件、`locale/` 4 个文件。
- 包名状态：**已发布**，`npm view dsh-design-leapavid version` = `1.36.5`（shasum `82accd3b8ead432b238382ceda1f63019600c894`，182 文件 / 3.75 MB 解包）；`0.0.0-stage` 占位版本已 `npm deprecate` 标为占位。

**仍需人工的两步**：

```bash
npm login                            # MANUAL：本机当前 need auth，需账号 + 2FA
npm publish                          # MANUAL：prepublishOnly 会自动跑测试
npm view dsh-design-leapavid version # 验证：出现 1.36.2 即成功
```

- 凭据只走 `npm login` 或环境变量 `NPM_TOKEN`，不要写进仓库任何文件（见第 4 节）。
- 发布后用 `npm view dsh-design-leapavid@1.36.2 dist.tarball dist.integrity` 与本地 `npm pack` 的 shasum 对应。
- 包名一旦发布即长期占用；`unpublish` 仅 72 小时内可靠。

## 6. DSH 插件市场路径

本机已确认的事实（只读核对）：

- 桌面 profile 里本插件是 **`link:` 安装**（`"dsh-design-leapavid": "link:/Users/openclaw/Projects/dsh-design-leapavid"`），不是从 tarball 装的；所以本节的打包/发布链路只影响**未来分发**。
- 市场插件 `dsh-m@0.12.20` 已装在 desktop profile，会话内提供 `dshm_search` / `dshm_install` / `dshm_list` / `dshm_upgrade` 等工具。
- 社区目录是上游数据源 `dsh-plugin-catalog`，实际从 `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog@{version}/plugins.json` 取，回退 `registry.npmmirror.com` 与 `unpkg.com`；社区条目 id 由 `owner--name` 合成；精选条目在 `registry.json` 里显式给出 `id` 与 `npm` 包名（如 `id: dsh-m`、`npm: dsh-m`）。
- 精选清单是 dsh-m 包内 `registry.json`（上游 GitHub `iasiv5/dsh-m`），也可在设置里换成 HTTPS / 本机绝对路径 / `file://` 的自定义清单。

发布/上架步骤：

1. 先完成第 5 步 npm 发布；未发到公共 registry 的包不会出现在社区目录里。
2. 社区目录收录由上游抓取，节奏与规则不在本仓库，**无法在无凭据情况下验证收录时延**（MANUAL：若上游要求提交，用其仓库流程提）。
3. 想进精选区：向 `iasiv5/dsh-m` 的 `registry.json` 提 PR — **MANUAL**（需要 GitHub 账号与 PR 权限）。
4. 不想等收录、又想验证市场链路：在 dsh-m 设置里用本机绝对路径或 `file://` 指向自建的 `registry.json` 做预演（无需任何账号）。
5. 本机试装：官方插件管理页添加 `dsh-design-leapavid`（发布后），或 `plugin_manager action=install_bundle target=<bundle 目录绝对路径>`（本地目录，已核对 DSH 侧语义就是绝对 bundle 目录）。

## 7. 发布后回归（本机，无需凭据）

- 安装后左栏出现「设计风格库」，84 张卡片、搜索、三种预览形态（网页 / 幻灯片 / 信息图）+ 浅色/深色切换可用；卡片可收藏、缩略图懒渲染、分类筛选带数量，内容页有用途预设、信息图的版式/比例/密度与 token 导出。
- `design_md` 工具：`list` 有结果、`get` 能返回 token 与 brief。
- `GET /api/design-md/catalog` 返回 `count: 84`；`GET /api/design-md/health` 返回 `ok: true`。
- 回滚：`npm deprecate dsh-design-leapavid@1.0.0 "broken"`（72h 内可 `unpublish`）；DSH 侧卸载插件即可回到未安装状态。

## 已知 / 未知

- 已知：打包内容、体积、校验命令、市场插件与本机目录地址、精选清单的提交目标。
- 需要账号或凭据（MANUAL）：npm 发布、git 推送与 tag、精选清单 PR、任何 Token/2FA。
- 未知：社区目录的抓取频率与收录延迟、精选审核时限；这些只能由维护者账号在发布后观察。

## 8. 上架条目（按 dsh-m 文案规范重写）

`docs/market-entry.json` 是提交给精选清单 `iasiv5/dsh-m` 的 `registry.json` 用的条目，现在**已切到 npm 源**（`source: npm` + `npm: dsh-design-leapavid` + jsDelivr `icon`；registry schema 没有 `version` 字段，版本由 `verified` 与 npm 自身表达）；同一份内容的 GitHub 源变体保留在 `docs/market-entry.github.json`（清单或聚合方不支持 npm 源时用它）；`docs/hub-registry.json` 是按清单格式包好的本地预演文件（`{ "version": 1, "plugins": [ … ] }`），同样已是 npm 源。

上游对文案有硬约束（[registry-copy-guide.md](https://github.com/iasiv5/dsh-m/blob/main/docs/registry-copy-guide.md)）：描述 ≤60 全角当量、不放无保鲜机制的精确数字（所以没写「84 套」）、`tags` ≤4 且不带「需 / 推荐」、`icon` 用 jsDelivr 浮动大版本（`@1`，禁止钉全版本）、`verified` 只写实测过的 DSH 代际并在描述末尾挂「已适配 …，详见仓库」句式。这些由 `test/market-entry.test.mjs` 机械校验（7 项）。

提 PR 时 `registry.json` 是**紧凑单行风格**，可直接把 `docs/market-entry.line.txt` 里的这一行追加进 `plugins` 数组（不要 `JSON.parse` 后整体重排），同时按 guide §11 三连同步计数与 trail：

```json
{"id": "dsh-design-leapavid", "name": "LeapAvid 设计风格库", "description": "品牌设计语言库：选一套风格写清需求，即生成网页、幻灯片与信息图。已适配 0.2.2-rc.3，详见仓库", "category": "self-dev", "tags": ["品牌", "提示词", "幻灯片", "信息图"], "verified": ["0.2.2-rc.3"], "source": "npm", "npm": "dsh-design-leapavid", "github": "magiccyclingz/dsh-design-leapavid", "screenshots": ["docs/screenshots/info-list.jpg", "docs/screenshots/detail.jpg", "docs/screenshots/deck-1.jpg"], "icon": "https://cdn.jsdelivr.net/npm/dsh-design-leapavid@1/icon.svg", "homepage": "https://github.com/magiccyclingz/dsh-design-leapavid"}
```

2026-11-18 按上游 [registry-copy-guide](https://github.com/iasiv5/dsh-m/blob/main/docs/registry-copy-guide.md) 校正后的关键决定：

- **来源用 `npm`**：包已发布（`latest = 1.36.5`），dsh-m 对 npm 源按包名安装并跟随 latest，不必再锁 tag；仓库 public 仅作为源码与 README 的着陆页。GitHub 源变体留在 `docs/market-entry.github.json`，供不支持 npm 源的清单使用。
- **description 45.5 全角当量**（上限 60，卡片只显示两行）：`品牌设计语言库：选一套风格写清需求，即生成网页、幻灯片与信息图。已适配 0.2.2-rc.3，详见仓库` —— 按 §2 去掉了「84 套」这类需要保鲜机制的数字。
- **tags 4 个**，只放功能词、不带「需 / 推荐」前缀：品牌 / 提示词 / 幻灯片 / 信息图。
- **`verified: ["0.2.2-rc.3"]`**：本条属 coupled（依赖 DSH 的 slot 与 webServer API，DSH 升级需复测），描述末尾按 §4 挂「已适配 …，详见仓库」句式。
- **`icon`**：`https://cdn.jsdelivr.net/npm/dsh-design-leapavid@1/icon.svg` —— §10 要求钉浮动大版本 `@1`，禁止钉全版本。实测 `curl` 返回 `200 image/svg+xml` / 626 B。
- **守卫**：`test/market-entry.test.mjs` 校验上述全部约束（宽度、禁数字、tags、schema 键、source 自洽、verified 与描述尾巴、icon 形态、两个变体一致性、hub 预演同步）；改条目先跑 `npm test`。
