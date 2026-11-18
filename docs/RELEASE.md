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

## 5. npm 发布（MANUAL：npm 账号 + Token/2FA）

```bash
npm view dsh-design-leapavid version      # 2026-11-18 实测仍 404 = 包名未被占用，尚未发布
npm whoami                          # 2026-11-18 实测 need auth = 本机未登录 npm
npm publish --access public         # MANUAL
```

- 发布后用 `npm view dsh-design-leapavid@1.0.0 dist.tarball dist.integrity` 与本地 `npm pack` 的 shasum 对应。
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

`docs/market-entry.json` 是提交给精选清单 `iasiv5/dsh-m` 的 `registry.json` 用的条目；`docs/market-entry.npm.json` 是同一份内容的 npm 变体（等 npm 发布后换用）；`docs/hub-registry.json` 是按清单格式包好的本地预演文件（`{ "version": 1, "plugins": [ … ] }`）。

2026-11-18 按上游 [registry-copy-guide](https://github.com/iasiv5/dsh-m/blob/main/docs/registry-copy-guide.md) 校正后的关键决定：

- **来源改 `github`**：精选清单里已有 `source: "github"` 的条目（如 `qiaomu-rss-dsh`），dsh-m 会锁定 release / tag 的 commit SHA 安装——**不必先发 npm**。代价是仓库必须公开（当前 `magiccyclingz/dsh-design-leapavid` 仍是 **private**，这是上架唯一硬阻塞）。
- **description 40 全角当量**（上限 60，卡片只显示两行）：`品牌设计语言库：84 套 token 现场渲染，选一套写清需求即生成网页、幻灯片与信息图。`
- **tags 4 个**，只放功能词、不带「需/推荐」前缀：品牌 / 提示词 / 幻灯片 / 信息图。
- **`verified` 留空**：三方条目默认不填（带来逐宿主版本复测义务）；实测记录写进 PR 描述即可。
- **去掉 `icon`**：jsDelivr 图标地址依赖 npm 已发布，未发布时是死链；缺省时 dsh-m 回退 GitHub 头像。
- **`alsoCategories` 去掉**：原先写的 `claude-picks` 不是合法桶名（合法值为 `essentials` / `cui-picks` / `baoyu` / `guizang` / `self-dev` / `tencent-lighthouse` / `watchlist`），主桶 `self-dev` 已够。
- **`screenshots` 用仓库相对路径**（github 源条目支持）：`docs/screenshots/info-list.jpg`、`detail.jpg`、`deck-1.jpg`。

上架路径（按成本排序）：

1. **仓库转 public + 精选 PR（推荐，零 npm 依赖）**：
   ```bash
   gh repo edit magiccyclingz/dsh-design-leapavid --visibility public --accept-visibility-change-consequences   # MANUAL
   # 打一个 release（dsh-m 跟踪 tag/release，而不是 main 的最新提交）
   gh release create v1.33.5 --title "v1.33.5" --notes "见 CHANGELOG"                                    # MANUAL
   # 到 iasiv5/dsh-m 提 PR：把 docs/market-entry.json 追加进 registry.json 的 plugins 数组                # MANUAL
   ```
2. **npm 发布后再走 npm 源**（需要 `npm login`，本机当前 `need auth`）：
   ```bash
   npm login && npm publish --access public      # MANUAL
   ```
   然后把条目换成 `docs/market-entry.npm.json` 的内容。
3. **社区目录**：自动抓 npm，只有第 2 步完成后才会出现，抓取频率未知。

本地预演（无需账号，验证清单能解析、卡片能渲染）：把 dsh-m 设置里的精选清单地址改成 `file:///Users/openclaw/Projects/dsh-design-leapavid/docs/hub-registry.json`（或本机绝对路径）。注意预演只验证清单与卡片；安装仍要等仓库公开或 npm 发布。
