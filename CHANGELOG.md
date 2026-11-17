# 更新日志

本文件遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.2.1] - 2026-11-18

### 修复（整体复查）

- `THIRD-PARTY-NOTICES.md` 现在随 npm 包分发（此前只在仓库里，`files` 未包含，会导致 MIT 声明不跟随副本）。
- 复制提示词时 `navigator.clipboard.writeText()` 在非用户手势环境下会**永久 pending**，按钮静默无响应；改为 1.5s 竞速 + textarea `execCommand` 兜底，失败才算错误。
- 预览页里的 `Open DESIGN.md` / `Dark Preview` 两个按钮此前是纯装饰，点了没反应；现在分别接到「打开 DESIGN.md 弹窗」与「切换浅色 / 深色」，且按钮文案随主题变化。
- 中文定位文案去重：9 条 `positioningZh` 曾经字面重复（同类风格命中同一模板），现在每句都带品牌名与自己的圆角 / 间距数值，84 条全部唯一。
- 文档与实现对齐：README 的「四种预览形态」改为三种 + 内容页浅深切换；`locale/detail.zh.md`、`docs/RELEASE.md` 同步。

## [1.2.0] - 2026-11-18

### 变更（许可与文案）

- 中文文案改为本项目自建：`summaryZh` / `positioningZh` / `styleKeywords` / `tagsZh` / `useCases` / `bestFor` / `avoidFor` / `aiChecklist` / `recommendedPromptZh` 全部由 `build/build-data.mjs` 依据每个风格的 token（底色、强调色、字体类别、字重、圆角、密度、对比）生成，不再读取第三方中文元数据。
- 数据构建不再依赖 `awesome-design-md-cn`；输入只剩 VoltAgent 的 MIT 语料 + `build/zh-lexicon.json`（名称与分类标签）+ `build/extra-metadata.json`。
- 新增 `THIRD-PARTY-NOTICES.md`（VoltAgent MIT 版权声明全文）与 README 的「许可与归属」「免责声明」两节。

## [1.1.0] - 2026-11-17

### 变更（面板改版）

- 预览形态从「网页·亮 / 网页·暗 / 幻灯片 / 海报」收敛为「网页 / 幻灯片 / 海报」，网页的浅色与深色改到内容页内切换；深色品牌（`darkFirst`）不显示浅色开关，改为标注「该品牌本身为深色」。
- 网页预览重写为参考页结构：导航（品牌 + 8 个锚点 + 胶囊）+「Design System Inspired by <品牌>」大标题 + 01 Colors / 02 Typography / 03 Buttons / 04 Cards / 05 Forms / 06 Spacing / 07 Radius / 08 Elevation 八个区块 + 页脚，全部由该风格的 token 渲染；内容页整页直出、不内滚。
- 内容页改为两栏：左栏完整预览，右栏「生成表单 → 适合·避免 → 设计要点 → 配色 → 排版要求 → 形状与间距 → 组件样例」；表单置顶。
- 列表卡片改为全宽自适应网格（3 / 4 / 5 列，窄屏 2 / 1 列），每卡增加关键词行与 3 行中文介绍（按卡片宽度自动对齐行数）。
- 面板外壳换成 Figma 风格的黑白配色：`#000` 主色、8px 小圆角、1px 发丝线、浅灰搜索框；仍走 DSH 主题 token，跟随宿主深浅色。

### 修复

- 预览内的字体改为一律展开成 `font-size` / `line-height` / `font-family` 长写法（`font` 简写不接受 `cqw`，会让整块文字退回 16px 并撑破卡片）。
- 切换形态时预览容器滚回顶部。

## [1.0.0] - 2026-11-17

### 新增

