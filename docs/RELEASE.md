# dsh-design-md 发布清单

面向首次发布 `1.0.0`（2026-11-17）。标 **MANUAL** 的步骤需要维护者账号、凭据或在 GUI 里手工操作；本文件不记录、也不要求写入任何密钥或 Token。

仓库：`/Users/openclaw/Projects/dsh-design-md`（当前**不是** git 仓库，需先 `git init`）。
本机基线：Node `v24.16.0`、npm `12.0.1`、DSH 桌面版 `0.2.2-rc.3`；包声明 `type: module`，Node 要求 ≥ 22.19.0。

## 1. 本地校验（无需凭据）

```bash
cd /Users/openclaw/Projects/dsh-design-md

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

2026-11-17 实测：两条 `node --check` 通过；catalog 84 条；`design` / `brief` 各 84 个文件且 slug 集合与 catalog 一致。

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

- 文件数 **179**（10 个根文件 + 169 个 `data/` 文件）；tarball **797,606 B ≈ 779 KB**；解包 **3.43 MB**。新增 `LICENSE` 后文件数为 **180**（npm 自动收录 LICENSE），`CHANGELOG.md` 与 `docs/` 不在 `files` 白名单内、默认**不**打包。
- 必须包含：`index.js`、`client.js`、`package.json`、`cordis.patch.yml`、`icon.svg`、`README.md`、`locale/*.json`、`locale/*.md`、`data/catalog.json`、`data/design/×84`、`data/brief/×84`。
- 必须不包含：`build/`（含 `shots/`、`demo/`、`report.txt`）、`node_modules`、`.DS_Store`、`*.tgz`。npm 默认忽略 `.DS_Store`，实测 tarball 内无该项。
- 内容提示：`data/catalog.json` 含构建机绝对路径（86 处 `/Users/openclaw/...`，字段 `designPath` 与 `source`）。运行时不暴露（`index.js` 的 `projectStyle()` 已剔除），但原始 JSON 会随包分发；介意的话在发布前重建/裁剪该字段（会改动现有文件，由 lead 决定）。

## 3. `package.json` 定稿（MANUAL：由 lead 编辑，不代改）

- 删除 `"private": true`（否则 `npm publish` 直接拒绝）。
- 补 `license` / `repository` / `homepage` / `keywords` / `author` / `engines`（建议值见交付回复）。
- 想随包分发变更日志，就把 `"CHANGELOG.md"` 加进 `files`。
- 凭据只走 `npm login` 或环境变量 `NPM_TOKEN`，不要写进仓库任何文件。

## 4. Git 提交与打标（MANUAL：需要远程仓库与推送凭据）

```bash
git init
git add -A
git commit -m "release: dsh-design-md 1.0.0"
git tag -a v1.0.0 -m "dsh-design-md 1.0.0"
# MANUAL：添加远程并推送（需要仓库写权限）
git remote add origin <仓库地址>
git push -u origin main --tags
```

- 先确认 `.gitignore` 生效：`build/shots`、`build/demo`、`node_modules`、`*.tgz`、`.DS_Store` 不入库。
- tag 名须与 `package.json` 的 `version` 对齐（`v1.0.0`）。

## 5. npm 发布（MANUAL：npm 账号 + Token/2FA）

```bash
npm view dsh-design-md version      # 2026-11-17 实测 404 = 包名在公共 registry 上未占用
npm publish --access public         # MANUAL
```

- 发布后用 `npm view dsh-design-md@1.0.0 dist.tarball dist.integrity` 与本地 `npm pack` 的 shasum 对应。
- 包名一旦发布即长期占用；`unpublish` 仅 72 小时内可靠。

## 6. DSH 插件市场路径

本机已确认的事实（只读核对）：

- 桌面 profile 里本插件是 **`link:` 安装**（`"dsh-design-md": "link:/Users/openclaw/Projects/dsh-design-md"`），不是从 tarball 装的；所以本节的打包/发布链路只影响**未来分发**。
- 市场插件 `dsh-m@0.12.20` 已装在 desktop profile，会话内提供 `dshm_search` / `dshm_install` / `dshm_list` / `dshm_upgrade` 等工具。
- 社区目录是上游数据源 `dsh-plugin-catalog`，实际从 `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog@{version}/plugins.json` 取，回退 `registry.npmmirror.com` 与 `unpkg.com`；社区条目 id 由 `owner--name` 合成；精选条目在 `registry.json` 里显式给出 `id` 与 `npm` 包名（如 `id: dsh-m`、`npm: dsh-m`）。
- 精选清单是 dsh-m 包内 `registry.json`（上游 GitHub `iasiv5/dsh-m`），也可在设置里换成 HTTPS / 本机绝对路径 / `file://` 的自定义清单。

发布/上架步骤：

1. 先完成第 5 步 npm 发布；未发到公共 registry 的包不会出现在社区目录里。
2. 社区目录收录由上游抓取，节奏与规则不在本仓库，**无法在无凭据情况下验证收录时延**（MANUAL：若上游要求提交，用其仓库流程提）。
3. 想进精选区：向 `iasiv5/dsh-m` 的 `registry.json` 提 PR — **MANUAL**（需要 GitHub 账号与 PR 权限）。
4. 不想等收录、又想验证市场链路：在 dsh-m 设置里用本机绝对路径或 `file://` 指向自建的 `registry.json` 做预演（无需任何账号）。
5. 本机试装：官方插件管理页添加 `dsh-design-md`（发布后），或 `plugin_manager action=install_bundle target=<bundle 目录绝对路径>`（本地目录，已核对 DSH 侧语义就是绝对 bundle 目录）。

## 7. 发布后回归（本机，无需凭据）

- 安装后左栏出现「设计风格库」，84 张卡片、搜索与四种预览可用。
- `design_md` 工具：`list` 有结果、`get` 能返回 token 与 brief。
- `GET /api/design-md/catalog` 返回 `count: 84`；`GET /api/design-md/health` 返回 `ok: true`。
- 回滚：`npm deprecate dsh-design-md@1.0.0 "broken"`（72h 内可 `unpublish`）；DSH 侧卸载插件即可回到未安装状态。

## 已知 / 未知

- 已知：打包内容、体积、校验命令、市场插件与本机目录地址、精选清单的提交目标。
- 需要账号或凭据（MANUAL）：npm 发布、git 推送与 tag、精选清单 PR、任何 Token/2FA。
- 未知：社区目录的抓取频率与收录延迟、精选审核时限；这些只能由维护者账号在发布后观察。