- 左侧栏入口与主面板（`client.js`，slots：`sidebar.panellist` / `main`）：「设计风格库」网格，84 张风格卡片；支持按名称 / 关键词 / 场景 / 标签搜索，按分类筛选（8 个分类 +「全部」），并在网页·亮 / 网页·暗 / 幻灯片 16:9 / 海报 3:4 四种预览形态间切换。预览由该风格自身的 token 现场渲染，不使用截图、iframe 或外部资源。
- 风格详情：设计要点、配色板（点色块复制 hex）、字体层级、圆角与间距、适合 / 避免、AI 检查项、推荐提示词与来源链接。
- 生成表单：选择产出形态（`web` / `webDark` / `slides` / `poster`）、填写需求，可勾选附带完整 `DESIGN.md`；提示词由 Host 组装后送进当前会话，不在插件内直接调用模型。
- Agent 工具 `design_md`：`list`（按关键词或分类检索）与 `get`（读取单个风格的 token 与要点，可选 `withDesign` 返回完整 DESIGN.md）。
- Host HTTP 路由 `/api/design-md/*`：`GET catalog`、`GET style/:slug`、`GET brief/:slug`、`GET design/:slug`、`POST prompt`。
- 插件元信息与详情页：`locale/{zh,en}.json`、`locale/detail.{zh,en}.md`、`icon.svg`、`cordis.patch.yml`。

### 变更

- 首次发布，无可比对的旧版本。

### 修复（发布前评审）

- 国际版：读取宿主 locale 时取 `.active`（此前拿到 snapshot 对象导致面板恒显示中文），并在 locale 切换时重渲染；分类筛选改用 `null` 表示「全部」，避免英文界面下网格为空。
- 详情页 DESIGN.md 弹层补齐可访问性：`role="dialog"`、`aria-modal`、`aria-labelledby`、Escape 关闭、Tab 焦点循环、遮罩层滚动锁、打开时聚焦关闭按钮并在关闭后归位。
- 目录请求在模块内缓存（5 分钟 TTL），切换面板不再重复下载约 500KB 的 catalog；筛不到结果时提供「清除筛选」，不再靠整页刷新重试。
- `design_md list` 分页：新增 `offset` 参数与 `returned` / `truncated` 字段，render 明示「本页显示 N 个，传 offset 继续」，不再静默截断 40/84。
- Host 路由错误语义：请求体过大 → 413（先排空再响应）、JSON 解析失败 → 400、slug 缺失 → 400、风格不存在或数据文件缺失 → 404（通用文案，不回显绝对路径）、其余 → 500（`internal error`，细节只写日志）。
- `/prompt` 校验：`surface` 只接受 `SURFACES` 自有键（`Object.hasOwn`，修掉 `constructor` 原型命中导致交付要求写成 `undefined`）；`includeDesign` 严格判定 `=== true`。
- 视觉细化：圆角按画板尺寸缩放（缩略图不再是胶囊）；每张卡片加入由该风格自身色板派生的媒体块；空 hex 不进提示词色板；`chars` 改按码点计数。
- 交互与排版：焦点可见样式、卡片副标题去重、色板 key 去重、卡片计数显示「筛选数/总数」、空需求不可发送、字号层级按实际比例归一、圆角/间距改为人读的标签表、设计要点默认折叠（展开看全文）。

### 数据

- `data/catalog.json`：84 条风格记录（token、视觉参数、中文元数据），843,632 字节（823.9 KiB）。
- `data/design/<slug>.md`：84 份 DESIGN.md 原文副本；`data/brief/<slug>.md`：84 份风格要点摘要；slug 集合与 catalog 完全一致。
- 语料来自 getdesign.md 开源库（awesome-design-md / awesome-design-md-cn）。10 个主库独有风格的中文元数据在 `build/extra-metadata.json`，视觉推导的手工修正在 `build/overrides.json`——两者是构建输入，不随 npm 包分发。

### 已知边界

- 品牌字体（Sohne、Copernicus、SF Pro 等）不随插件分发，预览回退到系统 sans / serif / mono；风格差异靠字号、字重、字距、层级与密度表达。
- 预览里的文案是示意内容，用于展示排版气质，不代表真实项目文案。
- 生成消耗调用方自己的模型额度；插件对工作区只读，不写文件。
- `build/`（构建脚本、报告、截图、demo）是开发产物，不进入分发包。
- 预览不加载任何网络资源（无字体、图片、CDN），完全由 token 渲染，因此离线可用；代价是品牌专有字体一律走系统回退栈。
